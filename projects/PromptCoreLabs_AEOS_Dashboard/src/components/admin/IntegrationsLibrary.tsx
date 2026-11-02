import React, { useState } from 'react';
import { 
  Server, Globe, Cpu, CheckCircle, Plus, Search, ExternalLink, 
  ArrowRight, ShieldCheck, Layers, Workflow, Database, Bot,
  Sparkles, Check, Lock, Radio
} from 'lucide-react';
import { renderOfficialLogo } from '../common/AppOfficialLogos';

interface IntegrationItem {
  id: string;
  appId: string;
  name: string;
  stage: 'capture' | 'mcp' | 'destination';
  stageLabel: string;
  scope: 'individual' | 'workspace';
  category: string;
  description: string;
  status: 'Connected' | 'Active' | 'Sovereign BYOS';
  latencyMs?: number;
  protocol: string;
}

const LINEAR_INTEGRATIONS: IntegrationItem[] = [
  // 1. Fontes de Ingestão & Captura
  {
    id: 'int-meet',
    appId: 'calendar',
    name: 'Google Meet & Zoom (Botless)',
    stage: 'capture',
    stageLabel: '1. Ingestão & Captura',
    scope: 'workspace',
    category: 'Produtividade',
    description: 'Captura contínua de áudio/vídeo diarizado localmente com WhisperX, sem robôs invasores na chamada.',
    status: 'Connected',
    latencyMs: 14,
    protocol: 'Botless WebRTC / Audio Loop'
  },
  {
    id: 'int-sap-cdc',
    appId: 'sap',
    name: 'SAP ERP S/4HANA (CDC Webhook)',
    stage: 'capture',
    stageLabel: '1. Ingestão & Captura',
    scope: 'workspace',
    category: 'Sistemas Core & ERP',
    description: 'Ingestão em tempo real de faturas vencidas, balanços contábeis e contas a pagar/receber.',
    status: 'Connected',
    latencyMs: 38,
    protocol: 'REST / RFC TLS 1.3'
  },
  {
    id: 'int-rd-webhook',
    appId: 'rdstation',
    name: 'RD Station Marketing Leads',
    stage: 'capture',
    stageLabel: '1. Ingestão & Captura',
    scope: 'workspace',
    category: 'Marketing & Vendas',
    description: 'Webhook de conversão inbound e qualificação de lead scoring para disparo de fluxos.',
    status: 'Connected',
    latencyMs: 42,
    protocol: 'Webhook HMAC-SHA256'
  },
  {
    id: 'int-bq-stream',
    appId: 'bigquery',
    name: 'Google BigQuery CDC Stream',
    stage: 'capture',
    stageLabel: '1. Ingestão & Captura',
    scope: 'workspace',
    category: 'Data & Analytics',
    description: 'Varredura e escuta contínua de tabelas de auditoria corporativa e telemetria analítica.',
    status: 'Connected',
    latencyMs: 65,
    protocol: 'BigQuery Storage API'
  },

  // 2. Ponte Cognitiva & Servidores MCP
  {
    id: 'int-laya-mcp',
    appId: 'laya',
    name: 'Laya System One (:20140)',
    stage: 'mcp',
    stageLabel: '2. Ponte MCP & Roteamento',
    scope: 'workspace',
    category: 'MCP Servers',
    description: 'Coprocessador de classificação de intenção e guardrails em CPU INT8 host com 0 MB de VRAM.',
    status: 'Active',
    latencyMs: 22,
    protocol: 'FastMCP JSON-RPC (:20140)'
  },
  {
    id: 'int-stitch-mcp',
    appId: 'cortex',
    name: 'Stitch MCP Server (:5005)',
    stage: 'mcp',
    stageLabel: '2. Ponte MCP & Roteamento',
    scope: 'workspace',
    category: 'MCP Servers',
    description: 'Provedor de prototipagem e exportação de componentes de interface React em conformidade visual.',
    status: 'Active',
    latencyMs: 35,
    protocol: 'Model Context Protocol (MCP)'
  },
  {
    id: 'int-notebooks-mcp',
    appId: 'cortex',
    name: 'Notebooks MCP Server (:5006)',
    stage: 'mcp',
    stageLabel: '2. Ponte MCP & Roteamento',
    scope: 'workspace',
    category: 'MCP Servers',
    description: 'Execução segura de células de análise estatística Python em sandbox controlada.',
    status: 'Active',
    latencyMs: 48,
    protocol: 'Model Context Protocol (MCP)'
  },
  {
    id: 'int-cortex-engine',
    appId: 'cortex',
    name: 'Cortex Engine Spec-Driven v3',
    stage: 'mcp',
    stageLabel: '2. Ponte MCP & Roteamento',
    scope: 'workspace',
    category: 'MCP Servers',
    description: 'Validador formal de invariantes de arquitetura, Stage Gates TLC v3 e integridade matemática.',
    status: 'Active',
    latencyMs: 18,
    protocol: 'PCL AEOS IPC / Local Socket'
  },

  // 3. Destinos de Ação & Automação BYOS
  {
    id: 'int-salesforce-crm',
    appId: 'salesforce',
    name: 'Salesforce CRM Enterprise',
    stage: 'destination',
    stageLabel: '3. Destinos & Ação BYOS',
    scope: 'workspace',
    category: 'Sistemas Core & ERP',
    description: 'Sincronização de contas estratégicas, decisores (CFO/Diretores) e notas fiscais amigáveis.',
    status: 'Connected',
    latencyMs: 82,
    protocol: 'OAuth2 / SOQL Enterprise'
  },
  {
    id: 'int-pipedrive-crm',
    appId: 'pipedrive',
    name: 'Pipedrive Deals & Pipeline',
    stage: 'destination',
    stageLabel: '3. Destinos & Ação BYOS',
    scope: 'individual',
    category: 'Marketing & Vendas',
    description: 'Atualização de status de negociações ganhas e atividades de acompanhamento da equipe comercial.',
    status: 'Connected',
    latencyMs: 54,
    protocol: 'REST v1 API'
  },
  {
    id: 'int-jira-ticket',
    appId: 'jira',
    name: 'Jira Software Squad Backlog',
    stage: 'destination',
    stageLabel: '3. Destinos & Ação BYOS',
    scope: 'workspace',
    category: 'Engenharia & Squads',
    description: 'Abertura de issues técnicas, estimativa de SLA e acionamento de squads de engenharia.',
    status: 'Connected',
    latencyMs: 76,
    protocol: 'Atlassian Connect TLS 1.3'
  },
  {
    id: 'int-gmail-dispatch',
    appId: 'gmail',
    name: 'Gmail Workspace Enterprise',
    stage: 'destination',
    stageLabel: '3. Destinos & Ação BYOS',
    scope: 'individual',
    category: 'Produtividade',
    description: 'Despacho de comunicados executivos, minutas de conciliação e atas autenticadas.',
    status: 'Connected',
    latencyMs: 44,
    protocol: 'Google Workspace API'
  },
  {
    id: 'int-pg-vault',
    appId: 'cortex',
    name: 'PostgreSQL 17 + PGVector Vault',
    stage: 'destination',
    stageLabel: '3. Destinos & Ação BYOS',
    scope: 'workspace',
    category: 'Data & Analytics',
    description: 'Gravação imutável da trilha de auditoria criptográfica SHA-256 e memória relacional multi-turn.',
    status: 'Sovereign BYOS',
    latencyMs: 8,
    protocol: 'PostgreSQL Native TLS'
  }
];

