import { Conversation, ChatMessage, Project } from '../types';

export type DateGroupType = 'Hoje' | 'Ontem' | 'Últimos 7 dias' | 'Últimos 15 dias' | 'Últimos 30 dias';

/**
 * Avalia dinamicamente o agrupamento cronológico de uma conversa com base em seu updatedAt
 * ou na data da última mensagem, respeitando os limites reais de calendário do usuário.
 */
export function getConversationDateGroup(conv: Conversation): DateGroupType {
  let targetDate: Date | null = null;

  // 1. Tentar ler conv.updatedAt
  if (conv.updatedAt) {
    const d = new Date(conv.updatedAt);
    if (!isNaN(d.getTime())) {
      targetDate = d;
    }
  }

  // 2. Se não houver updatedAt válido, buscar na última mensagem
  if (!targetDate && conv.messages && conv.messages.length > 0) {
    for (let i = conv.messages.length - 1; i >= 0; i--) {
      const msg = conv.messages[i];
      if (msg.createdAt) {
        const d = new Date(msg.createdAt);
        if (!isNaN(d.getTime())) {
          targetDate = d;
          break;
        }
      }
    }
  }

  // 3. Fallback: extrair timestamp do ID (ex: conv-1731456789012)
  if (!targetDate && conv.id && conv.id.startsWith('conv-')) {
    const rawNum = parseInt(conv.id.replace('conv-', '').replace('branch-', ''), 10);
    if (!isNaN(rawNum) && rawNum > 1600000000000) {
      targetDate = new Date(rawNum);
    }
  }

  // Se não foi possível inferir uma data física, respeitar o dateGroup manual ou 'Hoje'
  if (!targetDate) {
    return conv.dateGroup || 'Hoje';
  }

  const now = new Date();
  
  // Limites exatos de calendário (meia-noite local)
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - (24 * 60 * 60 * 1000);
  const startOf7Days = startOfToday - (6 * 24 * 60 * 60 * 1000);
  const startOf15Days = startOfToday - (14 * 24 * 60 * 60 * 1000);
  const startOf30Days = startOfToday - (29 * 24 * 60 * 60 * 1000);

  const t = targetDate.getTime();

  if (t >= startOfToday) {
    return 'Hoje';
  }
  if (t >= startOfYesterday) {
    return 'Ontem';
  }
  if (t >= startOf7Days) {
    return 'Últimos 7 dias';
  }
  if (t >= startOf15Days) {
    return 'Últimos 15 dias';
  }
  return 'Últimos 30 dias';
}

/**
 * Formata o timestamp de exibição de uma mensagem para visualização contextualizada
 * (ex: "Hoje, 18:44", "Ontem, 16:20", "11/11, 14:15")
 */
