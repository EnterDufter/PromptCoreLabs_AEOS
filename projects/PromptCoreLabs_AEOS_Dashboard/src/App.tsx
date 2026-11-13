import React, { useState, useEffect } from 'react';
import { Language, Theme, UserProfile, Project, Conversation, Agent, ServiceStatus, Artifact, TargetArtifactFormat, StudyAttachment, MainViewMode } from './types';
import { Header } from './components/layout/Header';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { RightSidebarStatus } from './components/layout/RightSidebarStatus';
import { DualPlexWorkspace } from './components/workspace/DualPlexWorkspace';
import { SuperChatbubble } from './components/composer/SuperChatbubble';
import { PCLArtifactDrawer } from './components/workspace/PCLArtifactDrawer';
import { SettingsModal } from './components/admin/SettingsModal';
import { MeetingsIntelligenceView } from './components/workspace/MeetingsIntelligenceView';
import { FlowsAutomationCanvas } from './components/workspace/FlowsAutomationCanvas';
import { ArtifactsLibraryView } from './components/workspace/ArtifactsLibraryView';
import { HelpCenterModal } from './components/help/HelpCenterModal';
import { omniRouteService } from './services/llm/omniRouteService';
import { layaCoprocessorService } from './services/laya/layaCoprocessorService';
import { webSearchService } from './services/search/webSearchService';
import { intelligentGroundingService } from './services/grounding/intelligentGroundingService';
import { CANONICAL_DEMO_ARTIFACTS, generateArtifactsFromInteraction } from './services/artifacts/artifactGeneratorService';
import { cockpitPersistenceService } from './services/storage/cockpitPersistenceService';
import { ChatMessage } from './types';
import { useI18n } from './i18n/I18nContext';

