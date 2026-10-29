import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Cpu, ChevronDown, ShieldCheck, Zap, Database, 
  FileText, Check, ChevronRight, User, Sparkles, Globe
} from 'lucide-react';
import { ContextPopover } from './ContextPopover';
import { VoiceRecorderButton } from './VoiceRecorderButton';
import { TokenAquaOrb } from './TokenAquaOrb';
import { piiGuardService } from '../../services/security/piiGuardService';
import { OMNIROUTE_MODELS, ModelOption } from '../../services/llm/omniRouteService';
import { renderOfficialLogo } from '../common/AppOfficialLogos';

interface SuperChatbubbleProps {
  onSendMessage: (text: string, webSearch?: boolean, profileId?: string) => void;
  usedTokens?: number;
  maxTokens?: number;
}

interface MentionOption {
  id: string;
  label: string;
  category: 'app' | 'user' | 'doc';
  logoId?: string;
  icon?: string;
  tag: string;
  detail?: string;
}

export interface CognitiveProfile {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  iconColor: string;
  badge: string;
  cost: string;
  latency: string;
  defaultModelId: string;
}

export const COGNITIVE_PROFILES: CognitiveProfile[] = [
  {
    id: 'sintese-executiva',
    name: 'Síntese Executiva',
    subtitle: 'Cloud Frontier • Gemini 3.5 Flash',
    description: 'Respostas ágeis, resumos executivos e síntese de negócios.',
    iconColor: 'text-sky-500',
    badge: 'Alta Velocidade',
    cost: '$0.0003/k',
    latency: '~350ms',
    defaultModelId: 'gemini-2-5-flash'
  },
  {
    id: 'raciocinio-profundo',
    name: 'Raciocínio Profundo & Código',
    subtitle: 'Frontier Reasoning • Claude 3.5 / GPT-4o',
    description: 'Arquitetura de sistemas, raciocínio lógico avançado e geração de código complexo.',
    iconColor: 'text-amber-500',
    badge: 'Complexidade Alta',
    cost: '$0.003/k',
    latency: '~1.2s',
    defaultModelId: 'claude-3-5-sonnet'
  },
  {
    id: 'soberano-local',
    name: 'Soberano Local $0.00',
    subtitle: 'Local Enclave • CPU INT8 Laya + Ollama',
    description: 'Enclave 100% on-premise com zero saída de dados e inferência gratuita.',
    iconColor: 'text-emerald-500',
    badge: '0 MB VRAM (CPU)',
    cost: '$0.00',
    latency: '~25ms / ~800ms',
    defaultModelId: 'llama-3-3-local'
  },
  {
    id: 'omniroute-auto',
    name: 'Roteamento Autônomo OmniRoute',
    subtitle: 'Auto Engine • Balanceamento SLA',
    description: 'Seleção dinâmica por intenção, restrição orçamentária e sensibilidade PII.',
    iconColor: 'text-indigo-400',
    badge: 'Autônomo',
    cost: 'Otimizado',
    latency: 'Dinâmica',
    defaultModelId: 'auto-route'
  }
];

