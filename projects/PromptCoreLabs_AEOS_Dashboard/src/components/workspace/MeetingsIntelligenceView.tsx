import React, { useState, useRef, useEffect } from 'react';
import { 
  Folder, Video, Clock, Users, Play, Pause, ChevronRight, 
  Share2, MoreVertical, Copy, Check, Send, Sparkles, ArrowLeft,
  FileText, Download, ShieldCheck, Search, CheckCircle2,
  Volume2, VolumeX, RotateCcw, RotateCw, FastForward,
  UserCheck, AlertCircle, ArrowUpRight, CheckSquare, Square,
  ExternalLink, ListChecks, Award, Lock, Hash
} from 'lucide-react';
import { Artifact } from '../../types';
import { renderOfficialLogo } from '../common/AppOfficialLogos';

export interface DialogueSegment {
  id: string;
  speaker: string;
  avatar: string;
  role: string;
  startTime: number; // em segundos
  endTime: number;
  text: string;
  words: Array<{ word: string; start: number; end: number }>;
}

export interface DecisionItem {
  id: string;
  title: string;
  deliberation: string;
  consensus: 'Aprovado por Unanimidade' | 'Aprovado com Ressalvas' | 'Rejeitado';
  approvedBy: string;
}

export interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  assigneeAvatar: string;
  deadline: string;
  completed: boolean;
  targetApp?: 'salesforce' | 'hubspot' | 'pipedrive' | 'rdstation' | 'jira' | 'gmail';
}

export interface MeetingItem {
  id: string;
  folder: 'Vendas' | 'Contabilidade' | 'Roadmap' | 'C-Level';
  title: string;
  platform: string;
  meetCode: string;
  date: string;
  duration: string;
  durationSeconds: number;
  author: string;
  authorAvatar?: string;
  participants: Array<{ name: string; avatar: string; role: string }>;
  summary: string;
  decisions: DecisionItem[];
  actionItems: ActionItem[];
  questions: string[];
  segments: DialogueSegment[];
}