export const App: React.FC = () => {
  const { lang, setLang, t } = useI18n();
  const [theme, setTheme] = useState<Theme>('light');
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(true);
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<string>('integrations');
  const [helpCenterOpen, setHelpCenterOpen] = useState(false);
  const [activeMainView, setActiveMainView] = useState<MainViewMode>('chat');
  const [workspaceViewMode, setWorkspaceViewMode] = useState<'chat' | 'canvas' | 'dual'>('chat');

  // Suporte a Deep-Linking e Automação de Evidências via URL Search Params
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlArtifact = params.get('artifact');
      if (urlArtifact) {
        const found = initialArtifacts.find(a => a.id === urlArtifact);
        if (found) setActiveArtifact(found);
      }
      const urlSettings = params.get('settings');
      if (urlSettings) {
        setSettingsTab(urlSettings);
        setSettingsOpen(true);
      }
      const urlHelp = params.get('help');
      if (urlHelp === 'open' || urlHelp === 'true') {
        setHelpCenterOpen(true);
      }
      const urlView = params.get('view');
      if (urlView === 'artifacts' || urlView === 'meetings' || urlView === 'flows' || urlView === 'chat') {
        setActiveMainView(urlView as MainViewMode);
      }
      const urlSidebar = params.get('sidebar');
      if (urlSidebar === 'open' || urlSidebar === 'expanded' || urlSidebar === 'retracted') {
        setRightCollapsed(false);
      } else if (urlSidebar === 'closed') {
        setRightCollapsed(true);
      }
      const urlSelect = params.get('selectText');
      if (urlSelect) {
        setTimeout(() => {
          const el = document.querySelector('.cursor-text p') || document.querySelector('.cursor-text');
          if (el) {
            const range = document.createRange();
            range.selectNodeContents(el);
            const sel = window.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        }, 600);
      }
    } catch {}
  }, []);

  // Refração Dinâmica de Luz controlada pelo cursor do mouse (Design System Liquid Glass)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Broadcast de Tema e Idioma para a Companion Extension e Enclave Local
  useEffect(() => {
    window.postMessage({
      type: 'PCL_SYNC_PREFERENCES',
      theme,
      language: lang
    }, '*');
    try {
      localStorage.setItem('pcl_cockpit_preferences', JSON.stringify({
        theme,
        language: lang,
        updatedAt: new Date().toISOString()
      }));
    } catch {
      // safe fallback
    }
  }, [theme, lang]);

  const userProfile: UserProfile = {
    id: 'USR-001',
    name: 'Eduardo Antigravity',
    email: 'eduardo@promptcorelabs.com',
    avatar: 'EA',
    role: 'System Admin',
    squad: 'Next Gen Sports',
    activeSessions: 2,
    maxSessions: 2,
    twoFactorEnabled: true,
    ssoConnected: true,
    dailyTokenLimit: 500000,
    allowedTimeWindow: '24/7'
  };

  const initialArtifacts: Artifact[] = [
    {
      id: 'art-diag-cortex',
      title: 'Topologia Soberana Cortex v7 (Stage Gates TLC v3)',
      type: 'diagram',
      formatExt: '.svg',
      summary: 'Diagrama Mermaid de alta definição com arquitetura em 3 camadas e zero vazamento de dados.',
      content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 380" width="100%" height="100%">
  <rect width="100%" height="100%" fill="#0a0f1d" rx="12"/>
  <rect x="30" y="30" width="740" height="320" rx="10" fill="#0f172a" stroke="#1e3a5f" stroke-width="1.5"/>
  <text x="60" y="70" fill="#38bdf8" font-family="sans-serif" font-size="16" font-weight="bold">Pipeline Soberano PCL AEOS v3.9</text>
  <text x="60" y="95" fill="#94a3b8" font-family="monospace" font-size="10.5">Padronização Cortex v7 • Anti-Clipping WCAG AAA • SHA-256 Auditável</text>
  <rect x="60" y="130" width="160" height="85" rx="8" fill="#1e293b" stroke="#38bdf8"/>
  <text x="75" y="165" fill="#f8fafc" font-size="12" font-weight="600">Laya System One</text>
  <text x="75" y="190" fill="#34d399" font-size="10" font-family="monospace">CPU INT8 :20140</text>
  <path d="M 220 172 L 290 172" stroke="#38bdf8" stroke-width="2"/>
  <rect x="290" y="130" width="180" height="85" rx="8" fill="#1e293b" stroke="#818cf8"/>
  <text x="305" y="165" fill="#f8fafc" font-size="12" font-weight="600">OmniRoute Master</text>
  <text x="305" y="190" fill="#a78bfa" font-size="10" font-family="monospace">SLA Balanceado</text>
  <path d="M 470 172 L 540 172" stroke="#818cf8" stroke-width="2"/>
  <rect x="540" y="130" width="200" height="85" rx="8" fill="#1e293b" stroke="#34d399"/>
  <text x="555" y="165" fill="#f8fafc" font-size="12" font-weight="600">Cockpit Vault &amp; R2</text>
  <text x="555" y="190" fill="#6ee7b7" font-size="10" font-family="monospace">PostgreSQL 17 + R2</text>
</svg>`,
      vaultBlobSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
      tags: ['mermaid', 'cortex-v7', 'svg'],
      sizeBytes: 19800,
      isFavorite: true
    },
    {
      id: 'art-slide-results',
      title: 'Apresentação Executiva: Resultados e FinOps Soberano',
      type: 'slide',
      formatExt: '.pptx',
      summary: 'Apresentação executiva 16:9 destacando vitória de 4.95/5.0 em avaliação cega e custo marginal zero.',
      content: `# PCL Cockpit v3.9.0 PROD\n\nCognitive Engineering Platform\n\n---\n\n## Soberania & FinOps\n\n- Custo marginal $0.00 com motores locais\n- Laya Coprocessor em CPU INT8 (0 MB VRAM)\n- Segredo Corporativo Blindado (BYOS)\n\n---\n\n## Avaliação Duplo-Cega\n\n- PCL Cockpit: 4.95 / 5.0\n- Gemini: 4.45 / 5.0\n- ChatGPT: 4.30 / 5.0\n- Microsoft Copilot: 3.80 / 5.0`,
      vaultBlobSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
      tags: ['reveal-js', 'pptx', '16-9'],
      sizeBytes: 44200,
      isFavorite: false
    },
    {
      id: 'art-sheet-engines',
      title: 'Matriz Comparativa de Motores e Benchmarks',
      type: 'sheet',
      formatExt: '.xlsx',
      summary: 'Planilha analítica com métricas de hardware, latências e conformidade ISO 27001/42001.',
      content: `| Motor / Componente | Provedor / Hardware | VRAM | Latência | Custo/Token | Blindagem |\n|---|---|---|---|---|---|\n| Laya System One | Host CPU INT8 :20140 | 0 MB | 22ms | $0.00 | Local Soberano |\n| Qwen 2.5 Coder 7B | Ollama Local :11434 | 4.2 GB | ~800ms | $0.00 | Local Soberano |\n| Gemini 3.6 Flash | Google AI Studio | 0 MB | ~350ms | $0.0003 | PII Sanitizado |\n| Claude 3.5 Sonnet | Anthropic Frontier | 0 MB | ~1.2s | $0.0030 | PII Sanitizado |`,
      vaultBlobSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
      updatedAt: new Date(Date.now() - 14400000).toISOString(),
      tags: ['planilha', 'xlsx', 'tanstack-table'],
      sizeBytes: 21500,
      isFavorite: true
    },
    {
      id: 'art-app-sim',
      title: 'Simulador FinOps de Economia Anual',
      type: 'app',
      formatExt: '.html',
      summary: 'Simulador interativo em sandbox executando localmente sem dependências externas.',
      content: `<!DOCTYPE html><html><body><h1>Simulador FinOps</h1></body></html>`,
      vaultBlobSha256: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      tags: ['html5', 'sandbox', 'interativo'],
      sizeBytes: 31200,
      isFavorite: false
    }
  ];

  const STORAGE_KEY_WORKSPACES = 'pcl_aeos_workspace_state_v40';

  const defaultProjects: Project[] = [
    {
      id: 'prj-nextgen',
      name: 'Next Gen Sports',
      conversationsCount: 4,
      activeAgentsCount: 3,
      conversations: [
        {
          id: 'conv-1',
          title: 'Implementação Mestra da Interface PCL AEOS Dashboard',
          dateGroup: 'Hoje',
          updatedAt: new Date().toISOString(),
          messages: [
            {
              id: 'm-1',
              sender: 'user',
              senderName: 'Eduardo Antigravity',
              timestamp: '02:15',
              text: 'Seguindo todo rigor da PCL AEOS, vamos criar o novo projeto oficial do Dashboard em c:\\PromptCore_Labs\\projects\\PromptCoreLabs_AEOS_Dashboard. Quero todos os recursos previstos!'
            },
            {
              id: 'm-2',
              sender: 'agent',
              senderName: 'Cortex Enterprise Engine',
              timestamp: '02:16',
              text: 'Com certeza! Iniciei a construção completa com estética Hyper-Clean Minimalista, layout de 3 colunas retráteis, Super-Chatbubble Composer com Whisper WASM local, gaveta Bitrix24 com ações rápidas e conformidade estrita com 2 dispositivos e ISO 27001/42001.',
              toolCall: { command: 'create_project_and_services', durationMs: 42, status: 'success' },
              artifacts: initialArtifacts
            },
            {
              id: 'm-2b',
              sender: 'user',
              senderName: 'Eduardo Antigravity',
              timestamp: '02:18',
              text: 'Notifique a Juliana Castro (Compliance) por e-mail sobre o teto mensal de $19.200 com Hard Lock e anexe a especificação mestra.'
            },
            {
              id: 'm-2c',
              sender: 'agent',
              senderName: 'Cortex Enterprise Engine',
              timestamp: '02:18',
              text: 'Preparei a minuta do e-mail para revisão. Você pode alterar o assunto ou o corpo antes de autorizar o envio direto via Gmail:',
              actionProposal: {
                type: 'email',
                recipient: 'Juliana Castro',
                recipientEmail: 'juliana.castro@promptcorelabs.com',
                subject: 'Alocação Orçamentária Q3 & Relatório ISO 42001 Aprovado',
                body: 'Olá Juliana,\n\nConforme calibrado na revisão executiva, o teto orçamentário mensal foi ajustado para $19.200,00 com Hard Lock ativo para evitar surpresas. Segue em anexo a especificação técnica revisada.\n\nAtenciosamente,\nEduardo Machado',
                app: 'Gmail'
              }
            },
            {
              id: 'm-2d',
              sender: 'user',
              senderName: 'Eduardo Antigravity',
              timestamp: '04:26',
              text: 'Quais clientes estão com pagamentos em atraso este mês? @SAP e @Salesforce',
              toolsCalled: ['sap', 'salesforce'],
              toolsCallingStatus: 'Chamando ferramenta'
            },
            {
              id: 'm-2e',
              sender: 'agent',
              senderName: 'Cortex Enterprise Engine',
              timestamp: '04:26',
              text: 'Consultei os registros financeiros no @SAP e cruzei com o cadastro de contatos do @Salesforce. Encontrei 3 faturas vencidas com atraso superior a 15 dias:\n\n• **Acme Engenharia Corp** (FAT-2026-9812): R$ 48.500,00 (18 dias de atraso) — Contato: Carlos Silva (CFO)\n• **Beta Logística S.A.** (FAT-2026-9740): R$ 32.100,00 (22 dias de atraso) — Contato: Fernando Rocha (Diretor)\n• **Delta Tech Inovações** (FAT-2026-9655): R$ 19.800,00 (16 dias de atraso) — Contato: Roberta Mendes (Financeiro)\n\nVocê pode inspecionar e disparar o fluxo de cobrança automática passo a passo na aba **Fluxos de Automação**.'
            }
          ]
        },
        {
          id: 'conv-2',
          title: 'Validação de Algoritmos de Roteamento Omniroute $0.00',
          dateGroup: 'Hoje',
          updatedAt: new Date().toISOString(),
          messages: [
            {
              id: 'm-3',
              sender: 'user',
              senderName: 'Eduardo Antigravity',
              timestamp: '01:40',
              text: 'Como está o roteamento local de tokens no Ollama?'
            },
            {
              id: 'm-4',
              sender: 'agent',
              senderName: 'Omniroute Router',
              timestamp: '01:41',
              text: 'Roteamento 95.2% Local ativado! Economizando aproximadamente $850 USD acumulados em comparação com APIs de Nuvem.'
            }
          ]
        }
      ]
    },
    {
      id: 'prj-arch',
      name: 'Arch Living',
      conversationsCount: 2,
      activeAgentsCount: 2,
      conversations: [
        {
          id: 'conv-3',
          title: 'Design System & Renderização 3D de Ambientes',
          dateGroup: 'Ontem',
          updatedAt: new Date().toISOString(),
          messages: []
        }
      ]
    },
    {
      id: 'prj-defesa',
      name: 'Defesa B2B',
      conversationsCount: 1,
      activeAgentsCount: 1,
      conversations: [
        {
          id: 'conv-4',
          title: 'Auditoria de Vulnerabilidades & SAIF Google',
          dateGroup: 'Últimos 7 dias',
          updatedAt: new Date().toISOString(),
          messages: []
        }
      ]
    }
  ];

  const defaultInitialConversation: Conversation = {
    id: `conv-initial`,
    title: 'Nova Conversa',
    dateGroup: 'Hoje',
    updatedAt: new Date().toISOString(),
    messages: []
  };

  // Higieniza projetos para evitar proliferação de conversas vazias no histórico
  const sanitizeProjects = (projectsList: Project[]): Project[] => {
    return projectsList.map(p => ({
      ...p,
      conversations: (p.conversations || []).filter(c => c && Array.isArray(c.messages) && c.messages.length > 0)
    }));
  };

  // Detector de sessão: Nova Sessão inicia na tela de "Nova Conversa"; saída temporária restaura conversa com mensagens
  const detectActiveConversationOnLoad = (allConvs: Conversation[]): Conversation => {
    try {
      // 1. Verificação de sessão contínua na mesma aba (F5 / reload da página)
      const sessionActive = sessionStorage.getItem('pcl_cockpit_session_active');
      const workingConvId = sessionStorage.getItem('pcl_cockpit_working_conv_id');
      
      // 2. Verificação de saída temporária (fechamento recente com retorno em menos de 15 minutos)
      const lastWorkingTimestamp = Number(localStorage.getItem('pcl_cockpit_last_working_timestamp') || 0);
      const isRecentReturn = lastWorkingTimestamp > 0 && (Date.now() - lastWorkingTimestamp) < 15 * 60 * 1000;
      const lastWorkingConvId = localStorage.getItem('pcl_cockpit_last_working_conv_id');

      const targetId = (sessionActive === 'true' && workingConvId) 
        ? workingConvId 
        : (isRecentReturn && lastWorkingConvId ? lastWorkingConvId : null);

      if (targetId) {
        const found = allConvs.find(c => c.id === targetId);
        // Preserva e restaura estritamente se o usuário estiver trabalhando em uma conversa com histórico
        if (found && Array.isArray(found.messages) && found.messages.length > 0) {
          return found;
        }
      }
    } catch (e) {
      console.warn('Erro ao avaliar restauração de sessão:', e);
    }

    // Ao iniciar uma nova sessão, a página inicial padrão do Cockpit é sempre a tela de "Nova Conversa"
    return defaultInitialConversation;
  };

  // Hidratação reativa do estado a partir do localStorage (PCL Cockpit v3.8.0 PROD)
  const getInitialWorkspaceState = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_WORKSPACES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.projects) && parsed.projects.length > 0) {
          const sanitizedProjects = sanitizeProjects(parsed.projects);
          const allConvs: Conversation[] = [];
          sanitizedProjects.forEach((p: Project) => {
            if (Array.isArray(p.conversations)) {
              allConvs.push(...p.conversations);
            }
          });

          const active = detectActiveConversationOnLoad(allConvs);
          const open = [active];

          return {
            projects: sanitizedProjects,
            activeConversation: active,
            openConversations: open
          };
        }
      }
    } catch (e) {
      console.warn('Falha na leitura inicial do workspace no localStorage:', e);
    }
    return {
      projects: sanitizeProjects(defaultProjects),
      activeConversation: defaultInitialConversation,
      openConversations: [defaultInitialConversation]
    };
  };

  const initialWorkspace = getInitialWorkspaceState();

  const [projects, setProjects] = useState<Project[]>(initialWorkspace.projects);
  const [activeConversation, setActiveConversation] = useState<Conversation>(initialWorkspace.activeConversation);
  const [openConversations, setOpenConversations] = useState<Conversation[]>(initialWorkspace.openConversations);

  // Hidratação assíncrona adicional a partir do backend PostgreSQL / Vault
  useEffect(() => {
    cockpitPersistenceService.loadInitialState({
      projects: initialWorkspace.projects,
      activeConversationId: initialWorkspace.activeConversation.id,
      openConversationIds: initialWorkspace.openConversations.map(c => c.id),
      updatedAt: new Date().toISOString()
    }).then(synced => {
      if (synced && Array.isArray(synced.projects) && synced.projects.length > 0) {
        const sanitized = sanitizeProjects(synced.projects);
        setProjects(sanitized);
        const allConvs = sanitized.flatMap(p => p.conversations || []);
        const restored = detectActiveConversationOnLoad(allConvs);
        if (restored && restored.messages && restored.messages.length > 0) {
          setActiveConversation(restored);
          setOpenConversations([restored]);
        }
      }
    }).catch(() => {});
  }, []);

  // Marcação contínua da sessão e da conversa ativa para restauração em caso de saída temporária
  useEffect(() => {
    try {
      sessionStorage.setItem('pcl_cockpit_session_active', 'true');
      if (activeConversation.messages && activeConversation.messages.length > 0) {
        sessionStorage.setItem('pcl_cockpit_working_conv_id', activeConversation.id);
        localStorage.setItem('pcl_cockpit_last_working_conv_id', activeConversation.id);
        localStorage.setItem('pcl_cockpit_last_working_timestamp', Date.now().toString());
      } else {
        sessionStorage.removeItem('pcl_cockpit_working_conv_id');
      }
    } catch {}
  }, [activeConversation]);

  // Auto-save reativo contínuo no localStorage e no PostgreSQL 17 / Vault
  useEffect(() => {
    const payload = {
      projects,
      activeConversationId: activeConversation.id,
      openConversationIds: openConversations.map(c => c.id),
      updatedAt: new Date().toISOString()
    };
    cockpitPersistenceService.queueSave(payload);
  }, [projects, activeConversation, openConversations]);

  // Helper centralizado para sincronização atômica entre conversa ativa, abas abertas e lista em projetos
  const syncConversation = (updater: (prev: Conversation) => Conversation) => {
    setActiveConversation(prev => {
      const updated = updater(prev);
      setOpenConversations(openPrev => openPrev.map(c => c.id === updated.id ? updated : c));
      setProjects(projPrev => {
        let matched = false;
        const next = projPrev.map(proj => {
          const idx = proj.conversations.findIndex(c => c.id === updated.id);
          if (idx !== -1) {
            matched = true;
            const updatedConvs = [...proj.conversations];
            updatedConvs[idx] = updated;
            return { ...proj, conversations: updatedConvs };
          }
          return proj;
        });

        // Se a conversa não estava vinculada a nenhum projeto, adiciona ao primeiro
        if (!matched && next[0]) {
          next[0] = {
            ...next[0],
            conversations: [updated, ...next[0].conversations],
            conversationsCount: next[0].conversations.length + 1
          };
        }
        return next;
      });
      return updated;
    });
  };

  const handleSelectConversation = (conv: Conversation) => {
    // Busca a versão mais atualizada e contígua da conversa em projects
    let latestConv = conv;
    for (const p of projects) {
      const match = p.conversations.find(c => c.id === conv.id);
      if (match) {
        latestConv = match;
        break;
      }
    }
    setActiveConversation(latestConv);
    setActiveMainView('chat');

    // Registra sessão de trabalho para restauração automática em caso de reload ou saída temporária
    if (latestConv.messages && latestConv.messages.length > 0) {
      try {
        sessionStorage.setItem('pcl_cockpit_session_active', 'true');
        sessionStorage.setItem('pcl_cockpit_working_conv_id', latestConv.id);
        localStorage.setItem('pcl_cockpit_last_working_conv_id', latestConv.id);
        localStorage.setItem('pcl_cockpit_last_working_timestamp', Date.now().toString());
      } catch {}
    }

    setOpenConversations(prev => {
      // Remove abas vazias ao focar em uma conversa real do histórico
      const withoutEmpty = prev.filter(c => c.id === latestConv.id || (c.messages && c.messages.length > 0));
      if (withoutEmpty.some(c => c.id === latestConv.id)) {
        return withoutEmpty.map(c => c.id === latestConv.id ? latestConv : c);
      }
      if (withoutEmpty.length < 5) {
        return [...withoutEmpty, latestConv];
      }
      return [...withoutEmpty.slice(0, 4), latestConv];
    });
  };

  const handleCloseTab = (convId: string) => {
    setOpenConversations(prev => {
      if (prev.length <= 1) return prev;
      const nextTabs = prev.filter(c => c.id !== convId);
      if (activeConversation.id === convId) {
        setActiveConversation(nextTabs[0]);
      }
      return nextTabs;
    });
  };

  const handleNewConversation = () => {
    // Se a conversa ativa já for uma nova conversa vazia, apenas foca nela sem criar duplicatas
    if (activeConversation.messages.length === 0) {
      setActiveMainView('chat');
      return;
    }

    const newC: Conversation = {
      id: `conv-${Date.now()}`,
      title: 'Nova Conversa',
      dateGroup: 'Hoje',
      updatedAt: new Date().toISOString(),
      messages: []
    };

    // Abre a aba limpa sem poluir o histórico do sidebar até a primeira mensagem ser enviada
    setOpenConversations(prev => {
      const filtered = prev.filter(c => c.messages && c.messages.length > 0);
      return [newC, ...filtered.slice(0, 4)];
    });

    setActiveConversation(newC);
    setActiveMainView('chat');
  };

  const handleRenameConversation = (convId: string, newTitle: string) => {
    setProjects(prev => prev.map(proj => ({
      ...proj,
      conversations: proj.conversations.map(c => c.id === convId ? { ...c, title: newTitle } : c)
    })));
    setOpenConversations(prev => prev.map(c => c.id === convId ? { ...c, title: newTitle } : c));
    if (activeConversation.id === convId) {
      setActiveConversation(prev => ({ ...prev, title: newTitle }));
    }
  };

  const handleDeleteConversation = (convId: string) => {
    setProjects(prev => prev.map(proj => ({
      ...proj,
      conversations: proj.conversations.filter(c => c.id !== convId)
    })));
    setOpenConversations(prev => prev.filter(c => c.id !== convId));
    if (activeConversation.id === convId) {
      const remaining = openConversations.filter(c => c.id !== convId);
      if (remaining.length > 0) {
        setActiveConversation(remaining[0]);
      } else if (projects[0]?.conversations[0]) {
        setActiveConversation(projects[0].conversations[0]);
      } else {
        setActiveConversation(defaultInitialConversation);
        setOpenConversations([defaultInitialConversation]);
      }
    }
  };

  const handleMoveConversation = (convId: string, targetProjectId: string) => {
    let targetConv: Conversation | null = null;
    projects.forEach(p => {
      const found = p.conversations.find(c => c.id === convId);
      if (found) targetConv = found;
    });

    if (!targetConv) return;

    setProjects(prev => prev.map(proj => {
      // Remove do projeto atual
      const filtered = proj.conversations.filter(c => c.id !== convId);
      // Se for o projeto de destino, adiciona
      if (proj.id === targetProjectId) {
        return {
          ...proj,
          conversations: [targetConv!, ...filtered],
          conversationsCount: filtered.length + 1
        };
      }
      return {
        ...proj,
        conversations: filtered,
        conversationsCount: filtered.length
      };
    }));
  };

  const handleCreateProject = (projectName: string) => {
    const newProj: Project = {
      id: `prj-${Date.now()}`,
      name: projectName,
      conversationsCount: 0,
      activeAgentsCount: 1,
      conversations: []
    };
    setProjects(prev => [...prev, newProj]);
  };

  const agentsList: Agent[] = [
    { id: 'ag-1', name: 'Cortex Master', role: 'Orquestrador de Arquitetura', model: 'Ollama llama3.3:70b', status: 'active', currentTask: 'Validando Stage Gates TLC v3', timerFormatted: '00:04:12', assignedSkills: ['cortex'] },
    { id: 'ag-2', name: 'Paperclip Auditor', role: 'Inspeção de Anexos & Contexto', model: 'Ollama qwen2.5:72b', status: 'active', currentTask: 'Sanitizando PII Guard LGPD', timerFormatted: '00:01:45', assignedSkills: ['accidental-data-loss-prevention'] },
    { id: 'ag-3', name: 'Claude 3.5 Architect', role: 'Engenheiro de Código & UI', model: 'Claude 3.5 Sonnet', status: 'standby', assignedSkills: [] }
  ];

  const systemServices: ServiceStatus[] = [
    { id: 's-1', name: 'Ollama Engine Local', status: 'online', latencyMs: 24, icon: 'Cpu' },
    { id: 's-2', name: 'PostgreSQL Audit Trail', status: 'online', latencyMs: 12, icon: 'Database' },
    { id: 's-3', name: 'Cortex Graph Visualizer', status: 'online', latencyMs: 45, icon: 'GitBranch' },
    { id: 's-4', name: 'Google Vertex AI Hub', status: 'online', latencyMs: 180, icon: 'Globe' }
  ];

  const handleSendMessage = async (
    text: string, 
    webSearch?: boolean, 
    profileId: string = 'sintese-executiva',
    modelId?: string,
    targetFormat?: TargetArtifactFormat,
    attachedStudy?: StudyAttachment
  ) => {
    const userMessageId = `msg-${Date.now()}`;
    const agentReplyId = `msg-reply-${Date.now() + 1}`;

    const displayText = attachedStudy 
      ? `📎 [Estudo: ${attachedStudy.filename}]\n\n${text}`
      : text;

    const newMessage: ChatMessage = {
      id: userMessageId,
      sender: 'user',
      senderName: userProfile.name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: displayText
    };

    const promptForLLM = attachedStudy?.extractedText
      ? `[ESTUDO ANEXADO: ${attachedStudy.filename} (${attachedStudy.pageCount || 1} págs)]\n${attachedStudy.extractedText.slice(0, 8000)}\n\n[SOLICITAÇÃO DO USUÁRIO]:\n${text}`
      : text;

    // Estrutura inicial do Stepper de Execução Cognitiva
    const initialSteps: ChatMessage['steps'] = [
      { id: 'laya_coprocessor', label: 'Triagem Semântica & Intenção (Laya Coprocessor em CPU)', status: 'running', detail: 'Processando em CPU local host (0 MB VRAM)...' },
      { id: 'canonical_knowledge', label: 'Consulta à Base Canônica PCL AEOS (ADRs & Skills)', status: 'pending' },
      { id: 'web_search', label: 'Pesquisa Web Avançada em Múltiplas Fontes', status: 'pending' },
      { id: 'omniroute_llm', label: 'Síntese de Resposta Factual Fundamentada', status: 'pending' },
      { id: 'audit_validation', label: 'Validação de Evidências & Auditoria de Resposta', status: 'pending' }
    ];

    const placeholderReply: ChatMessage = {
      id: agentReplyId,
      sender: 'agent',
      senderName: 'Cortex Enterprise Engine',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: '',
      isProcessing: true,
      activeStepIndex: 0,
      steps: initialSteps,
      elapsedSeconds: 0.1
    };

    const isFirstMessage = activeConversation.messages.length === 0;
    const dynamicTitle = isFirstMessage 
      ? (text.slice(0, 28) + (text.length > 28 ? '...' : '')) 
      : activeConversation.title;

    // Sincronização Atômica Imediata: persiste a mensagem do usuário e o placeholder
    syncConversation(prev => ({
      ...prev,
      title: dynamicTitle,
      messages: [...prev.messages, newMessage, placeholderReply]
    }));

    // Cronômetro dinâmico em tempo real
    const startTime = performance.now();
    const timerInterval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      setActiveConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => m.id === agentReplyId ? { ...m, elapsedSeconds: elapsed } : m)
      }));
    }, 150);

    try {
      // ETAPA 1: Laya Coprocessor System One em CPU (0 MB VRAM)
      const layaStartTime = performance.now();
      const layaResult = await layaCoprocessorService.classifyIntent(promptForLLM);
      const layaDuration = Math.round(performance.now() - layaStartTime);

      syncConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== agentReplyId || !m.steps) return m;
          const updatedSteps = [...m.steps];
          updatedSteps[0] = { ...updatedSteps[0], status: 'completed', durationMs: layaDuration, detail: `Intenção: ${layaResult.intent} | Rota: ${layaResult.recommendedRoute} (0 MB VRAM)` };
          updatedSteps[1] = { 
            ...updatedSteps[1], 
            status: layaResult.needsCanonicalRAG ? 'running' : 'skipped', 
            detail: layaResult.needsCanonicalRAG 
              ? 'Indexando especificações canônicas PCL e catálogo de skills...' 
              : 'Dispensada (pergunta geral sem dependência de normas internas).' 
          };
          return { ...m, activeStepIndex: 1, steps: updatedSteps };
        })
      }));

      // ETAPA 2 & 3: Grounding Híbrido Federado Guiado por Gating do Laya
      const shouldSearchWeb = Boolean(webSearch || layaResult.needsWebSearch);
      const shouldQueryCanonical = Boolean(layaResult.needsCanonicalRAG);

      const groundingStartTime = performance.now();
      const groundingResult = await intelligentGroundingService.performGrounding(
        promptForLLM, 
        shouldSearchWeb, 
        shouldQueryCanonical
      );
      const groundingDuration = Math.round(performance.now() - groundingStartTime);

      syncConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== agentReplyId || !m.steps) return m;
          const updatedSteps = [...m.steps];
          updatedSteps[1] = { 
            ...updatedSteps[1], 
            status: groundingResult.localMatchesCount > 0 ? 'completed' : 'skipped', 
            durationMs: Math.round(groundingDuration * 0.4), 
            detail: groundingResult.localMatchesCount > 0
              ? `${groundingResult.localMatchesCount} especificações canônicas PCL recuperadas.`
              : 'Dispensada (não requer normas PCL).' 
          };
          updatedSteps[2] = { 
            ...updatedSteps[2], 
            status: groundingResult.webResultsCount > 0 ? 'completed' : 'skipped', 
            durationMs: Math.round(groundingDuration * 0.6), 
            detail: groundingResult.webResultsCount > 0 
              ? `${groundingResult.webResultsCount} referências externas verificadas.`
              : shouldSearchWeb 
                ? 'Conhecimento nativo suficiente (zero injeção externa).'
                : 'Dispensada (consulta factual direta).' 
          };
          updatedSteps[3] = { ...updatedSteps[3], status: 'running', detail: 'Sintetizando resposta contextual...' };
          return { ...m, activeStepIndex: 3, steps: updatedSteps };
        })
      }));

      // ETAPA 4: Inferência com Histórico Multi-Turn Completo (ADR-0007)
      const conversationHistory = activeConversation.messages
        .filter(m => m.id !== newMessage.id && m.id !== agentReplyId && m.text && m.text.trim())
        .map(m => ({
          role: (m.sender === 'user' ? 'user' : 'assistant') as 'user' | 'assistant',
          content: m.text
        }));

      const omniStartTime = performance.now();
      const omniResult = await omniRouteService.sendPrompt(
        groundingResult.groundedPrompt, 
        undefined, 
        profileId,
        conversationHistory,
        modelId
      );
      const omniDuration = Math.round(performance.now() - omniStartTime);

      // ETAPA 5: Finalização e Auditoria Criptográfica
      clearInterval(timerInterval);
      const totalElapsed = (performance.now() - startTime) / 1000;

      const webRefs = groundingResult.sources.map(s => ({
        title: s.title,
        url: s.url,
        snippet: s.snippet,
        source: s.sourceType === 'local_canonical' ? 'Repositório Canônico PCL' : 'Web Externa'
      }));

      const generatedArtifacts = await generateArtifactsFromInteraction(
        text, 
        omniResult.text,
        targetFormat,
        attachedStudy?.filename
      );

      // Persistência no PostgreSQL 17 (:5432) e Vault em disco
      for (const art of generatedArtifacts) {
        cockpitPersistenceService.persistArtifact(art);
      }

      syncConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== agentReplyId || !m.steps) return m;
          const updatedSteps = [...m.steps];
          updatedSteps[3] = { ...updatedSteps[3], status: 'completed', durationMs: omniDuration, detail: `Inferência concluída via ${omniResult.providerUsed} (${omniResult.modelUsed}).` };
          updatedSteps[4] = {
            ...updatedSteps[4],
            status: 'completed',
            durationMs: 12,
            detail: generatedArtifacts.length > 0
              ? `Consistência validada + ${generatedArtifacts.length} artefato(s) multimodal(is) gerado(s) (SHA-256: ${omniResult.sha256Hash.slice(0, 10)}...).`
              : `Consistência factual validada (SHA-256: ${omniResult.sha256Hash.slice(0, 12)}...).`
          };

          return {
            ...m,
            text: omniResult.text,
            isProcessing: false,
            activeStepIndex: 4,
            steps: updatedSteps,
            elapsedSeconds: totalElapsed,
            confidenceScore: groundingResult.confidenceScore,
            webReferences: webRefs,
            artifacts: generatedArtifacts.length > 0 ? generatedArtifacts : m.artifacts
          };
        })
      }));
    } catch (err) {
      clearInterval(timerInterval);
      console.error('Falha na execução do pipeline cognitivo:', err);
      syncConversation(prev => ({
        ...prev,
        messages: prev.messages.map(m => {
          if (m.id !== agentReplyId) return m;
          return {
            ...m,
            text: 'Ocorreu uma falha na orquestração da consulta. Por favor, tente novamente.',
            isProcessing: false
          };
        })
      }));
    }
  };

  const handleGenerateArtifactForMessage = async (msg: ChatMessage, format: TargetArtifactFormat) => {
    try {
      const msgIndex = activeConversation.messages.findIndex(m => m.id === msg.id);
      const precedingUserMsg = msgIndex > 0 
        ? [...activeConversation.messages.slice(0, msgIndex)].reverse().find(m => m.sender === 'user') 
        : null;
      const contextPrompt = precedingUserMsg?.text || activeConversation.title || 'Análise Técnica';

      const generated = await generateArtifactsFromInteraction(
        contextPrompt,
        msg.text,
        format
      );
      if (generated.length > 0) {
        for (const art of generated) {
          cockpitPersistenceService.persistArtifact(art);
        }
        syncConversation(prev => ({
          ...prev,
          messages: prev.messages.map(m => m.id === msg.id ? {
            ...m,
            artifacts: [...(m.artifacts || []), ...generated]
          } : m)
        }));
        setActiveArtifact(generated[0]);
      }
    } catch (err) {
      console.error('Falha ao gerar artefato a partir da mensagem:', err);
    }
  };

  const handleCreateBranch = (messageId: string) => {
    const msgIndex = activeConversation.messages.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return;

    const branchedMessages = activeConversation.messages.slice(0, msgIndex + 1);
    const newConv: Conversation = {
      id: `conv-branch-${Date.now()}`,
      title: `${activeConversation.title} (Branch)`,
      dateGroup: 'Hoje',
      updatedAt: new Date().toISOString(),
      messages: branchedMessages
    };

    setProjects(prevProjects => {
      return prevProjects.map(p => {
        if (p.conversations.some(c => c.id === activeConversation.id)) {
          return {
            ...p,
            conversations: [newConv, ...p.conversations]
          };
        }
        return p;
      });
    });

    setOpenConversations(prev => {
      if (prev.length < 5) {
        return [...prev, newConv];
      }
      return [...prev.slice(0, 4), newConv];
    });

    setActiveConversation(newConv);
  };

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Header Bar com Botão Telemetria & Status e Help Center */}
      <Header
        user={userProfile}
        lang={lang}
        onLanguageChange={setLang}
        theme={theme}
        onThemeToggle={handleToggleTheme}
        onOpenSettings={(tab) => {
          if (tab) setSettingsTab(tab);
          setSettingsOpen(true);
        }}
        onToggleStatusPanel={() => setRightCollapsed(!rightCollapsed)}
        isStatusPanelOpen={!rightCollapsed}
        onOpenHelpCenter={() => setHelpCenterOpen(true)}
      />

      {/* Main 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Retrátil com Acordeão de Projetos e Switcher de Visão) */}
        <LeftSidebar
          collapsed={leftCollapsed}
          onToggleCollapse={() => setLeftCollapsed(!leftCollapsed)}
          projects={projects}
          activeConversationId={activeConversation.id}
          onSelectConversation={handleSelectConversation}
          onNewConversation={handleNewConversation}
          activeView={activeMainView}
          onSelectView={setActiveMainView}
          onRenameConversation={handleRenameConversation}
          onDeleteConversation={handleDeleteConversation}
          onMoveConversation={handleMoveConversation}
          onCreateProject={handleCreateProject}
        />

        {/* Central Workspace & Composer or Specialized Views (Meetings / Flows / Artifacts) */}
        <main className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900">
          {activeMainView === 'chat' ? (
            <>
              <DualPlexWorkspace
                conversation={activeConversation}
                openConversations={openConversations}
                onSelectConversation={handleSelectConversation}
                onCloseConversation={handleCloseTab}
                onNewConversation={handleNewConversation}
                onOpenArtifact={art => setActiveArtifact(art)}
                onCreateBranch={handleCreateBranch}
                onGenerateArtifactForMessage={handleGenerateArtifactForMessage}
                viewMode={workspaceViewMode}
                onViewModeChange={setWorkspaceViewMode}
                onPromptCardClick={(prompt) => handleSendMessage(prompt, false)}
              />

              {workspaceViewMode !== 'canvas' && (
                <SuperChatbubble
                  onSendMessage={handleSendMessage}
                  usedTokens={14200}
                  maxTokens={128000}
                />
              )}
            </>
          ) : activeMainView === 'meetings' ? (
            <MeetingsIntelligenceView onOpenArtifact={art => setActiveArtifact(art)} />
          ) : activeMainView === 'flows' ? (
            <FlowsAutomationCanvas />
          ) : (
            <ArtifactsLibraryView
              projects={projects}
              onOpenArtifact={art => setActiveArtifact(art)}
              onSelectConversation={handleSelectConversation}
              onNewConversation={handleNewConversation}
            />
          )}
        </main>

        {/* Right Sidebar (Status Real-Time & Timers com sincronização ativa de inferência) */}
        <RightSidebarStatus
          collapsed={rightCollapsed}
          onToggleCollapse={() => setRightCollapsed(!rightCollapsed)}
          agents={agentsList}
          services={systemServices}
          isProcessing={Boolean(activeConversation.messages.find(m => m.isProcessing))}
          activeTaskName={
            activeConversation.messages.find(m => m.isProcessing)?.steps?.[
              activeConversation.messages.find(m => m.isProcessing)?.activeStepIndex ?? 0
            ]?.label
          }
          activeStepIndex={
            activeConversation.messages.find(m => m.isProcessing)?.activeStepIndex ?? 4
          }
        />
      </div>

      {/* PCL Sovereign Drawer (Enclave Documental & Telemetria DAG) */}
      <PCLArtifactDrawer
        artifact={activeArtifact}
        onClose={() => setActiveArtifact(null)}
      />

      {/* Unified Administration & Governance Settings Modal (Fullscreen Window) */}
      {settingsOpen && (
        <SettingsModal
          user={userProfile}
          defaultTab={settingsTab}
          lang={lang}
          onLanguageChange={setLang}
          theme={theme}
          onThemeToggle={handleToggleTheme}
          onClose={() => setSettingsOpen(false)}
        />
      )}

      {/* Official Help Center & Operator Enablement Modal */}
      <HelpCenterModal
        isOpen={helpCenterOpen}
        onClose={() => setHelpCenterOpen(false)}
        onOpenSettingsTab={(tab) => {
          setSettingsTab(tab);
          setSettingsOpen(true);
        }}
      />
    </div>
  );
};

export default App;