export const SuperChatbubble: React.FC<SuperChatbubbleProps> = ({
  onSendMessage,
  usedTokens = 14200,
  maxTokens = 128000
}) => {
  const [text, setText] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<CognitiveProfile>(COGNITIVE_PROFILES[0]); // Síntese Executiva por padrão
  const [selectedModel, setSelectedModel] = useState<ModelOption>(OMNIROUTE_MODELS[0]);
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [piiStatus, setPiiStatus] = useState<string | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  // Mention system state (@ or #)
  const [mentionType, setMentionType] = useState<'app_or_user' | 'doc' | null>(null);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const MENTIONS_CATALOG: MentionOption[] = [
    // Apps (Ordem exata do benchmark Jumpad.ai da captura de tela 0:05 / 1:46)
    { id: 'bigquery', label: 'Google BigQuery', category: 'app', logoId: 'bigquery', tag: '@BigQuery' },
    { id: 'sap', label: 'SAP', category: 'app', logoId: 'sap', tag: '@SAP' },
    { id: 'sheets', label: 'Google Sheets', category: 'app', logoId: 'sheets', tag: '@GoogleSheets' },
    { id: 'hubspot', label: 'HubSpot', category: 'app', logoId: 'hubspot', tag: '@HubSpot' },
    { id: 'salesforce', label: 'Salesforce', category: 'app', logoId: 'salesforce', tag: '@Salesforce' },
    { id: 'pipedrive', label: 'Pipedrive', category: 'app', logoId: 'pipedrive', tag: '@Pipedrive' },
    { id: 'rdstation', label: 'RD Station', category: 'app', logoId: 'rdstation', tag: '@RDStation' },
    { id: 'jira', label: 'Jira', category: 'app', logoId: 'jira', tag: '@Jira' },
    { id: 'gmail', label: 'Gmail', category: 'app', logoId: 'gmail', tag: '@Gmail' },
    { id: 'calendar', label: 'Google Agenda', category: 'app', logoId: 'calendar', tag: '@GoogleAgenda' },
    // Team Members
    { id: 'juliana', label: 'Juliana Castro', category: 'user', icon: 'JC', tag: '@Juliana Castro', detail: 'Treasury & Finanças' },
    { id: 'mariana', label: 'Mariana Souza', category: 'user', icon: 'MS', tag: '@Mariana Souza', detail: 'Squad Lead' },
    { id: 'diego', label: 'Diego Rocha', category: 'user', icon: 'DR', tag: '@Diego Rocha', detail: 'DevOps & Cloud' },
    // Docs (#)
    { id: 'doc-audit', label: 'AuditoriaContas2026', category: 'doc', icon: 'doc', tag: '#AuditoriaContas2026', detail: 'Relatório Fiscal e Faturas' },
    { id: 'doc-spec', label: 'EspecificacaoMestra_v3', category: 'doc', icon: 'doc', tag: '#EspecificacaoMestra_v3', detail: 'Norma de Engenharia PCL' },
    { id: 'doc-contract', label: 'MinutaContratoAlpha', category: 'doc', icon: 'doc', tag: '#MinutaContratoAlpha', detail: 'Contrato Comercial' }
  ];

  useEffect(() => {
    if (!text) {
      setPiiStatus(null);
      setMentionType(null);
      return;
    }
    const result = piiGuardService.sanitizePrompt(text);
    if (result.redactedFieldsCount > 0) {
      setPiiStatus(`🛡️ PII Guard Sanitizado (${result.detectedTypes.join(', ')})`);
    } else {
      setPiiStatus(null);
    }

    // Trigger detection for @ or #
    const cursor = textareaRef.current?.selectionStart || text.length;
    const textBeforeCursor = text.slice(0, cursor);
    const lastAt = textBeforeCursor.lastIndexOf('@');
    const lastHash = textBeforeCursor.lastIndexOf('#');

    const lastTriggerIndex = Math.max(lastAt, lastHash);
    if (lastTriggerIndex !== -1 && lastTriggerIndex >= textBeforeCursor.length - 15) {
      const char = textBeforeCursor[lastTriggerIndex];
      const query = textBeforeCursor.slice(lastTriggerIndex + 1);
      if (!query.includes(' ')) {
        setMentionType(char === '@' ? 'app_or_user' : 'doc');
        setMentionQuery(query.toLowerCase());
        setMentionPosition(lastTriggerIndex);
        return;
      }
    }
    setMentionType(null);
  }, [text]);

  const handleSelectMention = (option: MentionOption) => {
    if (mentionPosition === null) return;
    const before = text.slice(0, mentionPosition);
    const cursor = textareaRef.current?.selectionStart || text.length;
    const after = text.slice(cursor);
    const updated = `${before}${option.tag} ${after}`;
    setText(updated);
    setMentionType(null);
    setTimeout(() => textareaRef.current?.focus(), 50);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    const sanitized = piiGuardService.sanitizePrompt(text).sanitizedText;
    onSendMessage(sanitized, webSearchEnabled, selectedProfile.id);
    setText('');
    setPiiStatus(null);
    setMentionType(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !mentionType) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredMentions = MENTIONS_CATALOG.filter(m => {
    if (mentionType === 'app_or_user') {
      return (m.category === 'app' || m.category === 'user') && m.label.toLowerCase().includes(mentionQuery);
    }
    if (mentionType === 'doc') {
      return m.category === 'doc' && m.label.toLowerCase().includes(mentionQuery);
    }
    return false;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 select-none relative">
      {/* Floating Mention Autocomplete Popover (@ or #) - Fidelidade Estrita ao Benchmark Jumpad.ai */}
      {mentionType && filteredMentions.length > 0 && (
        <div className="absolute left-6 bottom-28 w-64 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-3 pt-1.5 pb-1 text-[11px] font-normal text-slate-400">
            {mentionType === 'app_or_user' ? 'Aplicativos' : 'Bases & Documentos'}
          </div>
          <div className="max-h-64 overflow-y-auto space-y-0.5 custom-scrollbar py-0.5">
            {filteredMentions.map(opt => (
              <button
                key={opt.id}
                onClick={() => handleSelectMention(opt)}
                className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100/70 dark:hover:bg-slate-800/80 flex items-center space-x-3 transition group"
              >
                {/* Official Vector Logo for Apps, Avatar for Users, Icon for Docs */}
                <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                  {opt.category === 'app' && opt.logoId ? (
                    renderOfficialLogo(opt.logoId, 'w-4 h-4 object-contain')
                  ) : opt.category === 'user' ? (
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-[9px] flex items-center justify-center">
                      {opt.icon}
                    </div>
                  ) : (
                    <FileText className="w-4 h-4 text-slate-400" />
                  )}
                </div>

                <span className="font-normal text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition truncate">
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Composer Box with Frosted Glass Effect */}
      <div className="rounded-2xl glass-panel border border-slate-300/70 dark:border-slate-800/80 shadow-sm p-3 space-y-2 focus-within:border-slate-400 dark:focus-within:border-slate-600 transition bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
        {/* PII Alert only when triggered */}
        {piiStatus && (
          <div className="flex items-center justify-between text-[11px] font-mono px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300">
            <span className="font-semibold flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              <span>{piiStatus}</span>
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400">Proteção Ativa</span>
          </div>
        )}

        {/* Text Area */}
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pergunte ao PCL AEOS ou use @ para sistemas corporativos e # para documentos..."
          rows={2}
          className="w-full bg-transparent text-slate-800 dark:text-slate-100 placeholder-slate-400 text-xs focus:outline-none resize-none custom-scrollbar"
        />

        {/* Bottom Bar: Attachments, Voice, Web Search, Tokens, Reasoning Level & Send */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {/* Left Controls: Popover [+], Voice Recorder & Web Search Toggle */}
          <div className="flex items-center space-x-1.5">
            <ContextPopover onSelectOption={opt => setText(prev => `${prev}\n[Contexto: ${opt}]`)} />
            <VoiceRecorderButton onTranscriptionComplete={txt => setText(prev => `${prev} ${txt}`.trim())} />

            {/* Web Search Toggle Button */}
            <button
              type="button"
              onClick={() => setWebSearchEnabled(!webSearchEnabled)}
              className={`px-2 py-1 rounded-lg border transition flex items-center space-x-1.5 text-xs ${
                webSearchEnabled 
                  ? 'bg-sky-50 dark:bg-sky-950/80 border-sky-400 text-sky-600 dark:text-sky-300 font-semibold shadow-xs' 
                  : 'bg-transparent border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title={webSearchEnabled ? 'Pesquisa Web Ativada (consultará a internet para trazer referências externas)' : 'Ativar Pesquisa Web na internet'}
            >
              <Globe className={`w-3.5 h-3.5 ${webSearchEnabled ? 'text-sky-500 animate-pulse' : 'text-slate-400'}`} />
              <span className={`text-[11px] ${webSearchEnabled ? 'text-sky-600 dark:text-sky-300' : 'text-slate-400'}`}>
                {webSearchEnabled ? 'Web Ativa' : 'Web'}
              </span>
            </button>
          </div>

          {/* Right Controls: Token Aqua Orb, Reasoning Selector & Send Button */}
          <div className="flex items-center space-x-2.5">
            {/* Esfera Tridimensional Aqua OS X */}
            <TokenAquaOrb usedTokens={usedTokens} maxTokens={maxTokens} />

            {/* PCL Cognitive Orchestration Console */}
            <div className="relative">
              <button
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition flex items-center space-x-1.5 shadow-xs"
                title="Console de Orquestração Cognitiva PCL AEOS"
              >
                <Zap className={`w-3.5 h-3.5 ${selectedProfile.iconColor}`} />
                <span className="font-semibold">{selectedProfile.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showModelMenu && (
                <div className="absolute right-0 bottom-9 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in duration-100">
                  {/* Cabeçalho do Console PCL */}
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                      <Cpu className="w-3 h-3 text-indigo-500" />
                      <span>Console de Orquestração PCL</span>
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                      SLA Ativo
                    </span>
                  </div>

                  {/* Perfis Cognitivos Oficiais PCL */}
                  <div className="space-y-1">
                    {COGNITIVE_PROFILES.map(prof => {
                      const isSelected = selectedProfile.id === prof.id;
                      return (
                        <button
                          key={prof.id}
                          onClick={() => {
                            setSelectedProfile(prof);
                            setShowModelMenu(false);
                          }}
                          className={`w-full text-left p-2.5 rounded-xl transition flex flex-col space-y-1 ${
                            isSelected
                              ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Zap className={`w-3.5 h-3.5 ${prof.iconColor}`} />
                              <span className="font-semibold text-xs text-slate-900 dark:text-white">{prof.name}</span>
                            </div>
                            {isSelected && (
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                            )}
                          </div>

                          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                            {prof.subtitle}
                          </span>

                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-2 pt-0.5">
                            {prof.description}
                          </p>

                          <div className="flex items-center space-x-2 pt-1 text-[9px] font-mono text-slate-400 dark:text-slate-500">
                            <span className="px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {prof.badge}
                            </span>
                            <span>• Lat: {prof.latency}</span>
                            <span>• Custo: {prof.cost}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className={`p-2 rounded-xl transition shadow-xs ${
                text.trim()
                  ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 hover:opacity-90'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
              title="Enviar Mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