export const DETAILED_MEETINGS_DATA: MeetingItem[] = [
  {
    id: 'meet-1',
    folder: 'Contabilidade',
    title: 'Revisão de Carteira & Alocação IPCA+',
    platform: 'Google Meet',
    meetCode: 'mcy-bjmf-yawm',
    date: '14 de Julho de 2026',
    duration: '22 min',
    durationSeconds: 1320,
    author: 'Lucas Mendes',
    participants: [
      { name: 'Lucas Mendes', avatar: 'LM', role: 'Gestor de Ativos' },
      { name: 'Mariana Couto', avatar: 'MC', role: 'Analista de Risco' },
      { name: 'Juliana Castro', avatar: 'JC', role: 'Compliance Lead' },
      { name: 'Eduardo Machado', avatar: 'EM', role: 'Arquiteto de Sistemas' }
    ],
    summary: 'O comitê identificou que 12 ativos apresentaram desempenho abaixo do benchmark no último trimestre, recomendando realocação parcial de 15% para títulos IPCA+. A carteira de renda variável teve retorno de 4,2%, enquanto o CDI acumulou 3,8% no período. Aprovada a trava rígida de orçamento e ativação do fluxo automatizado de cobrança amigável via SAP e Salesforce CRM.',
    decisions: [
      {
        id: 'dec-1',
        title: 'Migração de 15% da Carteira para IPCA+',
        deliberation: 'Reduzir exposição em ações de tecnologia voláteis e reforçar proteção de cupom real frente à curva de juros.',
        consensus: 'Aprovado por Unanimidade',
        approvedBy: 'Comitê de Investimentos'
      },
      {
        id: 'dec-2',
        title: 'Teto Mensal de IA com Hard Lock ($19.200,00)',
        deliberation: 'Estabelecer corte automático via API de governança quando o consumo atingir o limiar estipulado pelo conselho.',
        consensus: 'Aprovado por Unanimidade',
        approvedBy: 'Juliana Castro (Compliance)'
      },
      {
        id: 'dec-3',
        title: 'Acionamento de Cobrança Amigável via SAP & Salesforce',
        deliberation: 'Notificar clientes com pendências acima de 15 dias usando minutas personalizadas geradas pelo Cortex Engine.',
        consensus: 'Aprovado com Ressalvas',
        approvedBy: 'Lucas Mendes (Gestor)'
      }
    ],
    actionItems: [
      {
        id: 'act-1',
        task: 'Executar ordens de realocação cambial e títulos IPCA+ na tesouraria',
        assignee: 'Mariana Couto',
        assigneeAvatar: 'MC',
        deadline: 'Amanhã, 14:00',
        completed: false,
        targetApp: 'salesforce'
      },
      {
        id: 'act-2',
        task: 'Configurar limites de $19.200 no gateway de inferência com chave Laya',
        assignee: 'Eduardo Machado',
        assigneeAvatar: 'EM',
        deadline: 'Hoje, 18:00',
        completed: true,
        targetApp: 'jira'
      },
      {
        id: 'act-3',
        task: 'Enviar relatório consolidado assinado com hash SHA-256 para auditoria',
        assignee: 'Juliana Castro',
        assigneeAvatar: 'JC',
        deadline: '16 de Julho',
        completed: false,
        targetApp: 'gmail'
      }
    ],
    questions: [
      'Quais ativos ficaram abaixo do benchmark?',
      'Por que reduzir renda variável em favor de IPCA+?',
      'Como funciona a trava de corte Hard Lock?',
      'Quem é o responsável pela execução na tesouraria?'
    ],
    segments: [
      {
        id: 'seg-1',
        speaker: 'Lucas Mendes',
        avatar: 'LM',
        role: 'Gestor de Ativos',
        startTime: 0,
        endTime: 9,
        text: 'Bom dia a todos. Abrimos a sessão para avaliar os 12 ativos que performaram abaixo do benchmark neste trimestre.',
        words: [
          { word: 'Bom', start: 0, end: 0.5 },
          { word: 'dia', start: 0.6, end: 0.9 },
          { word: 'a', start: 1.0, end: 1.1 },
          { word: 'todos.', start: 1.2, end: 1.8 },
          { word: 'Abrimos', start: 2.1, end: 2.7 },
          { word: 'a', start: 2.8, end: 2.9 },
          { word: 'sessão', start: 3.0, end: 3.5 },
          { word: 'para', start: 3.6, end: 3.9 },
          { word: 'avaliar', start: 4.0, end: 4.5 },
          { word: 'os', start: 4.6, end: 4.7 },
          { word: '12', start: 4.8, end: 5.3 },
          { word: 'ativos', start: 5.4, end: 5.9 },
          { word: 'que', start: 6.0, end: 6.1 },
          { word: 'performaram', start: 6.2, end: 6.9 },
          { word: 'abaixo', start: 7.0, end: 7.4 },
          { word: 'do', start: 7.5, end: 7.6 },
          { word: 'benchmark', start: 7.7, end: 8.3 },
          { word: 'neste', start: 8.4, end: 8.6 },
          { word: 'trimestre.', start: 8.7, end: 9.0 }
        ]
      },
      {
        id: 'seg-2',
        speaker: 'Mariana Couto',
        avatar: 'MC',
        role: 'Analista de Risco',
        startTime: 9.5,
        endTime: 18,
        text: 'A nossa recomendação é migrar 15% dessa alocação para títulos indexados ao IPCA+, garantindo retorno real com baixo risco.',
        words: [
          { word: 'A', start: 9.5, end: 9.6 },
          { word: 'nossa', start: 9.7, end: 10.1 },
          { word: 'recomendação', start: 10.2, end: 11.0 },
          { word: 'é', start: 11.1, end: 11.3 },
          { word: 'migrar', start: 11.4, end: 11.9 },
          { word: '15%', start: 12.0, end: 12.6 },
          { word: 'dessa', start: 12.7, end: 13.0 },
          { word: 'alocação', start: 13.1, end: 13.7 },
          { word: 'para', start: 13.8, end: 14.0 },
          { word: 'títulos', start: 14.1, end: 14.6 },
          { word: 'indexados', start: 14.7, end: 15.3 },
          { word: 'ao', start: 15.4, end: 15.5 },
          { word: 'IPCA+,', start: 15.6, end: 16.3 },
          { word: 'garantindo', start: 16.4, end: 17.0 },
          { word: 'retorno', start: 17.1, end: 17.4 },
          { word: 'real', start: 17.5, end: 17.8 },
          { word: 'com', start: 17.9, end: 18.0 }
        ]
      },
      {
        id: 'seg-3',
        speaker: 'Juliana Castro',
        avatar: 'JC',
        role: 'Compliance Lead',
        startTime: 18.5,
        endTime: 28,
        text: 'Pelo lado de compliance e governança, exijo que o teto orçamentário mensal de 19.200 dólares tenha trava rígida de Hard Lock.',
        words: [
          { word: 'Pelo', start: 18.5, end: 18.8 },
          { word: 'lado', start: 18.9, end: 19.2 },
          { word: 'de', start: 19.3, end: 19.4 },
          { word: 'compliance', start: 19.5, end: 20.2 },
          { word: 'e', start: 20.3, end: 20.4 },
          { word: 'governança,', start: 20.5, end: 21.3 },
          { word: 'exijo', start: 21.5, end: 22.0 },
          { word: 'que', start: 22.1, end: 22.2 },
          { word: 'o', start: 22.3, end: 22.4 },
          { word: 'teto', start: 22.5, end: 22.9 },
          { word: 'orçamentário', start: 23.0, end: 23.8 },
          { word: 'mensal', start: 23.9, end: 24.4 },
          { word: 'de', start: 24.5, end: 24.6 },
          { word: '19.200', start: 24.7, end: 25.4 },
          { word: 'dólares', start: 25.5, end: 26.0 },
          { word: 'tenha', start: 26.1, end: 26.5 },
          { word: 'trava', start: 26.6, end: 27.0 },
          { word: 'rígida.', start: 27.1, end: 28.0 }
        ]
      },
      {
        id: 'seg-4',
        speaker: 'Eduardo Machado',
        avatar: 'EM',
        role: 'Arquiteto de Sistemas',
        startTime: 28.5,
        endTime: 38,
        text: 'Perfeito, Juliana. O coprocessador Laya já opera em CPU local com zero consumo de VRAM e o Hard Lock está configurado.',
        words: [
          { word: 'Perfeito,', start: 28.5, end: 29.2 },
          { word: 'Juliana.', start: 29.3, end: 29.9 },
          { word: 'O', start: 30.1, end: 30.2 },
          { word: 'coprocessador', start: 30.3, end: 31.2 },
          { word: 'Laya', start: 31.3, end: 31.7 },
          { word: 'já', start: 31.8, end: 32.0 },
          { word: 'opera', start: 32.1, end: 32.6 },
          { word: 'em', start: 32.7, end: 32.8 },
          { word: 'CPU', start: 32.9, end: 33.4 },
          { word: 'local', start: 33.5, end: 33.9 },
          { word: 'com', start: 34.0, end: 34.2 },
          { word: 'zero', start: 34.3, end: 34.7 },
          { word: 'consumo', start: 34.8, end: 35.3 },
          { word: 'de', start: 35.4, end: 35.5 },
          { word: 'VRAM.', start: 35.6, end: 36.3 }
        ]
      }
    ]
  },
  {
    id: 'meet-2',
    folder: 'Contabilidade',
    title: 'Comitê de Crédito & Faturas em Atraso',
    platform: 'Google Meet',
    meetCode: 'lva-kvmq-lhas',
    date: '10 de Julho de 2026',
    duration: '35 min',
    durationSeconds: 2100,
    author: 'Luis Dias',
    participants: [
      { name: 'Luis Dias', avatar: 'LD', role: 'Diretor de Crédito' },
      { name: 'Juliana Castro', avatar: 'JC', role: 'Compliance Lead' },
      { name: 'Eduardo Machado', avatar: 'EM', role: 'Arquiteto de Sistemas' }
    ],
    summary: 'Aprovação de limites para clientes de médio porte. Identificados 3 grupos com duplicatas vencidas acima de 15 dias (Acme Engenharia, Beta Logística e Delta Tech). Decidido acionar fluxo automatizado de cobrança amigável via e-mail corporativo com integração SAP + Salesforce.',
    decisions: [
      {
        id: 'dec-21',
        title: 'Cobrança Automatizada para Faturas > 15 dias',
        deliberation: 'Cruzamento SAP com contatos de decisão no Salesforce CRM para emissão de boleto atualizado com cortesia.',
        consensus: 'Aprovado por Unanimidade',
        approvedBy: 'Luis Dias (Diretor)'
      }
    ],
    actionItems: [
      {
        id: 'act-21',
        task: 'Disparar lote de avisos de cobrança pelo Gmail corporativo',
        assignee: 'Eduardo Machado',
        assigneeAvatar: 'EM',
        deadline: 'Amanhã, 10:00',
        completed: false,
        targetApp: 'gmail'
      }
    ],
    questions: [
      'Quais clientes receberão aviso de cobrança?',
      'Qual o montante total vencido?'
    ],
    segments: [
      {
        id: 'seg-21',
        speaker: 'Luis Dias',
        avatar: 'LD',
        role: 'Diretor de Crédito',
        startTime: 0,
        endTime: 12,
        text: 'Temos R$ 100.400,00 em faturas vencidas no SAP este mês. Precisamos acionar os contatos do Salesforce CRM imediatamente.',
        words: []
      }
    ]
  }
];

