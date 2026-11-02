import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Send, Cpu, ChevronDown, ShieldCheck, Zap, Database, 
  FileText, Check, ChevronRight, User, Sparkles, Globe,
  Brain, Terminal, Lock, Sliders, ExternalLink
} from 'lucide-react';
import { ContextPopover } from './ContextPopover';
import { VoiceRecorderButton } from './VoiceRecorderButton';
import { TokenAquaOrb } from './TokenAquaOrb';
import { piiGuardService } from '../../services/security/piiGuardService';
import { OMNIROUTE_MODELS, ModelOption } from '../../services/llm/omniRouteService';
import { renderOfficialLogo } from '../common/AppOfficialLogos';
import { useI18n } from '../../i18n/I18nContext';

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
  iconType: 'sparkles' | 'zap' | 'brain' | 'shield' | 'terminal';
  iconColor: string;
  badge: string;
  cost: string;
  latency: string;
  defaultModelId: string;
}

export interface AIModelDetails {
  id: string;
  name: string;
  providerName: string;
  logoId: string;
  badge: string;
  latency: string;
  cost: string;
  sovereignty: 'local' | 'cloud' | 'hybrid';
}

export const OFFICIAL_AI_MODELS: AIModelDetails[] = [
  {
    id: 'gemini-3-6-flash',
    name: 'Gemini 3.5 / 3.6 Flash',
    providerName: 'Google Cloud AI Studio',
    logoId: 'gemini',
    badge: 'Frontier Rápido',
    latency: '~350ms',
    cost: '$0.0003/1k',
    sovereignty: 'cloud'
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    providerName: 'Anthropic Frontier',
    logoId: 'claude',
    badge: 'Raciocínio & Código',
    latency: '~1.2s',
    cost: '$0.003/1k',
    sovereignty: 'cloud'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o Omnimodal',
    providerName: 'OpenAI Enterprise',
    logoId: 'openai',
    badge: 'Multimodal',
    latency: '~900ms',
    cost: '$0.0025/1k',
    sovereignty: 'cloud'
  },
  {
    id: 'qwen-2-5-coder-7b',
    name: 'Qwen 2.5 Coder 7B INT8',
    providerName: 'Ollama Local :11434',
    logoId: 'qwen',
    badge: 'Soberano $0.00',
    latency: '~800ms',
    cost: '$0.00',
    sovereignty: 'local'
  },
  {
    id: 'laya-coprocessor-sys1',
    name: 'Laya Coprocessor System 1',
    providerName: 'Host CPU INT8 :20140',
    logoId: 'laya',
    badge: '0 MB VRAM',
    latency: '22ms',
    cost: '$0.00',
    sovereignty: 'local'
  }
];

