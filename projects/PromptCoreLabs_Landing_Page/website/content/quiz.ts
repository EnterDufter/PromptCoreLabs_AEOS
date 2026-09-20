export interface QuizOption {
  label: string;
  desc: string;
  points: number;
}

export interface QuizQuestion {
  id: number;
  category: string;
  isoTag: string;
  title: string;
  subtitle: string;
  options: QuizOption[];
}

export interface BunkerDiagnosis {
  tier: "critical" | "warning" | "optimal";
  title: string;
  badge: string;
  description: string;
  riskSummary: string;
  recommendation: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: "SEGURANÇA & PRIVACIDADE",
    isoTag: "ISO/IEC 27001",
    title: "Como sua empresa protege informações estratégicas e dados de clientes ao utilizar IA?",
    subtitle: "Avaliação de isolamento, vazamento de capital intelectual e segurança da informação.",
    options: [
      {
        label: "Uso aberto em nuvens públicas",
        desc: "Colaboradores utilizam ferramentas de IA comerciais (ChatGPT, Claude, etc.) sem política formal ou bloqueio de dados confidenciais.",
        points: 0,
      },
      {
        label: "Orientações informais sem controle técnico",
        desc: "A equipe é orientada a não colar dados sensíveis, mas não temos barreiras técnicas, criptografia de ponta a ponta nem auditoria.",
        points: 10,
      },
      {
        label: "Contratos corporativos com big techs",
        desc: "Possuímos contas corporativas com termos de privacidade padrão, porém sem infraestrutura própria ou controle dos servidores.",
        points: 15,
      },
      {
        label: "Bunker Privado & Zero Data Leak",
        desc: "Operamos com modelos privados e ambiente isolado alinhado aos padrões da ISO 27001. Nenhum dado corporativo sai da nossa infraestrutura.",
        points: 20,
      },
    ],
  },
  {
    id: 2,
    category: "SOBERANIA & DEPENDÊNCIA",
    isoTag: "SOBERANIA TECNOLÓGICA",
    title: "O que acontece com sua operação se o seu provedor de IA dobrar o preço ou bloquear sua conta amanhã?",
    subtitle: "Avaliação do grau de dependência tecnológica e risco de paralisia operacional.",
    options: [
      {
        label: "Paralisia total do negócio",
        desc: "Ficaríamos completamente reféns e sem operação, pois toda a nossa inteligência depende diretamente de APIs de um único fornecedor.",
        points: 0,
      },
      {
        label: "Impacto severo e perda de semanas",
        desc: "Teríamos grande prejuízo financeiro e operacional tentando reescrever integrações e migrar às pressas para outra plataforma.",
        points: 5,
      },
      {
        label: "Plano de contingência manual",
        desc: "Temos fornecedores alternativos mapeados, mas a migração demandaria esforço manual e adaptação de processos dos times.",
        points: 12,
      },
      {
        label: "Autonomia Soberana & Modelos Próprios",
        desc: "Utilizamos engenharia open-source e modelos próprios na nossa infraestrutura. Nunca ficamos reféns de aumentos arbitrários.",
        points: 20,
      },
    ],
  },
  {
    id: 3,
    category: "GOVERNANÇA & ÉTICA",
    isoTag: "ISO/IEC 42001",
    title: "As decisões, automações e respostas geradas por IA na sua empresa são auditáveis?",
    subtitle: "Avaliação de conformidade, mitigação de alucinações e rastreabilidade regulatória.",
    options: [
      {
        label: "Confiança cega sem auditoria",
        desc: "Não auditamos saídas de IA. Confiamos nas respostas e apenas corrigimos quando um erro grave ou alucinação chega ao cliente.",
        points: 0,
      },
      {
        label: "Revisão humana reativa",
        desc: "Revisamos pontualmente algumas respostas críticas, mas não há trilha de auditoria formal nem comitê de governança de IA.",
        points: 8,
      },
      {
        label: "Políticas básicas de conformidade",
        desc: "Temos guardrails iniciais e registros de logs, mas ainda sem alinhamento formal à norma internacional ISO 42001.",
        points: 14,
      },
      {
        label: "Governança Cognitiva & Human-in-the-Loop",
        desc: "Framework completo alinhado à ISO 42001, com validação humana em pontos críticos, explicabilidade e rastreabilidade integral.",
        points: 20,
      },
    ],
  },
  {
    id: 4,
    category: "PREVISIBILIDADE FINANCEIRA",
    isoTag: "FINOPS & EBITDA SHIELD",
    title: "Como sua empresa controla os custos com licenças, tokens de IA e ferramentas digitais?",
    subtitle: "Avaliação de previsibilidade de custos ocultos e retorno real sobre o investimento.",
    options: [
      {
        label: "Faturas variáveis e surpresas no cartão",
        desc: "Gastamos com dezenas de licenças e faturas de APIs que variam a cada mês sem controle claro de retorno ou previsibilidade.",
        points: 0,
      },
      {
        label: "Orçamento fixo com desperdício",
        desc: "Temos um teto de gastos aprovado, mas pagamos caro por ferramentas subutilizadas e reprocessamento desnecessário de tokens.",
        points: 8,
      },
      {
        label: "Monitoramento básico de consumo",
        desc: "Acompanhamos métricas mensais de custos, mas sem cache semântico de prompts ou roteamento inteligente de modelos.",
        points: 14,
      },
      {
        label: "FinOps Ativo & Tecnologia EBITDA Shield",
        desc: "Custo previsível com redução de até 80% através de cache de contexto, roteamento híbrido (local/nuvem) e corte de desperdício.",
        points: 20,
      },
    ],
  },
  {
    id: 5,
    category: "CONTINUIDADE & RESILIÊNCIA",
    isoTag: "RESILIÊNCIA BUNKER",
    title: "Sua operação continua funcionando normalmente se a internet oscilar ou APIs públicas caírem?",
    subtitle: "Avaliação da capacidade de resistir e manter a operação de pé em qualquer cenário adverso.",
    options: [
      {
        label: "Operação trava instantaneamente",
        desc: "Qualquer instabilidade em serviços de terceiros (OpenAI, AWS, Google) paralisa o atendimento, vendas ou rotinas internas.",
        points: 0,
      },
      {
        label: "Recuo para planilhas e processos manuais",
        desc: "A equipe tenta contornar a queda com trabalho manual emergencial, gerando lentidão, estresse e atrasos críticos.",
        points: 6,
      },
      {
        label: "Redundância parcial em nuvem",
        desc: "Possuímos contas de backup em outros provedores de nuvem, mas ainda com dependência externa de conectividade estável.",
        points: 12,
      },
      {
        label: "Bunker Resiliente com Failover Automático",
        desc: "Arquitetura com contingência automática e modelos locais. Se a nuvem cair, a operação local assume e o negócio nunca para.",
        points: 20,
      },
    ],
  },
];

