import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Cpu, Columns, Layers, Bot, User, ShieldCheck, 
  FileText, ExternalLink, Play, Clock, Sparkles, Copy, Check,
  Share2, Volume2, Square, GitBranch, Globe, X, Plus, ChevronDown,
  BookOpen, Zap, ArrowRight, Presentation, Image as ImageIcon, Video as VideoIcon, Table as TableIcon
} from 'lucide-react';
import { Conversation, ChatMessage, Artifact, TargetArtifactFormat, GrowthStoreDivisionId } from '../../types';
import { AgentNarrationPanel } from './AgentNarrationPanel';
import { CortexCanvas } from './CortexCanvas';
import { GrowthOsDualPlexPanel } from './GrowthOsDualPlexPanel';
import { ActionPreviewCard } from './ActionPreviewCard';
import { renderOfficialLogo } from '../common/AppOfficialLogos';
import { LiveExecutionStepper } from './LiveExecutionStepper';
import { MarkdownRenderer } from './MarkdownRenderer';
import { sanitizeMarkdownForSpeech } from '../../services/audio/ttsSanitizer';
import { formatMessageTimestamp, formatFullDateTime } from '../../utils/dateGrouping';

interface DualPlexWorkspaceProps {
  conversation: Conversation;
  openConversations?: Conversation[];
  onSelectConversation?: (conv: Conversation) => void;
  onCloseConversation?: (convId: string) => void;
  onNewConversation?: () => void;
  onOpenArtifact: (art: Artifact) => void;
  onCreateBranch?: (messageId: string) => void;
  onGenerateArtifactForMessage?: (msg: ChatMessage, format: TargetArtifactFormat) => void;
  viewMode?: 'chat' | 'canvas' | 'dual';
  onViewModeChange?: (mode: 'chat' | 'canvas' | 'dual') => void;
  onPromptCardClick?: (text: string) => void;
  activeGrowthDivisionId?: GrowthStoreDivisionId;
  onSelectGrowthDivision?: (divisionId: GrowthStoreDivisionId) => void;
  rightSplitTab?: 'cortex-canvas' | 'growthos-store';
  onRightSplitTabChange?: (tab: 'cortex-canvas' | 'growthos-store') => void;
  onTrialPillTextChange?: (pillText: string) => void;
}

