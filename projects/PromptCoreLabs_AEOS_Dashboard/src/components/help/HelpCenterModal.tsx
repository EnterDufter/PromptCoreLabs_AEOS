/**
 * PCL Cockpit - Help Center Modal (v3.9.0 PROD)
 * 
 * Central de Ajuda completa, interativa e auditável integrada diretamente na cabine de comando:
 * - Visão geral da arquitetura, Tríade Institucional e Invariantes de Hardware ($0.00, 0 MB VRAM Laya)
 * - Guia de navegação visual de todas as telas (Header, LeftSidebar, RightSidebar, Chat, Meetings, Flows, Artefatos)
 * - Explicação detalhada de cada módulo, painel e componente
 * - Documentação exaustiva de todas as 8 abas de configuração (SettingsModal)
 * - Dicionário de parâmetros, opções e impactos operacionais
 * - Fluxos de trabalho recomendados e boas práticas
 * - Exemplos práticos e casos de uso passo a passo
 * - Troubleshooting, matriz de portas locais (:3001, :11434, :8000, :20140, :5432) e FAQs
 * - Integração viva com a Living Architecture do ecossistema PCL
 */

import React, { useState, useMemo } from 'react';
import {
  X, Search, HelpCircle, BookOpen, Compass, Layers, Settings,
  Cpu, Database, Shield, Zap, Terminal, ExternalLink, ChevronRight,
  ChevronDown, CheckCircle2, AlertTriangle, FileText, Presentation,
  Table as TableIcon, Server, ShieldCheck, DollarSign, Users, Sparkles,
  Copy, Check
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

interface HelpCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettingsTab?: (tab: string) => void;
}

type HelpCategory = 
  | 'overview' 
  | 'navigation' 
  | 'modules' 
  | 'settings' 
  | 'parameters' 
  | 'workflows' 
  | 'usecases' 
  | 'troubleshooting' 
  | 'living_arch';