export const COGNITIVE_PROFILES: CognitiveProfile[] = [
  {
    id: 'omniroute-auto',
    name: 'Roteamento Autônomo OmniRoute',
    subtitle: 'Auto Engine • Balanceamento SLA',
    description: 'Seleção dinâmica por intenção, restrição orçamentária e sensibilidade PII.',
    iconType: 'sparkles',
    iconColor: 'text-indigo-500',
    badge: 'Autônomo',
    cost: 'Otimizado',
    latency: 'Dinâmica',
    defaultModelId: 'gemini-3-6-flash'
  },
  {
    id: 'sintese-executiva',
    name: 'Síntese Executiva',
    subtitle: 'Cloud Frontier • Gemini 3.5/3.6 Flash',
    description: 'Respostas ágeis, resumos executivos e síntese de negócios.',
    iconType: 'zap',
    iconColor: 'text-sky-500',
    badge: 'Alta Velocidade',
    cost: '$0.0003/k',
    latency: '~350ms',
    defaultModelId: 'gemini-3-6-flash'
  },
  {
    id: 'raciocinio-profundo',
    name: 'Raciocínio Profundo',
    subtitle: 'Frontier Reasoning • Claude 3.5 / GPT-4o',
    description: 'Arquitetura de sistemas, raciocínio lógico avançado e análise estratégica.',
    iconType: 'brain',
    iconColor: 'text-purple-500',
    badge: 'Complexidade Alta',
    cost: '$0.003/k',
    latency: '~1.2s',
    defaultModelId: 'claude-3-5-sonnet'
  },
  {
    id: 'soberano-local',
    name: 'Soberano Local $0.00',
    subtitle: 'Local Enclave • CPU INT8 Laya + Ollama',
    description: 'Enclave 100% on-premise com zero saída de dados e custo zero por token.',
    iconType: 'shield',
    iconColor: 'text-emerald-500',
    badge: '0 MB VRAM (CPU)',
    cost: '$0.00',
    latency: '~22ms / ~800ms',
    defaultModelId: 'qwen-2-5-coder-7b'
  },
  {
    id: 'coding-specialist',
    name: 'Especialista em Código',
    subtitle: 'Code Engine • Qwen Coder + Claude',
    description: 'Desenvolvimento fullstack, depuração de erros e geração de código de alta precisão.',
    iconType: 'terminal',
    iconColor: 'text-amber-500',
    badge: 'Exit Code 0',
    cost: '$0.00 / Baixo',
    latency: '~650ms',
    defaultModelId: 'qwen-2-5-coder-7b'
  }
];