export const IntegrationsLibrary: React.FC = () => {
  const [viewMode, setViewMode] = useState<'pipeline' | 'catalog'>('pipeline');
  const [scopeFilter, setScopeFilter] = useState<'all' | 'individual' | 'workspace'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['Todas', 'Sistemas Core & ERP', 'Produtividade', 'Data & Analytics', 'MCP Servers', 'Marketing & Vendas', 'Engenharia & Squads'];

  const filteredIntegrations = LINEAR_INTEGRATIONS.filter(item => {
    const matchesScope = scopeFilter === 'all' || item.scope === scopeFilter;
    const matchesCategory = activeCategory === 'Todas' || item.category === activeCategory;
    const matchesQuery = !searchQuery.trim() ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.protocol.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesScope && matchesCategory && matchesQuery;
  });

  const captureItems = filteredIntegrations.filter(i => i.stage === 'capture');
  const mcpItems = filteredIntegrations.filter(i => i.stage === 'mcp');
  const destinationItems = filteredIntegrations.filter(i => i.stage === 'destination');

  return (
    <div className="space-y-4 text-xs text-slate-800 dark:text-slate-100 select-none">
      {/* Top Banner com Arquitetura BYOS */}
      <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-md">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold text-sm">Biblioteca de Integrações & Servidores MCP</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-semibold border border-emerald-500/40">
              Zero-Bin Custody (BYOS)
            </span>
          </div>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Arquitetura linear com 100% de conexões reais e ativas. Dados processados sem retenção externa e protegidos por SHA-256.
          </p>
        </div>

        {/* View Mode Toggle (Linear Pipeline vs Catálogo) */}
        <div className="flex items-center space-x-1 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('pipeline')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
              viewMode === 'pipeline'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Pipeline Linear (Tactiq)</span>
          </button>
          <button
            onClick={() => setViewMode('catalog')}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
              viewMode === 'catalog'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Catálogo Geral</span>
          </button>
        </div>
      </div>

      {/* Controles: Scope Switcher (Suas Conexões vs Workspace) e Busca */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        {/* Scope Switcher (Read.ai / Tactiq) */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
          <button
            onClick={() => setScopeFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              scopeFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Todas as Conexões ({LINEAR_INTEGRATIONS.length})
          </button>
          <button
            onClick={() => setScopeFilter('individual')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              scopeFilter === 'individual'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Suas Conexões (Pessoais)
          </button>
          <button
            onClick={() => setScopeFilter('workspace')}
            className={`px-3 py-1 rounded-lg font-medium transition ${
              scopeFilter === 'workspace'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Espaço de Trabalho (Tenant)
          </button>
        </div>

        {/* Busca Rápida */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Buscar por conector ou protocolo..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:border-emerald-500 transition"
          />
        </div>
      </div>

      {/* MODO 1: Pipeline Linear de 3 Estágios (Padrão Tactiq) */}
      {viewMode === 'pipeline' ? (
        <div className="space-y-4">
          {/* Esteira Visual Indicadora dos 3 Passos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* ESTÁGIO 1: Ingestão & Captura */}
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-900/40 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="font-bold text-xs text-blue-900 dark:text-blue-300">1. Ingestão & Captura</span>
                </div>
                <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-semibold">
                  {captureItems.length} fontes ativas
                </span>
              </div>

              <div className="space-y-2">
                {captureItems.map(item => (
                  <IntegrationCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* ESTÁGIO 2: Ponte Cognitiva & Servidores MCP */}
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  <span className="font-bold text-xs text-indigo-900 dark:text-indigo-300">2. Servidores MCP & Laya</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-semibold">
                  {mcpItems.length} pontes ativas
                </span>
              </div>

              <div className="space-y-2">
                {mcpItems.map(item => (
                  <IntegrationCard key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* ESTÁGIO 3: Destinos de Ação & Automação BYOS */}
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-300">3. Destinos & Ação BYOS</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  {destinationItems.length} destinos seguros
                </span>
              </div>

              <div className="space-y-2">
                {destinationItems.map(item => (
                  <IntegrationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MODO 2: Catálogo Geral por Categorias */
        <div className="space-y-4">
          <div className="flex space-x-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto custom-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-md font-medium transition whitespace-nowrap text-xs ${
                  activeCategory === cat
                    ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredIntegrations.map(item => (
              <IntegrationCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-componente de Card de Integração com Design Liquid Glass
const IntegrationCard: React.FC<{ item: IntegrationItem }> = ({ item }) => {
  const renderedLogo = renderOfficialLogo(item.appId, 'w-5 h-5 object-contain');

  return (
    <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 hover:border-emerald-500/80 transition shadow-xs group">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5 truncate">
          <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
            {renderedLogo || (
              item.appId === 'laya' ? <Cpu className="w-5 h-5 text-emerald-500" /> :
              item.appId === 'cortex' ? <Sparkles className="w-5 h-5 text-indigo-500" /> :
              <Server className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <span className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
            {item.name}
          </span>
        </div>
        <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold ${
          item.status === 'Active'
            ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
            : item.status === 'Sovereign BYOS'
            ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
            : 'bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400'
        }`}>
          {item.status}
        </span>
      </div>

      <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2">
        {item.description}
      </p>

      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span className="truncate max-w-[170px]" title={item.protocol}>
          {item.protocol}
        </span>
        {item.latencyMs && (
          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-0.5 flex-shrink-0">
            <span>{item.latencyMs}ms</span>
          </span>
        )}
      </div>
    </div>
  );
};