export const DualPlexWorkspace: React.FC<DualPlexWorkspaceProps> = ({
  conversation,
  openConversations = [conversation],
  onSelectConversation,
  onCloseConversation,
  onNewConversation,
  onOpenArtifact,
  onCreateBranch,
  onGenerateArtifactForMessage,
  viewMode: controlledViewMode,
  onViewModeChange,
  onPromptCardClick,
  activeGrowthDivisionId = 'estudio-midia',
  onSelectGrowthDivision,
  rightSplitTab = 'growthos-store',
  onRightSplitTabChange,
  onTrialPillTextChange
}) => {
  const [internalViewMode, setInternalViewMode] = useState<'chat' | 'canvas' | 'dual'>('chat');
  const viewMode = controlledViewMode !== undefined ? controlledViewMode : internalViewMode;

  const handleSetViewMode = (mode: 'chat' | 'canvas' | 'dual') => {
    setInternalViewMode(mode);
    onViewModeChange?.(mode);
  };

  const [showNarration, setShowNarration] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
  const [transformingMsgId, setTransformingMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll imediato para a última mensagem ao enviar ou receber respostas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]);

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareText = (text: string) => {
    if (navigator.share) {
      navigator.share({ title: 'PCL AEOS Stream', text });
    } else {
      navigator.clipboard.writeText(text);
      setCopiedId('shared');
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleToggleSpeak = (id: string, text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (playingMessageId === id) {
      window.speechSynthesis.cancel();
      setPlayingMessageId(null);
    } else {
      window.speechSynthesis.cancel();
      const speechText = sanitizeMarkdownForSpeech(text);
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setPlayingMessageId(null);
      utterance.onerror = () => setPlayingMessageId(null);
      setPlayingMessageId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  // Identificar a mensagem de inferência ativa ou mais recente para sincronização em tempo real com o Cortex Canvas
  const isProcessingActive = conversation.messages.some(m => m.isProcessing);
  const activeAgentMessage = [...conversation.messages].reverse().find(m => m.isProcessing) 
    || [...conversation.messages].reverse().find(m => m.sender === 'agent')
    || conversation.messages[conversation.messages.length - 1];

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden">
      {/* Top Workspace Bar: Multi-Conversation Tabs & Dual-Plex Mode Switcher */}
      <div className="h-10 px-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs select-none">
        {/* Barra de Abas Multi-Conversa (Até 3 Conversas Simultâneas) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-[65%] custom-scrollbar py-0.5">
          {openConversations.map(tabConv => {
            const isActive = tabConv.id === conversation.id;
            return (
              <div
                key={tabConv.id}
                onClick={() => onSelectConversation && onSelectConversation(tabConv)}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs cursor-pointer transition max-w-[200px] border shadow-xs ${
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white font-semibold border-slate-200 dark:border-slate-700'
                    : 'bg-slate-100/70 dark:bg-slate-900/40 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 border-transparent hover:bg-slate-200/50'
                }`}
                title={tabConv.title}
              >
                <MessageSquare className={`w-3 h-3 flex-shrink-0 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span className="truncate">{tabConv.title}</span>
                {openConversations.length > 1 && onCloseConversation && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCloseConversation(tabConv.id);
                    }}
                    className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-1 transition"
                    title="Fechar aba"
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Botão Nova Aba (+) - Disponível se houver menos de 5 abas */}
          {openConversations.length < 5 && onNewConversation && (
            <button
              onClick={onNewConversation}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-700"
              title="Nova Aba de Conversa (Máx 5)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Toggle: Chat Only | Canvas Only | Dual-Plex Split */}
        <div className="flex items-center space-x-1 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm flex-shrink-0">
          <button
            onClick={() => handleSetViewMode('chat')}
            className={`px-2 py-1 rounded transition flex items-center space-x-1 ${
              viewMode === 'chat'
                ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat Stream</span>
          </button>

          <button
            onClick={() => handleSetViewMode('canvas')}
            className={`px-2 py-1 rounded transition flex items-center space-x-1 ${
              viewMode === 'canvas'
                ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cortex Canvas</span>
          </button>

          <button
            onClick={() => handleSetViewMode('dual')}
            className={`px-2 py-1 rounded transition flex items-center space-x-1 ${
              viewMode === 'dual'
                ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Columns className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dual-Plex (Split)</span>
          </button>
        </div>
      </div>

      {/* Optional Real-time Agent Timeline Narration Panel (Collapsible) */}
      {showNarration && (
        <AgentNarrationPanel
          agentName="Cortex Enterprise Engine"
          taskTitle="Executando Validação de Stage Gates TLC v3 & Síntese Multimodal..."
          currentStepIndex={4}
          totalSteps={5}
          steps={[
            'Ingestão do prompt do usuário',
            'Sanitização PII Guard LGPD',
            'Execução Omniroute em Modelo Híbrido',
            'Gerando Artefatos Executivos de Apresentação',
            'Assinando Audit Trail SHA-256 no PostgreSQL'
          ]}
        />
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side / Main: Chat Stream */}
        {(viewMode === 'chat' || viewMode === 'dual') && (
          <div className={`flex-1 overflow-y-auto px-4 py-6 custom-scrollbar ${viewMode === 'dual' ? 'border-r border-slate-200 dark:border-slate-800' : ''}`}>
            <div className="max-w-3xl mx-auto space-y-6">
              {conversation.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 px-4 select-none animate-in fade-in duration-300">
                  {/* Official PromptCore Labs Logo with Cyan Glow */}
                  <div className="flex items-center justify-center mb-4 group select-none">
                    <img 
                      src="/assets/PCL_Logo_Transparente.png" 
                      alt="PromptCore Labs Logo" 
                      className="h-[120px] w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      style={{ filter: 'drop-shadow(0 0 22px rgba(56, 189, 248, 0.55))' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
                        if (nextEl) nextEl.style.display = 'flex';
                      }}
                    />
                    <div className="hidden w-24 h-24 rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-500 text-white items-center justify-center font-bold text-3xl shadow-xl shadow-cyan-500/30">
                      PCL
                    </div>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
                    PCL Cockpit
                  </h2>
                  <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 text-center max-w-md leading-relaxed">
                    Cognitive Engineering Platform • Como podemos acelerar seus resultados hoje?
                  </p>

                  {/* 2 Executive Prompt Shortcut Cards (Auditoria & Pesquisa Profunda) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-7 w-full max-w-xl">
                    {[
                      {
                        icon: Zap,
                        iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
                        title: 'Auditar Daemons & FinOps',
                        desc: 'Verificar telemetria e consumo dos motores soberanos (:20140 Laya + :11434 Ollama).',
                        prompt: 'Como está a saúde e a alocação de recursos dos daemons locais Laya (:20140) e Ollama (:11434)?'
                      },
                      {
                        icon: Globe,
                        iconColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
                        title: 'Pesquisa Profunda com Citações',
                        desc: 'Estruturar análise de mercado com árvore de hipóteses e fontes verificadas.',
                        prompt: 'Faça uma pesquisa profunda e síntese comparativa dos avanços de IA corporativa com resíduo zero de dados.'
                      }
                    ].map((card, i) => {
                      const Icon = card.icon;
                      return (
                        <div
                          key={i}
                          onClick={() => onPromptCardClick && onPromptCardClick(card.prompt)}
                          className="p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-emerald-500/80 hover:shadow-md dark:hover:border-emerald-500/50 cursor-pointer transition-all group flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center space-x-2.5 mb-2">
                              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${card.iconColor}`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <h3 className="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {card.title}
                              </h3>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                              {card.desc}
                            </p>
                          </div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-3 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span>Iniciar prompt</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Badge Inferior de Soberania */}
                  <div className="mt-8 flex items-center space-x-2 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800/60 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span>Soberano Local • Custo Marginal $0.00 • Resíduo Zero de Dados (BYOS)</span>
                  </div>
                </div>
              ) : (
                <>
                  {conversation.messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex space-x-3.5 ${msg.sender === 'user' ? 'ml-auto flex-row-reverse space-x-reverse max-w-2xl' : 'max-w-3xl'}`}
                >
                  {/* Avatar */}
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white'
                      : msg.sender === 'agent'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600'
                  }`}>
                    {msg.sender === 'user' ? 'EA' : msg.sender === 'agent' ? <Bot className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>

                  {/* Message Bubble Container */}
                  <div className="space-y-2 max-w-2xl">
                    {/* Message Bubble */}
                    <div className={`rounded-2xl p-4 text-xs space-y-2.5 transition-all select-text cursor-text ${
                      msg.sender === 'user'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60'
                        : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-800 shadow-sm'
                    }`}>
                      {/* Cabeçalho da Mensagem: Se for do usuário, omite nome redundante pois avatar externo EA já identifica */}
                      {msg.sender !== 'user' ? (
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1 select-none">
                          <span className="font-semibold">{msg.senderName}</span>
                          <span 
                            title={formatFullDateTime(msg)} 
                            className="cursor-help hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {formatMessageTimestamp(msg)}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end text-[10px] text-slate-400 dark:text-slate-500 mb-0.5 select-none">
                          <span 
                            title={formatFullDateTime(msg)} 
                            className="cursor-help hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {formatMessageTimestamp(msg)}
                          </span>
                        </div>
                      )}

                      {/* Live Execution Stepper: Feedback em tempo real durante e após a execução */}
                      {msg.steps && msg.steps.length > 0 && (
                        <LiveExecutionStepper
                          steps={msg.steps}
                          activeStepIndex={msg.activeStepIndex || 0}
                          elapsedSeconds={msg.elapsedSeconds || 0}
                          isProcessing={Boolean(msg.isProcessing)}
                          confidenceScore={msg.confidenceScore}
                        />
                      )}

                      {/* Conteúdo da Mensagem com Renderizador Markdown Modular */}
                      {msg.text && (
                        <div className="leading-relaxed">
                          <MarkdownRenderer content={msg.text} />
                        </div>
                      )}

                      {/* Action Preview Card (Inline Editable Action - e.g. Email/Meeting Draft) */}
                      {msg.actionProposal && (
                        <div className="pt-2">
                          <ActionPreviewCard action={msg.actionProposal} />
                        </div>
                      )}

                      {/* Fontes e Referências Desacopladas Bipartidas (ADR-0007 / Padrão Gemini + Soberania PCL) */}
                      {msg.webReferences && msg.webReferences.length > 0 && (() => {
                        const canonicalRefs = msg.webReferences.filter(ref => 
                          ref.source.includes('Canônico') || 
                          ref.source.includes('PCL') || 
                          (ref as any).sourceType === 'local_canonical' ||
                          ref.url.includes('PromptCoreLabs_AEOS') ||
                          ref.url.includes('knowledge/')
                        );
                        const webRefs = msg.webReferences.filter(ref => !canonicalRefs.includes(ref));

                        return (
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                            {/* Pílula 1: Acervo Canônico PCL (Governado / RAG Soberano) */}
                            {canonicalRefs.length > 0 && (
                              <details className="group/canonical text-xs">
                                <summary className="cursor-pointer list-none flex items-center space-x-2 py-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition select-none">
                                  <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/80 text-[10px] font-medium text-emerald-800 dark:text-emerald-300">
                                    <BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                    <span>🏛️ Acervo Canônico PCL ({canonicalRefs.length})</span>
                                  </span>
                                  <ChevronDown className="w-3.5 h-3.5 text-emerald-500 transition-transform group-open/canonical:rotate-180" />
                                </summary>

                                <div className="pt-2 flex flex-wrap gap-1.5 animate-in fade-in duration-150">
                                  {canonicalRefs.map((ref, idx) => (
                                    <a
                                      key={idx}
                                      href={ref.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      title={ref.title}
                                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition max-w-[280px] shadow-2xs bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200/80 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400"
                                    >
                                      <span className="truncate">{ref.title}</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-50 flex-shrink-0" />
                                    </a>
                                  ))}
                                </div>
                              </details>
                            )}

                            {/* Pílula 2: Fontes Web Verificadas (Pesquisa Externa com Citações Neutras) */}
                            {webRefs.length > 0 && (
                              <details className="group/web text-xs">
                                <summary className="cursor-pointer list-none flex items-center space-x-2 py-0.5 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition select-none">
                                  <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                                    <Globe className="w-3 h-3 text-sky-500" />
                                    <span>🌐 Fontes Web Verificadas ({webRefs.length})</span>
                                  </span>
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform group-open/web:rotate-180" />
                                </summary>

                                <div className="pt-2 flex flex-wrap gap-1.5 animate-in fade-in duration-150">
                                  {webRefs.map((ref, idx) => (
                                    <a
                                      key={idx}
                                      href={ref.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      title={ref.title}
                                      className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition max-w-[280px] shadow-2xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400 dark:hover:border-sky-500"
                                    >
                                      <span className="truncate">{ref.title}</span>
                                      <ExternalLink className="w-2.5 h-2.5 opacity-50 flex-shrink-0" />
                                    </a>
                                  ))}
                                </div>
                              </details>
                            )}
                          </div>
                        );
                      })()}

                      {/* Attached Artifacts — Hub de Artefatos Multimodais Inline na Conversa */}
                      {msg.artifacts && msg.artifacts.length > 0 && (
                        <div className="space-y-2.5 pt-3 border-t border-slate-200/70 dark:border-slate-800">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                              <Sparkles className="w-3 h-3" />
                              <span>Hub de Artefatos Multimodais na Conversa ({msg.artifacts.length})</span>
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">Clique para abrir no Estúdio Soberano</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {msg.artifacts.map(art => {
                              const getArtifactIcon = () => {
                                switch (art.type) {
                                  case 'slide': return <Presentation className="w-4 h-4 text-amber-500 flex-shrink-0" />;
                                  case 'table':
                                  case 'sheet': return <TableIcon className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
                                  case 'image': return <ImageIcon className="w-4 h-4 text-sky-500 flex-shrink-0" />;
                                  case 'audio': return <Volume2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />;
                                  case 'video': return <VideoIcon className="w-4 h-4 text-purple-500 flex-shrink-0" />;
                                  case 'app': return <Sparkles className="w-4 h-4 text-pink-500 flex-shrink-0" />;
                                  case 'diagram': return <Layers className="w-4 h-4 text-indigo-500 flex-shrink-0" />;
                                  default: return <FileText className="w-4 h-4 text-slate-500 flex-shrink-0" />;
                                }
                              };

                              const getArtifactLabel = () => {
                                switch (art.type) {
                                  case 'slide': return 'Slides 16:9';
                                  case 'table':
                                  case 'sheet': return 'Tabela CSV';
                                  case 'image': return 'Infográfico HD';
                                  case 'audio': return 'Áudio WAV';
                                  case 'video': return 'Vídeo 60fps';
                                  case 'app': return 'App HTML5';
                                  case 'diagram': return 'Diagrama SVG';
                                  default: return 'Documento';
                                }
                              };

                              const renderInlinePreview = () => {
                                if (art.type === 'image' && art.mediaUrl) {
                                  return (
                                    <div className="h-20 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                                      <img src={art.mediaUrl} alt={art.title} className="w-full h-full object-cover" />
                                    </div>
                                  );
                                }
                                if (art.type === 'diagram' && art.content.trim().startsWith('<svg')) {
                                  return (
                                    <div
                                      className="h-20 w-full rounded-lg overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center p-1 [&_svg]:w-full [&_svg]:h-full"
                                      dangerouslySetInnerHTML={{ __html: art.content }}
                                    />
                                  );
                                }
                                if (art.type === 'slide') {
                                  const slideCount = art.content.split(/\n---\n/).length;
                                  return (
                                    <div className="h-16 w-full rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 px-3 py-2 flex items-center justify-between text-white">
                                      <div className="truncate pr-2">
                                        <span className="text-[9px] font-mono text-sky-400 uppercase block">Keynote Deck • {slideCount} Lâminas</span>
                                        <span className="text-[11px] font-bold truncate block">{art.title}</span>
                                      </div>
                                      <Play className="w-4 h-4 text-amber-400 shrink-0" />
                                    </div>
                                  );
                                }
                                if (art.type === 'audio') {
                                  return (
                                    <div className="h-14 w-full rounded-lg bg-slate-950 border border-slate-800 px-3 flex items-center justify-between">
                                      <div className="flex items-end space-x-0.5 h-6">
                                        {[45, 80, 60, 95, 50, 85, 70, 100, 55, 75, 65, 90].map((h, i) => (
                                          <span key={i} style={{ height: `${h}%` }} className="w-1 rounded-full bg-emerald-400" />
                                        ))}
                                      </div>
                                      <span className="text-[10px] font-mono text-emerald-300 font-semibold">▶ WAV + Voz PT-BR</span>
                                    </div>
                                  );
                                }
                                if (art.type === 'video') {
                                  return (
                                    <div className="h-14 w-full rounded-lg bg-gradient-to-r from-purple-950 via-slate-950 to-indigo-950 border border-purple-800/40 px-3 flex items-center justify-between text-purple-200">
                                      <span className="text-[10px] font-mono">🎬 4 Capítulos • Render Canvas 60fps</span>
                                      <Play className="w-3.5 h-3.5 text-purple-400 fill-current" />
                                    </div>
                                  );
                                }
                                if (art.type === 'table' || art.type === 'sheet') {
                                  return (
                                    <div className="h-14 w-full rounded-lg bg-emerald-950/90 border border-emerald-800/50 px-3 flex items-center justify-between text-emerald-200 font-mono text-[10px]">
                                      <span className="truncate pr-2">📊 {art.title}</span>
                                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[9px] shrink-0">{art.formatExt || '.xlsx'}</span>
                                    </div>
                                  );
                                }
                                if (art.type === 'infographic') {
                                  return (
                                    <div className="h-14 w-full rounded-lg bg-sky-950/90 border border-sky-800/50 px-3 flex items-center justify-between text-sky-200 font-mono text-[10px]">
                                      <span className="truncate pr-2">📈 {art.title}</span>
                                      <span className="px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[9px] shrink-0">Infográfico</span>
                                    </div>
                                  );
                                }
                                if (art.type === 'app') {
                                  return (
                                    <div className="h-14 w-full rounded-lg bg-slate-950 border border-pink-500/30 px-3 flex items-center justify-between text-pink-200 font-mono text-[10px]">
                                      <span className="truncate pr-2">⚡ {art.title}</span>
                                      <span className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 text-[9px] shrink-0">LIVE</span>
                                    </div>
                                  );
                                }
                                return (
                                  <div className="h-14 w-full rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 flex items-center justify-between text-slate-600 dark:text-slate-300 font-mono text-[10px]">
                                    <span className="truncate pr-2">📄 {art.title}</span>
                                    <span className="text-[9px] text-slate-400 shrink-0">{art.formatExt || '.md'}</span>
                                  </div>
                                );
                              };

                              return (
                                <div
                                  key={art.id}
                                  data-testid={`inline-artifact-${art.id}`}
                                  onClick={() => onOpenArtifact(art)}
                                  className="p-3 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-md cursor-pointer transition flex flex-col justify-between space-y-2 group select-none"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center space-x-2 min-w-0">
                                      {getArtifactIcon()}
                                      <span className="font-bold text-xs text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition truncate">
                                        {art.title}
                                      </span>
                                    </div>
                                    <span className="px-1.5 py-0.5 rounded font-mono text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase shrink-0">
                                      {getArtifactLabel()}
                                    </span>
                                  </div>

                                  {renderInlinePreview()}

                                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                                    <span className="truncate pr-2">{art.summary}</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold shrink-0 flex items-center space-x-1">
                                      <span>Abrir</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Actions Toolbar: Copiar, Compartilhar, Ouvir, Criar Branch */}
                      <div className="flex items-center space-x-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 text-slate-400 select-none">
                        <button
                          onClick={() => handleCopyText(msg.id, msg.text)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition flex items-center space-x-1"
                          title="Copiar texto para a área de transferência"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Copiado</span>
                            </>
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        <button
                          onClick={() => handleShareText(msg.text)}
                          className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                          title="Compartilhar trecho"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleSpeak(msg.id, msg.text)}
                          className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition ${
                            playingMessageId === msg.id ? 'text-emerald-500' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                          }`}
                          title={playingMessageId === msg.id ? 'Parar leitura em voz alta' : 'Ouvir texto em voz alta'}
                        >
                          {playingMessageId === msg.id ? <Square className="w-3.5 h-3.5 fill-current" /> : <Volume2 className="w-3.5 h-3.5" />}
                        </button>

                        {onCreateBranch && (
                          <button
                            onClick={() => onCreateBranch(msg.id)}
                            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition flex items-center space-x-1"
                            title="Criar branch a partir deste ponto da conversa"
                          >
                            <GitBranch className="w-3.5 h-3.5" />
                            <span className="text-[10px]">Branch</span>
                          </button>
                        )}

                        {/* Botão de Geração Cirúrgica de Artefato sob Demanda */}
                        {msg.sender === 'agent' && onGenerateArtifactForMessage && (
                          <div className="relative ml-auto">
                            <button
                              onClick={() => setTransformingMsgId(transformingMsgId === msg.id ? null : msg.id)}
                              className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 transition flex items-center space-x-1 text-[10px] font-medium"
                              title="Gerar um artefato multimodal a partir desta resposta"
                            >
                              <Sparkles className="w-3 h-3 text-emerald-600" />
                              <span>Gerar Artefato ▾</span>
                            </button>

                            {transformingMsgId === msg.id && (
                              <div className="absolute right-0 bottom-7 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-50 text-[11px] animate-in fade-in duration-100">
                                <div className="px-2 py-1 text-[9px] font-mono uppercase text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
                                  Transformar Resposta em:
                                </div>
                                {[
                                  { label: 'Slides 16:9 (.pptx)', format: 'slide' as const, icon: Presentation },
                                  { label: 'Planilha Analítica (.xlsx)', format: 'sheet' as const, icon: TableIcon },
                                  { label: 'Diagrama Mermaid (.svg)', format: 'diagram' as const, icon: Layers },
                                  { label: 'Infográfico & KPIs (.svg)', format: 'infographic' as const, icon: ImageIcon },
                                  { label: 'Simulador Sandbox (.html)', format: 'app' as const, icon: Sparkles },
                                  { label: 'Documento Executivo (.md)', format: 'doc' as const, icon: FileText }
                                ].map((opt, i) => {
                                  const IconC = opt.icon;
                                  return (
                                    <button
                                      key={i}
                                      onClick={() => {
                                        onGenerateArtifactForMessage(msg, opt.format);
                                        setTransformingMsgId(null);
                                      }}
                                      className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center space-x-1.5 transition text-slate-700 dark:text-slate-200"
                                    >
                                      <IconC className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                                      <span className="truncate">{opt.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
                </>
              )}
              {/* Anchor for Auto-scroll */}
              <div ref={messagesEndRef} className="h-2" />
            </div>
          </div>
        )}

        {/* Right Side / Canvas & GrowthOS Dual-Plex Split Mode */}
        {(viewMode === 'canvas' || viewMode === 'dual') && (
          <div className="flex-1 h-full flex flex-col overflow-hidden">
            {/* Switcher Interno do Painel Direito no Dual-Plex: GrowthOS™ Store (D0-D14 & Micro-ROI) vs. Cortex Canvas */}
            <div className="h-9 px-3 border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/90 flex items-center justify-between text-[11px] select-none">
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  data-testid="split-tab-growthos-store"
                  onClick={() => onRightSplitTabChange?.('growthos-store')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center space-x-1 ${
                    rightSplitTab === 'growthos-store'
                      ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 shadow-2xs border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-emerald-500" />
                  <span>PCL GrowthOS™ Store & ROI (D0–D14)</span>
                </button>
                <button
                  type="button"
                  data-testid="split-tab-cortex-canvas"
                  onClick={() => onRightSplitTabChange?.('cortex-canvas')}
                  className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center space-x-1 ${
                    rightSplitTab === 'cortex-canvas'
                      ? 'bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shadow-2xs border border-slate-200/80 dark:border-slate-700'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Cpu className="w-3 h-3 text-indigo-500" />
                  <span>Cortex DAG Canvas</span>
                </button>
              </div>
              <span className="text-[9.5px] font-mono text-slate-400">CLS = 0 • Laya™ Inside</span>
            </div>

            <div className="flex-1 overflow-hidden">
              {rightSplitTab === 'growthos-store' ? (
                <GrowthOsDualPlexPanel
                  activeDivisionId={activeGrowthDivisionId}
                  onSelectDivision={onSelectGrowthDivision}
                  onTrialPillTextChange={(pillText) => onTrialPillTextChange?.(pillText)}
                  onExecuteModulePrompt={(prompt) => onPromptCardClick?.(prompt)}
                />
              ) : (
                <CortexCanvas
                  activeMessage={activeAgentMessage}
                  isProcessing={isProcessingActive}
                  activeStepIndex={activeAgentMessage?.activeStepIndex ?? (isProcessingActive ? 2 : 5)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