export const SuperChatbubble: React.FC<SuperChatbubbleProps> = ({
  onSendMessage,
  usedTokens = 14200,
  maxTokens = 128000
}) => {
  const { t } = useI18n();
  const [text, setText] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<CognitiveProfile>(COGNITIVE_PROFILES[0]); // Síntese Executiva por padrão
  const [selectedSpecificModel, setSelectedSpecificModel] = useState<AIModelDetails | null>(null);
  const [consoleTab, setConsoleTab] = useState<'profiles' | 'models'>('profiles');
  const [showModelMenu, setShowModelMenu] = useState(false);
  const [piiStatus, setPiiStatus] = useState<string | null>(null);
  const [webSearchEnabled, setWebSearchEnabled] = useState(false);

  // Mention system state (@ or #)
  const [mentionType, setMentionType] = useState<'app_or_user' | 'doc' | null>(null);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const modelMenuButtonRef = useRef<HTMLButtonElement>(null);
  const modelMenuRef = useRef<HTMLDivElement>(null);

  // Renderizador dinâmico de ícones geométricos distintos para cada perfil cognitivo
  const renderProfileIcon = (type: string, colorClass: string, size = 'w-3.5 h-3.5') => {
    switch (type) {
      case 'sparkles':
        return <Sparkles className={`${size} ${colorClass}`} />;
      case 'zap':
        return <Zap className={`${size} ${colorClass}`} />;
      case 'brain':
        return <Brain className={`${size} ${colorClass}`} />;
      case 'shield':
        return <ShieldCheck className={`${size} ${colorClass}`} />;
      case 'terminal':
        return <Terminal className={`${size} ${colorClass}`} />;
      default:
        return <Zap className={`${size} ${colorClass}`} />;
    }
  };

  // Fechar o menu de orquestração ao clicar fora ou pressionar Escape
  useEffect(() => {
    if (!showModelMenu) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        modelMenuRef.current && 
        !modelMenuRef.current.contains(target) &&
        modelMenuButtonRef.current &&
        !modelMenuButtonRef.current.contains(target)
      ) {
        setShowModelMenu(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowModelMenu(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModelMenu]);

  // Cálculo da posição do Portal flutuante (Bottom-Right ancorado ao botão sem sofrer cortes de contêineres)
  const getModelMenuPortalStyle = (): React.CSSProperties => {
    if (!modelMenuButtonRef.current) return { display: 'none' };
    const rect = modelMenuButtonRef.current.getBoundingClientRect();
    return {
      position: 'fixed',
      bottom: `${window.innerHeight - rect.top + 8}px`,
      right: `${Math.max(16, window.innerWidth - rect.right)}px`,
      zIndex: 9999,
    };
  };

  const MENTIONS_CATALOG: MentionOption[] = [
    // Conectores de Aplicativos Corporativos com logos oficiais
    { id: 'bigquery', label: 'Google BigQuery', category: 'app', logoId: 'bigquery', tag: '@BigQuery', detail: 'Data Warehouse & SQL' },
    { id: 'sap', label: 'SAP Enterprise', category: 'app', logoId: 'sap', tag: '@SAP', detail: 'ERP & Finanças' },
    { id: 'sheets', label: 'Google Sheets', category: 'app', logoId: 'sheets', tag: '@GoogleSheets', detail: 'Planilhas & Dados' },
    { id: 'hubspot', label: 'HubSpot', category: 'app', logoId: 'hubspot', tag: '@HubSpot', detail: 'CRM & Marketing' },
    { id: 'salesforce', label: 'Salesforce', category: 'app', logoId: 'salesforce', tag: '@Salesforce', detail: 'Vendas & Clientes' },
    { id: 'pipedrive', label: 'Pipedrive', category: 'app', logoId: 'pipedrive', tag: '@Pipedrive', detail: 'Pipeline Comercial' },
    { id: 'rdstation', label: 'RD Station', category: 'app', logoId: 'rdstation', tag: '@RDStation', detail: 'Automação Inbound' },
    { id: 'jira', label: 'Jira Software', category: 'app', logoId: 'jira', tag: '@Jira', detail: 'Backlog & Sprints' },
    { id: 'gmail', label: 'Gmail', category: 'app', logoId: 'gmail', tag: '@Gmail', detail: 'Mensagens & E-mails' },
    { id: 'calendar', label: 'Google Agenda', category: 'app', logoId: 'calendar', tag: '@GoogleAgenda', detail: 'Reuniões & Horários' },
    // Especialistas & Líderes de Squad
    { id: 'juliana', label: 'Juliana Castro', category: 'user', icon: 'JC', tag: '@Juliana Castro', detail: 'Treasury & Finanças' },
    { id: 'mariana', label: 'Mariana Souza', category: 'user', icon: 'MS', tag: '@Mariana Souza', detail: 'Squad Lead de Operações' },
    { id: 'diego', label: 'Diego Rocha', category: 'user', icon: 'DR', tag: '@Diego Rocha', detail: 'DevOps, SRE & Cloud' },
    // Acervo & Documentos Canônicos (#)
    { id: 'doc-audit', label: 'AuditoriaContas2026', category: 'doc', icon: 'doc', tag: '#AuditoriaContas2026', detail: 'Relatório Fiscal e Faturas' },
    { id: 'doc-spec', label: 'EspecificacaoMestra_v3', category: 'doc', icon: 'doc', tag: '#EspecificacaoMestra_v3', detail: 'Norma de Engenharia PCL AEOS' },
    { id: 'doc-contract', label: 'MinutaContratoAlpha', category: 'doc', icon: 'doc', tag: '#MinutaContratoAlpha', detail: 'Minuta Comercial Blindada' }
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

  const filteredAppMentions = MENTIONS_CATALOG.filter(m => 
    m.category === 'app' && m.label.toLowerCase().includes(mentionQuery)
  );
  const filteredUserMentions = MENTIONS_CATALOG.filter(m => 
    m.category === 'user' && m.label.toLowerCase().includes(mentionQuery)
  );
  const filteredDocMentions = MENTIONS_CATALOG.filter(m => 
    m.category === 'doc' && m.label.toLowerCase().includes(mentionQuery)
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2 select-none relative">
      {/* Floating Mention Autocomplete Popover (@ ou #) com Categorização Rica */}
      {mentionType && (
        <div className="absolute left-6 bottom-28 w-80 max-w-[calc(100vw-32px)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150">
          <div className="px-3 pt-1.5 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>{mentionType === 'app_or_user' ? 'Mencionar Sistemas & Pessoas' : 'Acervo & Documentos'}</span>
            <span className="text-[9px] font-mono text-slate-400">PCL AEOS</span>
          </div>

          <div className="max-h-72 overflow-y-auto space-y-2 custom-scrollbar p-1">
            {mentionType === 'app_or_user' && (
              <>
                {/* Seção 1: Sistemas & Conectores MCP */}
                {filteredAppMentions.length > 0 && (
                  <div>
                    <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 px-2 block mb-1">
                      Sistemas Corporativos & Conectores MCP
                    </span>
                    <div className="space-y-0.5">
                      {filteredAppMentions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectMention(opt)}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition group"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                              {opt.logoId && renderOfficialLogo(opt.logoId, 'w-4 h-4 object-contain')}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition truncate block">
                                {opt.label}
                              </span>
                              {opt.detail && (
                                <span className="text-[10px] text-slate-400 truncate block">
                                  {opt.detail}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40">
                            {opt.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Seção 2: Especialistas & Líderes */}
                {filteredUserMentions.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1.5">
                    <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 px-2 block mb-1">
                      Especialistas & Líderes de Squad
                    </span>
                    <div className="space-y-0.5">
                      {filteredUserMentions.map(opt => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectMention(opt)}
                          className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition group"
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[9px] flex items-center justify-center flex-shrink-0">
                              {opt.icon}
                            </div>
                            <div className="min-w-0">
                              <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition truncate block">
                                {opt.label}
                              </span>
                              {opt.detail && (
                                <span className="text-[10px] text-slate-400 truncate block">
                                  {opt.detail}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className="font-mono text-[10px] text-sky-600 dark:text-sky-400 font-semibold px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40">
                            {opt.tag}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}

            {mentionType === 'doc' && filteredDocMentions.length > 0 && (
              <div>
                <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 px-2 block mb-1">
                  Acervo & Documentos Canônicos
                </span>
                <div className="space-y-0.5">
                  {filteredDocMentions.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectMention(opt)}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-5 h-5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 group-hover:text-slate-950 dark:group-hover:text-white transition truncate block">
                            {opt.label}
                          </span>
                          {opt.detail && (
                            <span className="text-[10px] text-slate-400 truncate block">
                              {opt.detail}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="font-mono text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40">
                        {opt.tag}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
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
          placeholder={t.composer.placeholder}
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

            {/* PCL Cognitive Orchestration Console - 2 Camadas (Perfis de Negócio vs. Provedores com Logos) */}
            <div className="relative">
              <button
                ref={modelMenuButtonRef}
                onClick={() => setShowModelMenu(!showModelMenu)}
                className="px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-[11px] font-medium text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition flex items-center space-x-1.5 shadow-xs"
                title="Console de Orquestração Cognitiva PCL AEOS"
              >
                {selectedSpecificModel ? (
                  <div className="w-3.5 h-3.5 flex items-center justify-center">
                    {renderOfficialLogo(selectedSpecificModel.logoId, 'w-3.5 h-3.5 object-contain')}
                  </div>
                ) : (
                  renderProfileIcon(selectedProfile.iconType, selectedProfile.iconColor)
                )}
                <span className="font-semibold truncate max-w-[130px]">
                  {selectedSpecificModel ? selectedSpecificModel.name : selectedProfile.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showModelMenu && createPortal(
                <div
                  ref={modelMenuRef}
                  style={getModelMenuPortalStyle()}
                  className="w-88 max-w-[calc(100vw-32px)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2.5 text-xs animate-in fade-in duration-100"
                >
                  {/* Cabeçalho do Console PCL */}
                  <div className="px-2.5 py-1.5 border-b border-slate-100 dark:border-slate-800 mb-2 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center space-x-1.5">
                      <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Console de Orquestração Cognitiva</span>
                    </span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 font-semibold">
                      SLA Ativo
                    </span>
                  </div>

                  {/* Switcher de 2 Camadas: Perfis Cognitivos vs. Modelos Específicos */}
                  <div className="flex border border-slate-200 dark:border-slate-800 p-0.5 mb-2 space-x-1 bg-slate-100/70 dark:bg-slate-950/70 rounded-xl">
                    <button
                      onClick={() => setConsoleTab('profiles')}
                      className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-semibold transition flex items-center justify-center space-x-1 ${
                        consoleTab === 'profiles'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Cpu className="w-3 h-3 text-indigo-500" />
                      <span>Perfis de Negócio ({COGNITIVE_PROFILES.length})</span>
                    </button>
                    <button
                      onClick={() => setConsoleTab('models')}
                      className={`flex-1 py-1 px-2 rounded-lg text-[10.5px] font-semibold transition flex items-center justify-center space-x-1 ${
                        consoleTab === 'models'
                          ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-2xs font-bold'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Sliders className="w-3 h-3 text-sky-500" />
                      <span>Provedores Oficiais ({OFFICIAL_AI_MODELS.length})</span>
                    </button>
                  </div>

                  {/* Camada 1: Perfis Cognitivos de Negócio */}
                  {consoleTab === 'profiles' && (
                    <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar p-0.5">
                      {COGNITIVE_PROFILES.map(prof => {
                        const isSelected = selectedProfile.id === prof.id && !selectedSpecificModel;
                        return (
                          <button
                            key={prof.id}
                            onClick={() => {
                              setSelectedProfile(prof);
                              setSelectedSpecificModel(null);
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
                                <div className="p-1 rounded-md bg-white dark:bg-slate-900 shadow-2xs border border-slate-200/60 dark:border-slate-800">
                                  {renderProfileIcon(prof.iconType, prof.iconColor)}
                                </div>
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
                              <span className="px-1.5 py-0.2 rounded bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                                {prof.badge}
                              </span>
                              <span>• Lat: {prof.latency}</span>
                              <span>• Custo: {prof.cost}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Camada 2: Provedores & Modelos com Logos Oficiais (Google, Claude, OpenAI, Qwen, Ollama, Laya) */}
                  {consoleTab === 'models' && (
                    <div className="space-y-1 max-h-72 overflow-y-auto custom-scrollbar p-0.5">
                      {OFFICIAL_AI_MODELS.map(model => {
                        const isSelected = selectedSpecificModel?.id === model.id;
                        return (
                          <button
                            key={model.id}
                            onClick={() => {
                              setSelectedSpecificModel(model);
                              // Sincronizar com perfil representativo
                              const matchingProfile = COGNITIVE_PROFILES.find(p => p.defaultModelId === model.id) || selectedProfile;
                              setSelectedProfile(matchingProfile);
                              setShowModelMenu(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl transition flex flex-col space-y-1.5 ${
                              isSelected
                                ? 'bg-slate-100 dark:bg-slate-800/90 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-xs'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2.5 min-w-0">
                                <div className="w-5 h-5 flex items-center justify-center p-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex-shrink-0 shadow-2xs">
                                  {renderOfficialLogo(model.logoId, 'w-3.5 h-3.5 object-contain')}
                                </div>
                                <div className="min-w-0">
                                  <span className="font-bold text-xs text-slate-900 dark:text-white block truncate">
                                    {model.name}
                                  </span>
                                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">
                                    {model.providerName}
                                  </span>
                                </div>
                              </div>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 ml-2" />
                              )}
                            </div>

                            <div className="flex items-center justify-between pt-1 text-[9px] font-mono text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800/80">
                              <span className={`px-1.5 py-0.2 rounded font-semibold ${
                                model.sovereignty === 'local'
                                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300'
                              }`}>
                                {model.badge}
                              </span>
                              <div className="space-x-2">
                                <span>Lat: {model.latency}</span>
                                <span>• Custo: {model.cost}</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>,
                document.body
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