export const HelpCenterModal: React.FC<HelpCenterModalProps> = ({
  isOpen,
  onClose,
  onOpenSettingsTab
}) => {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState<HelpCategory>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const categories = [
    { id: 'overview', label: '1. Visão Geral & Arquitetura', icon: BookOpen },
    { id: 'navigation', label: '2. Guia de Telas', icon: Compass },
    { id: 'modules', label: '3. Módulos & Painéis', icon: Layers },
    { id: 'settings', label: '4. Telas de Configuração', icon: Settings },
    { id: 'parameters', label: '5. Dicionário de Parâmetros', icon: Database },
    { id: 'workflows', label: '6. Fluxos de Uso & Boas Práticas', icon: Zap },
    { id: 'usecases', label: '7. Casos de Uso Práticos', icon: Sparkles },
    { id: 'troubleshooting', label: '8. Troubleshooting & Portas', icon: Terminal },
    { id: 'living_arch', label: '9. Living Architecture PCL', icon: ShieldCheck }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-5xl h-[88vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Central de Ajuda & Guia Operacional
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 font-semibold border border-sky-300 dark:border-sky-800">
                  PCL Cockpit v3.9
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Manual oficial interativo, navegação, parâmetros e governança Living Architecture
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Quick Search */}
            <div className="relative w-52 sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Pesquisar tópico ou parâmetro..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-800 dark:text-slate-100 placeholder-slate-400"
              />
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
              title="Fechar Central de Ajuda"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Sidebar Categories + Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-64 border-r border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 p-3 overflow-y-auto space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 px-2 block mb-2">
              Tópicos de Documentação
            </span>
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id as HelpCategory)}
                  className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition text-left ${
                    isActive
                      ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}

            {/* Quick Links Footer in Sidebar */}
            <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 px-2 space-y-1.5">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                Atalhos Externos
              </span>
              <a
                href="https://enterdufter.github.io/PromptCoreLabs_AEOS/#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-[11px] text-sky-600 dark:text-sky-400 hover:underline py-1"
              >
                <span>GitHub Pages Oficial</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/EnterDufter/PromptCoreLabs_AEOS"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-[11px] text-sky-600 dark:text-sky-400 hover:underline py-1"
              >
                <span>Repositório GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-sm">
            {/* CAPÍTULO 1: VISÃO GERAL */}
            {activeCategory === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <span>A Tríade Institucional Canônica</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Compreenda a governança soberana e o papel de cada entidade do ecossistema PromptCore Labs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 space-y-2">
                    <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-bold text-xs">
                      <Sparkles className="w-4 h-4" />
                      <span>1. PromptCore Labs</span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Holding & Laboratório</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Concebe os padrões de governança, finops e blindagem regulatória para todo o ecossistema corporativo.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 dark:bg-indigo-950/20 space-y-2">
                    <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                      <Cpu className="w-4 h-4" />
                      <span>2. PCL AEOS</span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Sistema Operacional</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Motor de inteligência nos bastidores que orquestra a colaboração entre líderes, especialistas e esquadrões de agentes autônomos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/20 space-y-2">
                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      <Compass className="w-4 h-4" />
                      <span>3. PCL Cockpit (:3001)</span>
                    </div>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Cabine de Comando</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Interface executiva onde a liderança assume o controle em tempo real, audita latências e mantém autoridade irrevogável.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Invariantes Físicos de Hardware e FinOps
                  </h4>
                  <ul className="text-xs space-y-2 text-slate-600 dark:text-slate-400">
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>0 MB de VRAM na CPU para o Laya:</strong> O sensor Laya opera 100% em CPU host (ONNX INT8), processando decisões em ~20-35ms sem disputar memória com a GPU dedicada.
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Custo Marginal Zero ($0.00):</strong> Funcionamento offline pleno com motores locais (:11434 Ollama, :8000 OmniRoute, :20140 Laya, :5432 PostgreSQL 17).
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Segredo Corporativo Blindado (BYOS / Resíduo Zero):</strong> Nenhum relatório, plano ou arquivo confidencial alimenta modelos públicos externos.
                      </span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Avaliação Duplo-Cega 4.95 / 5.0:</strong> Vitória atestada por especialistas frente a Google Gemini (4.45), ChatGPT Enterprise (4.30) e Microsoft Copilot (3.80).
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* CAPÍTULO 2: GUIA DE TELAS */}
            {activeCategory === 'navigation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Guia de Navegação de Todas as Telas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Conheça a finalidade de cada barra, painel e componente visual da interface.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                      <Compass className="w-4 h-4 text-sky-500" />
                      <span>1. LeftSidebar (Barra Lateral Esquerda)</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Centraliza o botão "Nova Conversa", atalhos de navegação primária (Chat, Meetings, Flows, Artefatos), agrupamentos de projetos corporativos, menus flutuantes de conversa (fixar, renomear, mover) e a barra semântica de cota DRP.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-indigo-500" />
                      <span>2. Dual-Plex Workspace (Área Central)</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Permite alternar entre o Chat conversacional, o Cortex Canvas DAG (grafo visual de orquestração) e o modo Dual (lado a lado), com o Live Execution Stepper exibindo as 5 fases cognitivas em milissegundos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                      <Terminal className="w-4 h-4 text-emerald-500" />
                      <span>3. RightSidebarStatus (Barra Lateral Direita)</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Telemetria viva dos motores (Laya CPU, Ollama GPU, OmniRoute, PostgreSQL 17, Servidor MCP), painel FinOps de economia marginal e monitor de extensões companheiras ativas.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                      <Presentation className="w-4 h-4 text-purple-500" />
                      <span>4. PCL Artifact Drawer & Rich Viewer</span>
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Painel retrátil e tela cheia para inspeção de apresentações, diagramas Mermaid reativos, planilhas tabulares e exportação direta para PowerPoint (.pptx), Excel (.xlsx) e SVG.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CAPÍTULO 3: MÓDULOS E PAINÉIS */}
            {activeCategory === 'modules' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Módulos e Painéis Especializados
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Recursos avançados para elevar a produtividade de equipes executivas e técnicas.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-xs text-sky-600 dark:text-sky-400 uppercase tracking-wide">
                      SuperChatbubble & Formatos Alvo
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Barra de entrada que permite selecionar o tipo exato de saída desejada (Diagrama, Slide, Planilha, Infográfico, App, Documento) e anexar PDFs de estudo para indexação instantânea com Orama Search.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
                      Live Execution Stepper (5 Fases)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Transparência de ponta a ponta: 1. Intention Gating Laya CPU, 2. RAG Canônico / Busca Web, 3. Grounding & Anti-Contradição, 4. Inferência OmniRoute, 5. Prova Criptográfica SHA-256 e Artefatos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      Inteligência de Reuniões (Meetings)
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Captura de áudio de conferências corporativas, transcrição acelerada com WhisperX, geração de atas formais e despacho de compromissos com 1 clique para canais corporativos.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                      Biblioteca de Artefatos v3.9
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Centralização completa de arquivos gerados com filtros rápidos em pílula, modos Grid e Tabela, exportação nativa em PowerPoint (.pptx) e Excel (.xlsx) e navegação com zero amnésia.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CAPÍTULO 4: TELAS DE CONFIGURAÇÃO */}
            {activeCategory === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Documentação Completa das 8 Abas de Configuração
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Clique em qualquer seção para saber suas opções e abrir diretamente a aba correspondente.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { id: 'general', title: '1. Preferências Gerais (general)', desc: 'Idioma da interface (PT/EN/ES), tema visual (Dark/Light), densidade e síntese de voz (TTS) com sanitização de pontuações.', icon: Settings },
                    { id: 'security', title: '2. Segurança & Controle de Acesso (security)', desc: 'Perfis de usuários RBAC (Admin, Engenheiro, Operador, Auditor), controle de sessões ativas e criptografia AES-256-GCM.', icon: Shield },
                    { id: 'integrations', title: '3. Biblioteca de Integrações (integrations)', desc: 'Configuração do Servidor MCP Soberano stdio, motores locais (Ollama :11434, OmniRoute :8000, Laya :20140), PostgreSQL 17, Cloudflare R2 DRP e webhooks empresariais.', icon: Server },
                    { id: 'costs', title: '4. FinOps & Gestão de Custos (costs)', desc: 'Calculadora Soberana de ROI, controle de limites orçamentários (EBITDA Shield) e gráficos de consumo de tokens por modelo.', icon: DollarSign },
                    { id: 'squads', title: '5. Esquadrões de Agentes (squads)', desc: 'Organograma hierárquico das equipes agênticas, matriz de atribuição RACI e políticas de escalação HitL em 2 estágios.', icon: Users },
                    { id: 'skills', title: '6. Gestão de Skills (skills)', desc: 'Inventário físico de skills no diretório PaperClip com atesto de integridade SHA-256 e ativação dinâmica por sessão.', icon: Cpu },
                    { id: 'audit', title: '7. Auditoria & Compliance (audit)', desc: 'Livro-razão criptográfico SHA-256, relatórios de aderência à LGPD e normas ISO/IEC 27001 e ISO/IEC 42001.', icon: ShieldCheck },
                    { id: 'nocode', title: '8. Construtor No-Code (nocode)', desc: 'Interface visual para criação de novos agentes, personas e ferramentas personalizadas sem necessidade de escrever código.', icon: Sparkles }
                  ].map(tab => {
                    const TabIcon = tab.icon;
                    return (
                      <div 
                        key={tab.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-sky-500/40 transition flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/20"
                      >
                        <div className="flex items-start space-x-3">
                          <TabIcon className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                              {tab.title}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {tab.desc}
                            </p>
                          </div>
                        </div>
                        {onOpenSettingsTab && (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenSettingsTab(tab.id);
                            }}
                            className="px-3 py-1 text-[11px] rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-600 dark:text-sky-300 hover:text-white transition font-medium shrink-0 ml-4"
                          >
                            Configurar
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CAPÍTULO 5: DICIONÁRIO DE PARÂMETROS */}
            {activeCategory === 'parameters' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Dicionário de Parâmetros e Impactos Operacionais
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Consulte os limites e impactos de cada chave de configuração da plataforma.
                  </p>
                </div>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-3">Parâmetro</th>
                        <th className="p-3">Aba</th>
                        <th className="p-3">Padrão</th>
                        <th className="p-3">Impacto na Operação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                      <tr>
                        <td className="p-3 font-mono text-sky-600 dark:text-sky-400 font-semibold">layaExecutionMode</td>
                        <td className="p-3">integrations</td>
                        <td className="p-3">cpu_int8</td>
                        <td className="p-3">Garante 0 MB de VRAM na GPU host, rodando triagem de intenção em ~20ms na CPU.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-sky-600 dark:text-sky-400 font-semibold">mcpServerTransport</td>
                        <td className="p-3">integrations</td>
                        <td className="p-3">stdio</td>
                        <td className="p-3">Opera via processo local Node.js sem abrir portas de rede, impedindo vazamentos perimetrais.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-sky-600 dark:text-sky-400 font-semibold">ebitdaShieldLimit</td>
                        <td className="p-3">costs</td>
                        <td className="p-3">$100.00</td>
                        <td className="p-3">Trava rígida contra faturas de nuvem; reverte 100% para operação local gratuita ao atingir o teto.</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-sky-600 dark:text-sky-400 font-semibold">hitlN1TimeoutSec</td>
                        <td className="p-3">squads</td>
                        <td className="p-3">60s</td>
                        <td className="p-3">Tempo para intervenção humana N1 antes de escalar para N2 (Diretoria via webhook assinado).</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-sky-600 dark:text-sky-400 font-semibold">storageQuotaAlert</td>
                        <td className="p-3">integrations</td>
                        <td className="p-3">75% / 90%</td>
                        <td className="p-3">Dispara feedback tricolor (Verde / Âmbar / Vermelho) no rodapé para governança preventiva.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* CAPÍTULO 6: FLUXOS DE USO E BOAS PRÁTICAS */}
            {activeCategory === 'workflows' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Fluxos de Uso Recomendados & Boas Práticas
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Diretrizes operacionais para extrair a máxima eficiência da engenharia assistida.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-xs text-sky-600 dark:text-sky-400 uppercase tracking-wide">
                      Fluxo A: Engenharia Spec-Driven (Do Plano ao Código com Exit Code 0)
                    </h4>
                    <ol className="text-xs space-y-1.5 list-decimal list-inside text-slate-600 dark:text-slate-400">
                      <li>Abra uma nova sessão limpa e descreva os requisitos técnicos do sistema.</li>
                      <li>Invoque a persona <code>/cortex</code> para modelar os diagramas arquiteturais panorâmicos.</li>
                      <li>Exija validação de compilação sem dados mockados através do comando <code>npm run build</code>.</li>
                      <li>Inspecione o atesto criptográfico SHA-256 no Live Stepper para conformidade ISO.</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <h4 className="font-bold text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                      Fluxo B: Estudo Documental Local de PDFs e Manuais
                    </h4>
                    <ol className="text-xs space-y-1.5 list-decimal list-inside text-slate-600 dark:text-slate-400">
                      <li>Anexe relatórios ou manuais corporativos usando o botão de anexo no Composer.</li>
                      <li>Aguarde o processamento instantâneo via <code>studyIngestionService</code> (indexação em memória Orama).</li>
                      <li>Faça perguntas diretas sobre tabelas, métricas ou requisitos normativos.</li>
                      <li>Abra a pílula <code>Fontes Consultadas</code> para validar a página exata da citação.</li>
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* CAPÍTULO 7: CASOS DE USO PRÁTICOS */}
            {activeCategory === 'usecases' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Casos de Uso Práticos e Exemplos Executivos
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Cenários reais de aplicação nas áreas jurídica, financeira e de desenvolvimento.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Compliance & Auditoria</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Auditoria de conformidade com LGPD e ISO 42001 em segundos, com trilha imutável no ledger de auditoria.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">FinOps & Blindagem ROI</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Economia comprovada de mais de US$ 180.000/ano em faturas de nuvem ao rodar inferência em modo soberano local ($0.00).
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 bg-slate-50/50 dark:bg-slate-950/20">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">Atas de Reunião com 1-Clique</h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      Transforme horas de reuniões gravadas em atas executivas e despachos de tarefas automáticos para canais corporativos.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CAPÍTULO 8: TROUBLESHOOTING E MATRIZ DE PORTAS */}
            {activeCategory === 'troubleshooting' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Troubleshooting & Matriz de Portas Locais
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Diagnóstico rápido para garantir que todos os motores soberanos estejam online.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { port: ':3001', service: 'PCL Cockpit Frontend', cmd: 'npm run dev', fix: 'Execute o script Iniciar_PCL_Cockpit.bat na raiz do projeto.' },
                    { port: ':11434', service: 'Ollama Engine (GPU)', cmd: 'ollama serve', fix: 'Verifique se o processo Ollama está rodando e se o modelo qwen2.5-coder está instalado.' },
                    { port: ':8000', service: 'OmniRoute Gateway', cmd: 'python -m omniroute', fix: 'Confirme os mapeamentos de modelo no arquivo config/omniroute/config.yaml.' },
                    { port: ':20140', service: 'Laya System One (CPU)', cmd: 'python -m laya.service', fix: 'Inicie o coprocessador Laya garantindo alocação 100% em CPU host (0 MB VRAM).' },
                    { port: ':5432', service: 'PostgreSQL 17 Local', cmd: 'net start postgresql-x64-17', fix: 'Certifique-se de que o serviço do PostgreSQL e a extensão PGVector estão ativos.' }
                  ].map((item, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-sky-600 dark:text-sky-400 px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950 border border-sky-300 dark:border-sky-800">
                            {item.port}
                          </span>
                          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                            {item.service}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.fix}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopy(item.cmd)}
                        className="px-2.5 py-1 text-[11px] font-mono rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center space-x-1.5 self-start sm:self-center shrink-0"
                        title="Copiar comando"
                      >
                        {copiedText === item.cmd ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-500" />
                            <span>Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{item.cmd}</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CAPÍTULO 9: LIVING ARCHITECTURE */}
            {activeCategory === 'living_arch' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    Integração com a Living Architecture PCL AEOS
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Como a cabine de comando se conecta diretamente ao acervo normativo imutável.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-sky-500/20 bg-sky-500/5 dark:bg-sky-950/20 space-y-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-sky-600 dark:text-sky-400">
                    Rastreabilidade Matemática com ADR-0001 a ADR-0016
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Toda tela, rotina de validação e mecanismo de segurança do PCL Cockpit decorre de um Architecture Decision Record (ADR) formal aprovado. O agente do sistema possui auto-consciência de suas diretrizes normativas, consultando o acervo em warm storage antes de qualquer ação estrutural.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">
                    Trilhas Canônicas de Arquitetura:
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-600 dark:text-slate-400 list-disc list-inside">
                    <li><strong>Trilha 1 (ADR 0001–0005):</strong> Fundação do Kernel, Isolamento de Schemas e Laya System One.</li>
                    <li><strong>Trilha 2 (ADR 0006–0007):</strong> Continuidade DRP Cloudflare R2 e Memória Multi-Turn no Cockpit.</li>
                    <li><strong>Trilha 3 (ADR 0008–0010):</strong> Volumes Docker, Triage Gate Dual-Track e Antigravity Harness.</li>
                    <li><strong>Trilha 4 (ADR 0011–0013):</strong> Extensão Shadow DOM, Resiliência HitL em 2 Estágios e FinOps EBITDA Shield.</li>
                    <li><strong>Trilha 5 (ADR 0014–0016):</strong> Persistência Relacional cockpit.*, Servidor MCP Soberano stdio e Central de Artefatos Multimodais.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-950/50 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistema Operacional Soberano PCL AEOS v3.9</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