interface MeetingsIntelligenceViewProps {
  onOpenArtifact?: (art: Artifact) => void;
}

export const MeetingsIntelligenceView: React.FC<MeetingsIntelligenceViewProps> = ({ onOpenArtifact }) => {
  const [meetings, setMeetings] = useState<MeetingItem[]>(DETAILED_MEETINGS_DATA);
  const [selectedFolder, setSelectedFolder] = useState<string>('Todas');
  const [selectedMeeting, setSelectedMeeting] = useState<MeetingItem | null>(null);

  // Estados do Player de Áudio & Word Karaoke
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [transcriptSearch, setTranscriptSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'transcript' | 'decisions' | 'actions'>('transcript');
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [generatedArtifactSuccess, setGeneratedArtifactSuccess] = useState(false);

  // RAG / Q&A
  const [queryInput, setQueryInput] = useState('');
  const [queryAnswer, setQueryAnswer] = useState<string | null>(null);
  const [crossMeetingQuery, setCrossMeetingQuery] = useState('');
  const [crossMeetingResult, setCrossMeetingResult] = useState<{
    answer: string;
    citedMeetings: Array<{ id: string; title: string; folder: string }>;
  } | null>(null);

  const folders = ['Todas', 'Vendas', 'Contabilidade', 'Roadmap', 'C-Level'];

  const filteredMeetings = selectedFolder === 'Todas' 
    ? meetings 
    : meetings.filter(m => m.folder === selectedFolder);

  // Sincronização do Timer do Player quando isPlaying é true
  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          const next = prev + 0.1 * playbackRate;
          const max = selectedMeeting?.segments?.[selectedMeeting.segments.length - 1]?.endTime || 40;
          if (next >= max) {
            setIsPlaying(false);
            return 0;
          }
          return Number(next.toFixed(2));
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackRate, selectedMeeting]);

  // Formatar Segundos em mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (timeSec: number) => {
    setCurrentTime(timeSec);
  };

  const handleToggleActionItem = (meetingId: string, actionId: string) => {
    setMeetings(prev => prev.map(m => {
      if (m.id !== meetingId) return m;
      return {
        ...m,
        actionItems: m.actionItems.map(a => a.id === actionId ? { ...a, completed: !a.completed } : a)
      };
    }));
    if (selectedMeeting && selectedMeeting.id === meetingId) {
      setSelectedMeeting(prev => {
        if (!prev) return null;
        return {
          ...prev,
          actionItems: prev.actionItems.map(a => a.id === actionId ? { ...a, completed: !a.completed } : a)
        };
      });
    }
  };

  // Gerador de Ata Formal PCL (One-Click Executive Artifact)
  const handleGenerateOfficialArtifact = () => {
    if (!selectedMeeting) return;

    const artifactContent = `# Ata Executiva de Reunião Corporativa — PCL AEOS
**Sessão:** ${selectedMeeting.title}
**Data:** ${selectedMeeting.date} | **Duração:** ${selectedMeeting.duration}
**Plataforma Segura:** ${selectedMeeting.platform} (${selectedMeeting.meetCode})
**Classificação de Segurança:** PCL Enclave Confidencial (ISO 27001 / ISO 42001)

---

## 1. Participantes Presentes
${selectedMeeting.participants.map(p => `- **${p.name}** (${p.role})`).join('\n')}

---

## 2. Sumário Executivo
${selectedMeeting.summary}

---

## 3. Matriz de Decisões & Deliberações Formais (Stage-Gate TLC v3)
${selectedMeeting.decisions.map((d, i) => `### ${i + 1}. ${d.title}
- **Deliberação:** ${d.deliberation}
- **Veredito:** ${d.consensus}
- **Aprovador Responsável:** ${d.approvedBy}
`).join('\n')}

---

## 4. Plano de Ação & Matriz de Responsabilidades (Action Items)
| Tarefa | Responsável | Prazo | Status | Conector |
| :--- | :--- | :--- | :--- | :--- |
${selectedMeeting.actionItems.map(a => `| ${a.task} | ${a.assignee} | ${a.deadline} | ${a.completed ? 'Concluído' : 'Pendente'} | ${a.targetApp?.toUpperCase() || 'PCL'} |`).join('\n')}

---

## 5. Atestação Criptográfica & Governança de Dados
- **Sanitização de PII Guard LGPD:** Todos os documentos e números cadastrais foram anonimizados no Enclave Local.
- **Hash de Integridade Imutável:** \`SHA256: 7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069\`
- **Registro de Auditoria:** PostgreSQL Audit Trail imutável verificado pelo Cortex Master.
`;

    const newArtifact: Artifact = {
      id: `art-meet-${Date.now()}`,
      title: `Ata Executiva: ${selectedMeeting.title}`,
      type: 'doc',
      summary: `Ata formal autenticada com ${selectedMeeting.decisions.length} decisões e ${selectedMeeting.actionItems.length} itens de ação.`,
      content: artifactContent,
      updatedAt: new Date().toISOString()
    };

    setGeneratedArtifactSuccess(true);
    setTimeout(() => setGeneratedArtifactSuccess(false), 3000);

    if (onOpenArtifact) {
      onOpenArtifact(newArtifact);
    }
  };

  const handleCopySummary = () => {
    if (!selectedMeeting) return;
    navigator.clipboard.writeText(selectedMeeting.summary);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleAskQuestion = (question: string) => {
    setQueryInput(question);
    if (question.includes('benchmark')) {
      setQueryAnswer('O agente de inteligência identificou que 12 ativos da carteira moderada ficaram abaixo do Ibovespa e do CDI no último trimestre, principalmente posições em fundos de ações de tecnologia e varejo.');
    } else if (question.includes('IPCA')) {
      setQueryAnswer('A alocação de 15% em títulos pós-fixados e indexados ao IPCA+ garante retorno real consistente com proteção inflacionária frente à expectativa de volatilidade cambial.');
    } else if (question.includes('Hard Lock')) {
      setQueryAnswer('A trava de corte Hard Lock estipulada por Juliana Castro bloqueia qualquer requisição de API comercial quando o orçamento mensal atingir $19.200, roteando 100% das tarefas para o motor local Laya em CPU ($0.00).');
    } else {
      setQueryAnswer(`Resposta gerada pela IA sobre a reunião: Análise contextual baseada na transcrição do encontro ${selectedMeeting?.title}.`);
    }
  };

  const handleCrossMeetingSearch = (query: string) => {
    setCrossMeetingQuery(query);
    if (query.toLowerCase().includes('crédito') || query.toLowerCase().includes('vendas')) {
      setCrossMeetingResult({
        answer: 'Cruzamento entre "Comitê de Crédito" e "Alinhamento Comercial": Ficou determinado que as contas com pendências superiores a 15 dias no SAP receberão minutas amigáveis disparadas via Salesforce CRM antes de qualquer bloqueio de crédito.',
        citedMeetings: [
          { id: 'meet-1', title: 'Revisão de Carteira & Alocação IPCA+', folder: 'Contabilidade' },
          { id: 'meet-2', title: 'Comitê de Crédito & Faturas em Atraso', folder: 'Contabilidade' }
        ]
      });
    } else {
      setCrossMeetingResult({
        answer: 'Síntese Transversal Soberana: Analisadas atas registradas com alinhamento sobre governança de dados, auditoria SHA-256 e conformidade com as diretrizes da Squad Next Gen Sports.',
        citedMeetings: [
          { id: 'meet-1', title: 'Revisão de Carteira & Alocação IPCA+', folder: 'Contabilidade' }
        ]
      });
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar select-none text-slate-800 dark:text-slate-100">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="p-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between text-xs bg-white/95 dark:bg-slate-900/95 backdrop-blur-md sticky top-0 z-20">
        <div className="flex items-center space-x-2">
          {selectedMeeting ? (
            <>
              <button 
                onClick={() => { setSelectedMeeting(null); setQueryAnswer(null); setIsPlaying(false); setCurrentTime(0); }}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center space-x-1 font-medium transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar à Central de Reuniões</span>
              </button>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-bold text-slate-900 dark:text-slate-100 truncate max-w-sm">
                {selectedMeeting.title}
              </span>
            </>
          ) : (
            <>
              <span className="text-slate-400">Squad Intelligence</span>
              <span className="text-slate-300 dark:text-slate-700">/</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">Hub de Reuniões & Atas Soberanas (WhisperX)</span>
            </>
          )}
        </div>

        {selectedMeeting && (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleGenerateOfficialArtifact}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 shadow-sm ${
                generatedArtifactSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 hover:opacity-90 active:scale-95'
              }`}
              title="Gerar Ata Oficial de Reunião formatada no Drawer de Artefatos"
            >
              {generatedArtifactSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Ata Gerada no Drawer!</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Gerar Ata Executiva Oficial</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {!selectedMeeting ? (
        /* Lista Geral de Reuniões & Cross-Meeting RAG */
        <div className="p-6 space-y-6 max-w-5xl mx-auto w-full">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Video className="w-5 h-5 text-emerald-500" />
                <span>Central de Reuniões & Conhecimento da Squad</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Gravações diarizadas por WhisperX em nível de palavra (*word karaoke*), matriz de decisões e geração de atas executivas.
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WhisperX Local Enclave</span>
            </span>
          </div>

          {/* Cross-Meeting RAG Search Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800/80 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  Inteligência Transversal entre Atas (Cross-Meeting RAG)
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Pesquisa Federada</span>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Ex: Quais decisões de crédito impactam as metas e cobrança?"
                value={crossMeetingQuery}
                onChange={e => setCrossMeetingQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && crossMeetingQuery.trim()) {
                    handleCrossMeetingSearch(crossMeetingQuery);
                  }
                }}
                className="w-full pl-9 pr-24 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 shadow-xs"
              />
              <button
                onClick={() => handleCrossMeetingSearch(crossMeetingQuery)}
                className="absolute right-1.5 top-1 px-3 py-1 rounded-lg bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 font-medium text-[11px] hover:opacity-90 transition"
              >
                Analisar
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Quais decisões de crédito afetam vendas?',
                'Qual o consenso sobre IPCA+ entre comitês?',
                'Como funciona o Hard Lock orçamentário?'
              ].map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleCrossMeetingSearch(sug)}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 hover:border-slate-400 transition"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Cross-Meeting Synthesized Answer */}
            {crossMeetingResult && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/40 shadow-xs space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Síntese Consolidada por IA</span>
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  {crossMeetingResult.answer}
                </p>
                <div className="flex items-center space-x-2 pt-1 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono">
                  <span>Fontes Auditadas:</span>
                  <div className="flex space-x-1.5">
                    {crossMeetingResult.citedMeetings.map(src => (
                      <span key={src.id} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                        {src.title} ({src.folder})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Folder Pills Bar */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {folders.map(folder => (
              <button
                key={folder}
                onClick={() => setSelectedFolder(folder)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition flex items-center space-x-1.5 ${
                  selectedFolder === folder
                    ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 shadow-xs font-semibold'
                    : 'bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:bg-slate-200/60'
                }`}
              >
                <Folder className="w-3.5 h-3.5 text-amber-500" />
                <span>{folder}</span>
              </button>
            ))}
          </div>

          {/* Meetings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMeetings.map(m => (
              <div
                key={m.id}
                onClick={() => { setSelectedMeeting(m); setCurrentTime(0); setIsPlaying(false); }}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-slate-400 dark:hover:border-slate-700 transition cursor-pointer space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-200/60 dark:border-amber-800/60">
                      {m.folder}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition mt-1.5">
                      {m.title}
                    </h3>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:scale-105 transition">
                    <Video className="w-4 h-4 text-emerald-500" />
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-mono">
                  <span>{m.platform}</span>
                  <span>•</span>
                  <span>{m.date}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1 text-slate-600 dark:text-slate-300">
                    <Clock className="w-3 h-3" />
                    <span>{m.duration}</span>
                  </span>
                </div>

                {/* Badges de Decisões e Tarefas */}
                <div className="flex items-center space-x-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                    {m.decisions.length} Decisões
                  </span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    {m.actionItems.length} Action Items
                  </span>
                </div>

                {/* Participants Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {m.participants.map((p, idx) => (
                      <div
                        key={idx}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-slate-900 bg-slate-200 dark:bg-slate-700 text-[10px] font-bold text-center leading-6 text-slate-600 dark:text-slate-200"
                        title={`${p.name} (${p.role})`}
                      >
                        {p.avatar}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform font-medium">
                    <span>Abrir Diarização & Ata</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Visão Detalhada: Player Soberano, Word Karaoke, Decisões e Action Items */
        <div className="p-6 space-y-6 max-w-4xl mx-auto w-full">
          {/* Header Info */}
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <span>{selectedMeeting.platform}</span>
              <span>•</span>
              <span>{selectedMeeting.meetCode}</span>
              <span>•</span>
              <span>{selectedMeeting.date} ({selectedMeeting.duration})</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {selectedMeeting.title}
            </h1>
          </div>

          {/* Player de Áudio Soberano com Waveform Visual & Scrubbing */}
          <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Diarização WhisperX Alinhada em Nível de Palavra</span>
              </span>
              <span>{formatTime(currentTime)} / {formatTime(selectedMeeting.segments?.[selectedMeeting.segments.length - 1]?.endTime || 40)}</span>
            </div>

            {/* Simulated Audio Waveform Bar com Scrubbing */}
            <div 
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const ratio = Math.max(0, Math.min(1, clickX / rect.width));
                const max = selectedMeeting.segments?.[selectedMeeting.segments.length - 1]?.endTime || 40;
                handleSeek(Number((ratio * max).toFixed(2)));
              }}
              className="w-full h-8 bg-slate-900 rounded-lg overflow-hidden flex items-center px-1 cursor-pointer relative group"
              title="Clique para saltar para qualquer trecho do áudio"
            >
              <div 
                className="absolute top-0 bottom-0 left-0 bg-emerald-500/30 transition-all pointer-events-none"
                style={{
                  width: `${(currentTime / (selectedMeeting.segments?.[selectedMeeting.segments.length - 1]?.endTime || 40)) * 100}%`
                }}
              />
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-emerald-400 shadow-sm pointer-events-none"
                style={{
                  left: `${(currentTime / (selectedMeeting.segments?.[selectedMeeting.segments.length - 1]?.endTime || 40)) * 100}%`
                }}
              />
              {/* Barras de waveform simuladas */}
              {Array.from({ length: 48 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 mx-0.5 rounded-full bg-slate-700 transition-all"
                  style={{
                    height: `${20 + ((i * 13) % 65)}%`,
                    backgroundColor: (i / 48) <= (currentTime / (selectedMeeting.segments?.[selectedMeeting.segments.length - 1]?.endTime || 40)) ? '#10b981' : '#475569'
                  }}
                />
              ))}
            </div>

            {/* Controls Bar: Play/Pause, Rewind, FastForward, Velocity */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSeek(Math.max(0, currentTime - 5))}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Voltar 5 segundos"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center transition shadow-md active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => handleSeek(currentTime + 5)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
                  title="Avançar 5 segundos"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>

              {/* Velocidade de Reprodução */}
              <div className="flex items-center space-x-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-xs">
                {[1, 1.25, 1.5, 2].map(rate => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={`px-2 py-0.5 rounded font-mono text-[11px] transition ${
                      playbackRate === rate
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Abas de Navegação da Reunião (Transcrição, Decisões, Ações) */}
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('transcript')}
              className={`pb-2.5 px-3 transition border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'transcript'
                  ? 'border-emerald-500 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>Transcrição & Diarização (*Word Karaoke*)</span>
            </button>

            <button
              onClick={() => setActiveTab('decisions')}
              className={`pb-2.5 px-3 transition border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'decisions'
                  ? 'border-emerald-500 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Matriz de Decisões ({selectedMeeting.decisions.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('actions')}
              className={`pb-2.5 px-3 transition border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'actions'
                  ? 'border-emerald-500 text-slate-900 dark:text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <ListChecks className="w-3.5 h-3.5 text-indigo-500" />
              <span>Action Items ({selectedMeeting.actionItems.length})</span>
            </button>
          </div>

          {/* ABA 1: Transcrição & Diarização com Realce de Palavras (Word Karaoke) */}
          {activeTab === 'transcript' && (
            <div className="space-y-4">
              {/* Caixa de Busca na Transcrição */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Pesquisar termo na transcrição desta reunião..."
                  value={transcriptSearch}
                  onChange={e => setTranscriptSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* Segmentos Diarizados */}
              <div className="space-y-3">
                {selectedMeeting.segments
                  .filter(seg => !transcriptSearch || seg.text.toLowerCase().includes(transcriptSearch.toLowerCase()))
                  .map(seg => {
                    const isCurrentSegment = currentTime >= seg.startTime && currentTime <= seg.endTime;

                    return (
                      <div
                        key={seg.id}
                        className={`p-3.5 rounded-2xl transition border ${
                          isCurrentSegment
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/60 shadow-xs'
                            : 'bg-white dark:bg-slate-900 border-slate-200/70 dark:border-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-bold text-[10px] flex items-center justify-center">
                              {seg.avatar}
                            </div>
                            <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">{seg.speaker}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({seg.role})</span>
                          </div>

                          <button
                            onClick={() => handleSeek(seg.startTime)}
                            className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                            title="Saltar áudio para este instante"
                          >
                            <Clock className="w-3 h-3" />
                            <span>{formatTime(seg.startTime)}</span>
                          </button>
                        </div>

                        {/* Texto com Word Karaoke */}
                        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200">
                          {seg.words.length > 0 ? (
                            seg.words.map((w, wIdx) => {
                              const isSpoken = currentTime >= w.start && currentTime <= w.end;
                              const hasPassed = currentTime > w.end;

                              return (
                                <span
                                  key={wIdx}
                                  onClick={() => handleSeek(w.start)}
                                  className={`cursor-pointer transition-colors px-0.5 rounded ${
                                    isSpoken
                                      ? 'bg-emerald-400 text-slate-950 font-bold shadow-xs'
                                      : hasPassed
                                      ? 'text-slate-900 dark:text-white font-medium'
                                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                                  }`}
                                  title={`Timestamp: ${w.start}s`}
                                >
                                  {w.word}{' '}
                                </span>
                              );
                            })
                          ) : (
                            seg.text
                          )}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* ABA 2: Matriz de Decisões Formais (Stage-Gate TLC v3) */}
          {activeTab === 'decisions' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                Deliberações registradas na Ata Oficial e validadas pela governança de arquitetura.
              </div>

              {selectedMeeting.decisions.map(dec => (
                <div
                  key={dec.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center space-x-2">
                      <Award className="w-4 h-4 text-emerald-500" />
                      <span>{dec.title}</span>
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {dec.consensus}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {dec.deliberation}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                    <span>Aprovado por: {dec.approvedBy}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">Audit Trail OK</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ABA 3: Action Items & Tarefas */}
          {activeTab === 'actions' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                <span>Checklist de Tarefas com Responsáveis e Prazos</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">
                  {selectedMeeting.actionItems.filter(a => a.completed).length} / {selectedMeeting.actionItems.length} concluídos
                </span>
              </div>

              {selectedMeeting.actionItems.map(item => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-xl border transition flex items-center justify-between shadow-xs ${
                    item.completed
                      ? 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800 opacity-70'
                      : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center space-x-3 flex-1 truncate pr-3">
                    <button
                      onClick={() => handleToggleActionItem(selectedMeeting.id, item.id)}
                      className="text-slate-400 hover:text-emerald-500 transition"
                    >
                      {item.completed ? (
                        <CheckSquare className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                    <div className="truncate">
                      <span className={`text-xs block truncate ${item.completed ? 'line-through text-slate-400' : 'font-medium text-slate-800 dark:text-slate-200'}`}>
                        {item.task}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center space-x-1.5 mt-0.5">
                        <span>Prazo: {item.deadline}</span>
                        <span>• Conector:</span>
                        {item.targetApp ? (
                          <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-sans font-semibold text-[10px]">
                            {renderOfficialLogo(item.targetApp, 'w-3 h-3 object-contain')}
                            <span className="capitalize">{item.targetApp}</span>
                          </span>
                        ) : (
                          <span>PCL</span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px] flex items-center justify-center" title={item.assignee}>
                      {item.assigneeAvatar}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pílulas de Perguntas Rápidas sobre a Reunião */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/70 dark:border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Interrogar a IA sobre esta Reunião:</span>
            </span>

            <div className="flex flex-wrap gap-2">
              {selectedMeeting.questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskQuestion(q)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 transition shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {queryAnswer && (
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/40 text-xs space-y-1 animate-in fade-in duration-150 mt-2">
                <span className="font-semibold text-slate-900 dark:text-white block">
                  Resposta Contextual da IA:
                </span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {queryAnswer}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