export function calculateDiagnosis(score: number): BunkerDiagnosis {
  if (score < 40) {
    return {
      tier: "critical",
      title: "Exposição Crítica // Fora do Bunker",
      badge: "RISCO ELEVADO DE VAZAMENTO E PARALISIA",
      description:
        "Sua empresa está altamente exposta a vazamentos de dados confidenciais, faturas imprevisíveis e dependência de plataformas de terceiros. Na ausência de controles ISO 27001 e ISO 42001, qualquer instabilidade externa pode paralisar sua operação e gerar passivos jurídicos imediatos.",
      riskSummary:
        "Vulnerabilidade crítica a dependência tecnológica, custo de tokens descontrolado e dados corporativos trafegando em nuvens sem isolamento formal.",
      recommendation:
        "Implantação emergencial de um Bunker de Soberania Digital com modelos privados locais, bloqueio de vazamento de dados e governança preliminar de IA.",
    };
  }

  if (score < 75) {
    return {
      tier: "warning",
      title: "Operação em Transição // Proteção Parcial",
      badge: "VULNERABILIDADE MODERADA A CUSTOS E REGRAS",
      description:
        "Sua empresa já reconhece o valor da IA e adota algumas boas práticas, mas ainda opera com proteções isoladas e custos ocultos. Falta a robustez de um ecossistema com conformidade formal às normas ISO 27001 e ISO 42001, além de uma arquitetura de resiliência que garanta continuidade sem dependências.",
      riskSummary:
        "Dependência de fornecedores externos com risco de aumentos de preço, falta de rastreabilidade formal em auditorias e ausência de contingência local.",
      recommendation:
        "Estruturação do duplo escudo normativo (ISO 27001 + ISO 42001), engenharia de contexto para redução de custos (EBITDA Shield) e autonomia com o Arquiteto Forward Deployed.",
    };
  }

  return {
    tier: "optimal",
    title: "Bunker Soberano // Alta Maturidade Operacional",
    badge: "OPERACAO RESILIENTE E GOVERNADA",
    description:
      "Parabéns! Sua organização possui excelente consciência de soberania tecnológica, segurança de dados e governança. O próximo passo é maximizar a escala operacional com multiagentes autônomos avançados, servidores MCP e blindagem total de margem através do PCL AEOS.",
    riskSummary:
      "Baixo risco de vazamento e dependência externa; prontidão elevada para certificação formal nas normas ISO 27001 e ISO 42001.",
    recommendation:
      "Aceleração da esteira agêntica corporativa, orquestração de sistemas cognitivos integrados ao CRM/ERP e expansão do Bunker Soberano.",
  };
}