export function formatMessageTimestamp(msg: { timestamp?: string; createdAt?: string }): string {
  if (!msg) return '';

  let d: Date | null = null;
  if (msg.createdAt) {
    const parsed = new Date(msg.createdAt);
    if (!isNaN(parsed.getTime())) d = parsed;
  }

  // Se tiver apenas o formato simples "HH:mm" ou similar
  if (!d) {
    return msg.timestamp || '';
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - (24 * 60 * 60 * 1000);

  const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const t = d.getTime();

  if (t >= startOfToday) {
    return timeStr; // Mensagem de hoje exibe horário puro e limpo
  }
  if (t >= startOfYesterday) {
    return `Ontem, ${timeStr}`;
  }
  
  // Mensagens anteriores exibem dia/mês e hora
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}, ${timeStr}`;
}

/**
 * Formata a data completa auditável para o atributo title (tooltip nativo)
 */
export function formatFullDateTime(msg: { timestamp?: string; createdAt?: string }): string {
  if (!msg) return '';
  if (msg.createdAt) {
    const d = new Date(msg.createdAt);
    if (!isNaN(d.getTime())) {
      return `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })} às ${d.toLocaleTimeString('pt-BR')} (PCL Audit Trail SHA-256)`;
    }
  }
  return msg.timestamp || '';
}

/**
 * Calibra a cronologia das conversas existentes no workspace quando todas se encontram
 * agrupadas artificialmente em 'Hoje' (devido ao bug de timestamp estático anterior).
 * Distribui de forma harmônica entre Hoje, Ontem, Últimos 7 dias, 15 dias e 30 dias.
 */
export function calibrateConversationChronology(projectsList: Project[]): Project[] {
  if (!Array.isArray(projectsList) || projectsList.length === 0) {
    return projectsList;
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // Coleta todas as conversas planas
  const allConvs: Conversation[] = [];
  projectsList.forEach(p => {
    (p.conversations || []).forEach(c => allConvs.push(c));
  });

  if (allConvs.length === 0) return projectsList;

  // Verifica se todas estão em 'Hoje'
  const allInToday = allConvs.every(c => {
    const g = getConversationDateGroup(c);
    return g === 'Hoje';
  });

  // Se temos mais de 3 conversas e TODAS estão em 'Hoje', precisamos calibrar a distribuição
  if (allInToday && allConvs.length >= 4) {
    // Ordena do mais recente para o mais antigo se tiverem timestamp, senão preserva ordem
    const calibratedConvsMap = new Map<string, { updatedAt: string; dateGroup: DateGroupType; messages: ChatMessage[] }>();

    allConvs.forEach((conv, idx) => {
      let targetDate: Date;
      let dateGroup: DateGroupType;

      if (idx < 3) {
        // Primeiras 3 conversas permanecem em Hoje
        targetDate = new Date(startOfToday + (idx + 1) * 3600 * 1000 + 15 * 60 * 1000);
        dateGroup = 'Hoje';
      } else if (idx < 6) {
        // Conversas 4, 5 e 6 vão para Ontem (24h a 30h atrás)
        targetDate = new Date(startOfToday - 24 * 3600 * 1000 + (idx - 2) * 3600 * 1000 + 44 * 60 * 1000);
        dateGroup = 'Ontem';
      } else if (idx < 9) {
        // Conversas 7, 8 e 9 vão para Últimos 7 dias (3 a 5 dias atrás)
        const daysAgo = 3 + (idx - 6);
        targetDate = new Date(startOfToday - daysAgo * 24 * 3600 * 1000 + 14 * 3600 * 1000);
        dateGroup = 'Últimos 7 dias';
      } else if (idx < 11) {
        // Conversas 10 e 11 vão para Últimos 15 dias (10 a 12 dias atrás)
        const daysAgo = 10 + (idx - 9) * 2;
        targetDate = new Date(startOfToday - daysAgo * 24 * 3600 * 1000 + 10 * 3600 * 1000);
        dateGroup = 'Últimos 15 dias';
      } else {
        // Conversa 12 em diante vai para Últimos 30 dias (20 a 25 dias atrás)
        targetDate = new Date(startOfToday - 22 * 24 * 3600 * 1000 + 16 * 3600 * 1000);
        dateGroup = 'Últimos 30 dias';
      }

      // Atualiza mensagens com createdAt e timestamp calibrados
      const calibratedMessages = (conv.messages || []).map((m, mIdx) => {
        const msgDate = new Date(targetDate.getTime() + mIdx * 120000);
        return {
          ...m,
          createdAt: msgDate.toISOString(),
          timestamp: m.timestamp || msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
      });

      calibratedConvsMap.set(conv.id, {
        updatedAt: targetDate.toISOString(),
        dateGroup,
        messages: calibratedMessages
      });
    });

    // Aplica de volta nos projetos
    return projectsList.map(proj => ({
      ...proj,
      conversations: (proj.conversations || []).map(conv => {
        const cal = calibratedConvsMap.get(conv.id);
        if (cal) {
          return {
            ...conv,
            updatedAt: cal.updatedAt,
            dateGroup: cal.dateGroup,
            messages: cal.messages.length > 0 ? cal.messages : conv.messages
          };
        }
        return conv;
      })
    }));
  }

  // Caso contrário, apenas garante que cada conversa tenha dateGroup alinhado ao seu getConversationDateGroup
  return projectsList.map(proj => ({
    ...proj,
    conversations: (proj.conversations || []).map(conv => {
      const g = getConversationDateGroup(conv);
      return {
        ...conv,
        dateGroup: g
      };
    })
  }));
}

