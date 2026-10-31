import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, Cpu, Columns, Layers, Bot, User, ShieldCheck, 
  FileText, ExternalLink, Play, Clock, Sparkles, Copy, Check,
  Share2, Volume2, Square, GitBranch, Globe, X, Plus, ChevronDown
} from 'lucide-react';
import { Conversation, ChatMessage, Artifact } from '../../types';
import { AgentNarrationPanel } from './AgentNarrationPanel';
import { CortexCanvas } from './CortexCanvas';
import { ActionPreviewCard } from './ActionPreviewCard';
import { renderOfficialLogo } from '../common/AppOfficialLogos';
import { LiveExecutionStepper } from './LiveExecutionStepper';
import { MarkdownRenderer } from './MarkdownRenderer';

interface DualPlexWorkspaceProps {
  conversation: Conversation;
  openConversations?: Conversation[];
  onSelectConversation?: (conv: Conversation) => void;
  onCloseConversation?: (convId: string) => void;
  onNewConversation?: () => void;
  onOpenArtifact: (art: Artifact) => void;
  onCreateBranch?: (messageId: string) => void;
}

export const DualPlexWorkspace: React.FC<DualPlexWorkspaceProps> = ({
  conversation,
  openConversations = [conversation],
  onSelectConversation,
  onCloseConversation,
  onNewConversation,
  onOpenArtifact,
  onCreateBranch
}) => {
  const [viewMode, setViewMode] = useState<'chat' | 'canvas' | 'dual'>('chat');
  const [showNarration, setShowNarration] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null);
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
      const utterance = new SpeechSynthesisUtterance(text);
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
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-slate-900 overflow-hidden select-none">
      {/* Top Workspace Bar: Multi-Conversation Tabs & Dual-Plex Mode Switcher */}
      <div className="h-10 px-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between text-xs">
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
            onClick={() => setViewMode('chat')}
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
            onClick={() => setViewMode('canvas')}
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
            onClick={() => setViewMode('dual')}
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
                    <div className={`rounded-2xl p-4 text-xs space-y-2.5 transition-all ${
                      msg.sender === 'user'
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700/60'
                        : 'bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 border border-slate-200/70 dark:border-slate-800 shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-semibold">{msg.senderName}</span>
                        <span>{msg.timestamp}</span>
                      </div>

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

                      {/* Fontes e Referências Desacopladas (Padrão Gemini / Perplexity) */}
                      {msg.webReferences && msg.webReferences.length > 0 && (
                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                          <details className="group/sources text-xs">
                            <summary className="cursor-pointer list-none flex items-center space-x-2 py-1 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition select-none">
                              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-[10px] font-medium text-slate-700 dark:text-slate-300">
                                <Globe className="w-3 h-3 text-sky-500" />
                                <span>Fontes Consultadas ({msg.webReferences.length})</span>
                              </span>
                              <ChevronDown className="w-3.5 h-3.5 text-slate-400 transition-transform group-open/sources:rotate-180" />
                            </summary>

                            <div className="pt-2 flex flex-wrap gap-1.5 animate-in fade-in duration-150">
                              {msg.webReferences.map((ref, idx) => {
                                const isCanonical = ref.source.includes('Canônico') || ref.source.includes('PCL');
                                return (
                                  <a
                                    key={idx}
                                    href={ref.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    title={ref.title}
                                    className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition max-w-[280px] shadow-2xs ${
                                      isCanonical
                                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:border-emerald-400'
                                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-sky-400 dark:hover:border-sky-500'
                                    }`}
                                  >
                                    <span className="truncate">{ref.title}</span>
                                    <ExternalLink className="w-2.5 h-2.5 opacity-50 flex-shrink-0" />
                                  </a>
                                );
                              })}
                            </div>
                          </details>
                        </div>
                      )}

                      {/* Attached Artifacts */}
                      {msg.artifacts && msg.artifacts.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide block">
                            Artefatos Gerados:
                          </span>
                          {msg.artifacts.map(art => (
                            <div
                              key={art.id}
                              onClick={() => onOpenArtifact(art)}
                              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-white dark:hover:bg-slate-900 cursor-pointer transition flex items-center justify-between group shadow-sm"
                            >
                              <div className="flex items-center space-x-2.5 truncate">
                                <FileText className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <div className="truncate">
                                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 group-hover:text-emerald-500 transition truncate block">
                                    {art.title}
                                  </span>
                                  <span className="text-[11px] text-slate-400 truncate block">
                                    {art.summary}
                                  </span>
                                </div>
                              </div>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 flex-shrink-0 ml-2" />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Actions Toolbar: Copiar, Compartilhar, Ouvir, Criar Branch */}
                      <div className="flex items-center space-x-2 pt-1.5 border-t border-slate-100 dark:border-slate-800/60 text-slate-400">
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
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {/* Anchor for Auto-scroll */}
              <div ref={messagesEndRef} className="h-2" />
            </div>
          </div>
        )}

        {/* Right Side / Canvas Mode */}
        {(viewMode === 'canvas' || viewMode === 'dual') && (
          <div className="flex-1 h-full">
            <CortexCanvas
              activeMessage={activeAgentMessage}
              isProcessing={isProcessingActive}
              activeStepIndex={activeAgentMessage?.activeStepIndex ?? (isProcessingActive ? 2 : 5)}
            />
          </div>
        )}
      </div>
    </div>
  );
};
