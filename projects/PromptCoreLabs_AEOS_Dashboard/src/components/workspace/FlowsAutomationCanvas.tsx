import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Plus, CheckCircle2, Clock, Sparkles, 
  Settings, X, ArrowRight, RefreshCw, Zap,
  ZoomIn, ZoomOut, Maximize2, Move, RotateCcw,
  Copy, Check, ShieldCheck, Terminal, MapPin,
  Layers, ExternalLink, Activity, Info, GitBranch,
  ChevronDown, CheckCheck, Share2, Download, AlertCircle
} from 'lucide-react';
import { renderOfficialLogo } from '../common/AppOfficialLogos';

export interface FlowNode {
  id: string;
  name: string;
  type: 'trigger' | 'action' | 'ai_decision' | 'notification';
  appId: string;
  subtitle: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  executionTimeMs?: number;
  inputPayload: Record<string, any>;
  outputPayload: Record<string, any>;
  x?: number;
  y?: number;
}

export interface FlowDefinition {
  id: string;
  name: string;
  description: string;
  currentVersion: string;
  versions: string[];
  status: 'active' | 'draft' | 'archived';
  squad: string;
  nodes: FlowNode[];
}

export const PRESET_FLOWS: FlowDefinition[] = [
  {
    id: 'flow-sap-salesforce',
    name: 'Conciliação SAP & Salesforce',
    description: 'Webhook financeiro SAP com enriquecimento de decisores no Salesforce e despacho de cobrança amigável.',
    currentVersion: 'v1.4 PROD',
    versions: ['v1.4 PROD', 'v1.3 DRAFT', 'v1.0 LEGACY'],
    status: 'active',
    squad: 'Next Gen Sports',
    nodes: [
      {
        id: 'node-1',
        name: 'Gatilho: Fatura Atrasada',
        type: 'trigger',
        appId: 'sap',
        subtitle: 'SAP ERP • Webhook Financeiro',
        status: 'success',
        executionTimeMs: 45,
        inputPayload: { event: 'INVOICE_OVERDUE', thresholdDays: 15 },
        outputPayload: {
          faturaId: 'FAT-2026-9812',
          cliente: 'Acme Engenharia Corp',
          clienteId: 'CLI-9821',
          valor: 'R$ 48.500,00',
          diasAtraso: 18,
          moeda: 'BRL'
        }
      },
      {
        id: 'node-2',
        name: 'Consultar Decisores & Oportunidades',
        type: 'action',
        appId: 'salesforce',
        subtitle: 'Salesforce CRM • Query Account',
        status: 'success',
        executionTimeMs: 62,
        inputPayload: { query: 'CLI-9821', includeOpportunities: true },
        outputPayload: {
          responsavelFinanceiro: 'Carlos Silva',
          cargo: 'Diretor Financeiro (CFO)',
          email: 'carlos.silva@acme.corp',
          telefone: '+55 11 98765-4321',
          statusConta: 'Ativa - Churn Risk Médio'
        }
      },
      {
        id: 'node-3',
        name: 'Decisão de Tom & Minuta IA',
        type: 'ai_decision',
        appId: 'cortex',
        subtitle: 'Cortex Engine • OmniRoute $0.00',
        status: 'success',
        executionTimeMs: 184,
        inputPayload: {
          perfil: 'Corporativo VIP',
          diasAtraso: 18,
          historicoPagamentos: '92% Pontual'
        },
        outputPayload: {
          tomRecomendado: 'Cordial com Lembrete de Prazo',
          acaoSugerida: 'Notificação Direta com Boleto Atualizado',
          minuta: 'Prezado Carlos Silva, notamos uma pendência na fatura FAT-2026-9812...'
        }
      },
      {
        id: 'node-4',
        name: 'Despacho de Mensagem Executiva',
        type: 'notification',
        appId: 'gmail',
        subtitle: 'Gmail • Envio Oficial',
        status: 'success',
        executionTimeMs: 95,
        inputPayload: {
          to: 'carlos.silva@acme.corp',
          subject: 'Lembrete Amigável: Fatura FAT-2026-9812',
          includeAuditHash: true
        },
        outputPayload: {
          statusEnvio: 'ENVIADO',
          messageId: 'gm_msg_984321876',
          timestamp: '2026-10-21T20:45:12Z',
          sha256Audit: '8f4a21b3e9087c2b5d4e1a0f9c8b7a6d'
        }
      }
    ]
  },
  {
    id: 'flow-rd-onboarding',
    name: 'Onboarding de Leads RD Station',
    description: 'Ingestão de leads inbound qualificados no RD Station, classificação de perfil e criação de tarefas no Jira.',
    currentVersion: 'v2.1 PROD',
    versions: ['v2.1 PROD', 'v2.0 PROD', 'v1.0 LEGACY'],
    status: 'active',
    squad: 'Next Gen Sports',
    nodes: [
      {
        id: 'rd-node-1',
        name: 'Gatilho: Conversão Inbound',
        type: 'trigger',
        appId: 'rdstation',
        subtitle: 'RD Station • Webhook Conversão',
        status: 'idle',
        executionTimeMs: 38,
        inputPayload: { formId: 'FORM_ENTERPRISE_2026', leadScoreMin: 80 },
        outputPayload: {
          leadId: 'RD-LEAD-5542',
          empresa: 'Next Logistics Brasil',
          contato: 'Juliana Paes',
          score: 94
        }
      },
      {
        id: 'rd-node-2',
        name: 'Enriquecimento & Triagem PCL',
        type: 'ai_decision',
        appId: 'cortex',
        subtitle: 'Cortex Engine • Perfil ICP',
        status: 'idle',
        executionTimeMs: 142,
        inputPayload: { leadId: 'RD-LEAD-5542', segment: 'Enterprise B2B' },
        outputPayload: {
          prioridade: 'ALTA (Tier 1)',
          squadResponsavel: 'Expansão Comercial',
          slaAtendimento: '2 horas'
        }
      },
      {
        id: 'rd-node-3',
        name: 'Criar Card de Onboarding',
        type: 'action',
        appId: 'jira',
        subtitle: 'Jira Software • Issue Tracker',
        status: 'idle',
        executionTimeMs: 82,
        inputPayload: { project: 'SQUAD_EXP', issueType: 'Task', summary: 'Onboarding VIP: Next Logistics' },
        outputPayload: {
          issueKey: 'EXP-1042',
          assignee: 'Amanda Oliveira',
          status: 'TO DO'
        }
      }
    ]
  },
  {
    id: 'flow-hubspot-deals',
    name: 'Follow-up Deals HubSpot',
    description: 'Monitoramento de negociações paradas há mais de 5 dias no HubSpot com geração de alerta executivo.',
    currentVersion: 'v1.2 DRAFT',
    versions: ['v1.2 DRAFT', 'v1.1 PROD'],
    status: 'draft',
    squad: 'Next Gen Sports',
    nodes: [
      {
        id: 'hub-node-1',
        name: 'Gatilho: Deal Estagnado',
        type: 'trigger',
        appId: 'hubspot',
        subtitle: 'HubSpot CRM • Pipeline Scanner',
        status: 'idle',
        executionTimeMs: 55,
        inputPayload: { stage: 'Proposal Sent', inactivityDays: 5 },
        outputPayload: {
          dealId: 'HUB-DEAL-8891',
          dealName: 'Licenciamento Anual PCL AEOS',
          valor: 'R$ 120.000,00'
        }
      },
      {
        id: 'hub-node-2',
        name: 'Síntese de Objeções & Ação',
        type: 'ai_decision',
        appId: 'cortex',
        subtitle: 'Cortex Engine • Análise de Risco',
        status: 'idle',
        executionTimeMs: 165,
        inputPayload: { dealId: 'HUB-DEAL-8891', checkPastNotes: true },
        outputPayload: {
          diagnostico: 'Dúvida técnica de segurança ISO 27001 pendente',
          acaoRecomendada: 'Envio de Dossiê Técnico com Agendamento'
        }
      },
      {
        id: 'hub-node-3',
        name: 'Agendamento no Google Calendar',
        type: 'notification',
        appId: 'calendar',
        subtitle: 'Google Calendar • Convite Oficial',
        status: 'idle',
        executionTimeMs: 70,
        inputPayload: { title: 'Alinhamento Técnico PCL AEOS', durationMinutes: 30 },
        outputPayload: {
          calendarEventId: 'evt_hub_987412',
          status: 'CONFIRMADO'
        }
      }
    ]
  },
  {
    id: 'flow-pipedrive-sap',
    name: 'Sincronização Pipedrive & SAP',
    description: 'Ao marcar negócio como Ganho no Pipedrive, valida regras fiscais e emite pedido de vendas no SAP.',
    currentVersion: 'v1.0 DRAFT',
    versions: ['v1.0 DRAFT'],
    status: 'draft',
    squad: 'Next Gen Sports',
    nodes: [
      {
        id: 'pipe-node-1',
        name: 'Gatilho: Deal Won',
        type: 'trigger',
        appId: 'pipedrive',
        subtitle: 'Pipedrive CRM • Webhook Negócio Ganho',
        status: 'idle',
        executionTimeMs: 40,
        inputPayload: { event: 'DEAL_WON', thresholdValue: '50000' },
        outputPayload: {
          dealId: 'PIPE-99124',
          titulo: 'Fornecimento Equipamentos Esportivos',
          comprador: 'Federação Atlética'
        }
      },
      {
        id: 'pipe-node-2',
        name: 'Emissão de Pedido no SAP',
        type: 'action',
        appId: 'sap',
        subtitle: 'SAP ERP • Sales Order API',
        status: 'idle',
        executionTimeMs: 110,
        inputPayload: { orderType: 'STANDARD_SALE', autoApprove: false },
        outputPayload: {
          sapOrderNumber: 'SAP-SO-2026-441',
          status: 'AGUARDANDO_FISCAL'
        }
      }
    ]
  },
  {
    id: 'flow-lgpd-sanitizer',
    name: 'Triagem LGPD & Anonimização PII',
    description: 'Pipeline de governança PCL Guard para detecção e anonimização de dados antes do envio a provedores externos.',
    currentVersion: 'v1.0 PROD',
    versions: ['v1.0 PROD', 'v0.9 BETA'],
    status: 'active',
    squad: 'Next Gen Sports',
    nodes: [
      {
        id: 'lgpd-node-1',
        name: 'Varredura de Repositório',
        type: 'trigger',
        appId: 'bigquery',
        subtitle: 'Google BigQuery • Ingestão Diária',
        status: 'idle',
        executionTimeMs: 50,
        inputPayload: { dataset: 'corp_analytics', scanFields: ['cpf', 'rg', 'email'] },
        outputPayload: {
          recordsFound: 1420,
          sensibilityLevel: 'HIGH_RISK'
        }
      },
      {
        id: 'lgpd-node-2',
        name: 'Anonimização Criptográfica PCL',
        type: 'ai_decision',
        appId: 'cortex',
        subtitle: 'PCL Guard • Hasher HMAC-SHA256',
        status: 'idle',
        executionTimeMs: 190,
        inputPayload: { algorithm: 'HMAC_SHA256', saltRotation: true },
        outputPayload: {
          sanitizedRecords: 1420,
          complianceScore: '100% LGPD COMPLIANT'
        }
      }
    ]
  }
];

export const FlowsAutomationCanvas: React.FC = () => {
  // Controle de Múltiplos Fluxos em Abas (Até 5 abas simultâneas)
  const [openFlows, setOpenFlows] = useState<FlowDefinition[]>(PRESET_FLOWS.slice(0, 3));
  const [activeFlowId, setActiveFlowId] = useState<string>(PRESET_FLOWS[0].id);
  
  // Fluxo Ativo
  const activeFlow = openFlows.find(f => f.id === activeFlowId) || openFlows[0];
  const [nodes, setNodes] = useState<FlowNode[]>(activeFlow.nodes);
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(activeFlow.nodes[0] || null);

  // Sincroniza nós quando a aba de fluxo muda
  useEffect(() => {
    if (activeFlow) {
      setNodes(activeFlow.nodes);
      setSelectedNode(activeFlow.nodes[0] || null);
    }
  }, [activeFlowId]);

  // Estados de Controle de Execução e Modais
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'variables' | 'logs' | 'governance'>('variables');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isAddNodeOpen, setIsAddNodeOpen] = useState(false);
  const [isVersionDropdownOpen, setIsVersionDropdownOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [cloneSuccessMsg, setCloneSuccessMsg] = useState<string | null>(null);
  const [showFlowsCatalog, setShowFlowsCatalog] = useState(false);

  // Estados de Controle de Viewport (Zoom, Pan & Fit)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 60, y: 80 });
  const [isPanning, setIsPanning] = useState(false);
  const [panMode, setPanMode] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [showMinimap, setShowMinimap] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const graphContentRef = useRef<HTMLDivElement>(null);

  // Zoom In / Out / Reset
  const handleZoomIn = () => setZoom(prev => Math.min(Number((prev + 0.15).toFixed(2)), 2.2));
  const handleZoomOut = () => setZoom(prev => Math.max(Number((prev - 0.15).toFixed(2)), 0.35));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 60, y: 80 });
  };

  // Fit to Viewport
  const handleFitScreen = useCallback(() => {
    if (!containerRef.current || !graphContentRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const graphWidth = 1450;
    const graphHeight = 280;

    const scaleX = (container.width - 120) / graphWidth;
    const scaleY = (container.height - 120) / graphHeight;
    const idealZoom = Math.max(0.45, Math.min(1.0, Math.min(scaleX, scaleY)));

    setZoom(Number(idealZoom.toFixed(2)));
    setPan({
      x: Math.max(30, Math.round((container.width - graphWidth * idealZoom) / 2)),
      y: Math.max(40, Math.round((container.height - graphHeight * idealZoom) / 2))
    });
  }, []);

  // Pan pelo Mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (panMode || e.button === 1 || (e.target as HTMLElement).closest('.control-panel') || (e.target as HTMLElement).closest('.node-card') || (e.target as HTMLElement).closest('.inspector-panel')) {
      if (!panMode && e.button !== 1) return;
    }
    setIsPanning(true);
    setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    setPan({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => setIsPanning(false);

  // Zoom via Scroll Wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 0.1 : -0.1;
      setZoom(prev => Math.max(0.35, Math.min(2.2, Number((prev + zoomFactor).toFixed(2)))));
    } else {
      setPan(prev => ({
        x: prev.x - e.deltaX * 0.8,
        y: prev.y - e.deltaY * 0.8
      }));
    }
  };

  // Execução Sequencial do Grafo DAG
  const handleRunFlow = () => {
    setIsRunning(true);
    let currentIndex = 0;

    setNodes(prev => prev.map((n, i) => ({
      ...n,
      status: i === 0 ? 'running' : 'idle'
    })));

    const interval = setInterval(() => {
      if (currentIndex < nodes.length) {
        setNodes(prev => prev.map((n, i) => {
          if (i === currentIndex) return { ...n, status: 'success' };
          if (i === currentIndex + 1) return { ...n, status: 'running' };
          return n;
        }));
        currentIndex++;
      } else {
        clearInterval(interval);
        setNodes(prev => prev.map(n => ({ ...n, status: 'success' })));
        setIsRunning(false);
      }
    }, 550);
  };

  const handleCopyJson = (payload: any, key: string) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Gerenciamento de Abas de Fluxos
  const handleSelectFlow = (flowId: string) => {
    setActiveFlowId(flowId);
  };

  const handleCloseFlowTab = (flowId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (openFlows.length <= 1) return;
    const remaining = openFlows.filter(f => f.id !== flowId);
    setOpenFlows(remaining);
    if (activeFlowId === flowId) {
      setActiveFlowId(remaining[0].id);
    }
  };

  const handleOpenFlowFromCatalog = (flow: FlowDefinition) => {
    if (!openFlows.some(f => f.id === flow.id)) {
      if (openFlows.length >= 5) {
        alert('Limite máximo de 5 fluxos abertos simultaneamente atingido.');
        return;
      }
      setOpenFlows([...openFlows, flow]);
    }
    setActiveFlowId(flow.id);
    setShowFlowsCatalog(false);
  };

  // Salvar Nova Versão (Estilo Salesforce Flow Builder)
  const handleSaveNewVersion = () => {
    const currentNum = parseFloat(activeFlow.currentVersion.replace(/[^0.9.]/g, '')) || 1.0;
    const nextVersion = `v${(currentNum + 0.1).toFixed(1)} DRAFT`;
    const updatedVersions = [nextVersion, ...activeFlow.versions];
    
    setOpenFlows(prev => prev.map(f => {
      if (f.id === activeFlow.id) {
        return {
          ...f,
          currentVersion: nextVersion,
          versions: updatedVersions,
          status: 'draft'
        };
      }
      return f;
    }));
    setIsVersionDropdownOpen(false);
  };

  const handleSelectVersion = (version: string) => {
    setOpenFlows(prev => prev.map(f => {
      if (f.id === activeFlow.id) {
        return {
          ...f,
          currentVersion: version,
          status: version.includes('PROD') ? 'active' : 'draft'
        };
      }
      return f;
    }));
    setIsVersionDropdownOpen(false);
  };

  // Adicionar novo nó
  const handleAddSampleNode = (appId: string, name: string, type: FlowNode['type']) => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      name,
      type,
      appId,
      subtitle: `${appId.toUpperCase()} • Automação Soberana`,
      status: 'idle',
      executionTimeMs: 75,
      inputPayload: { action: 'EXECUTE', autoApprove: true },
      outputPayload: { status: 'SUCESSO_CONECTADO', timestamp: new Date().toISOString() }
    };
    setNodes(prev => [...prev, newNode]);
    setIsAddNodeOpen(false);
    setSelectedNode(newNode);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden select-none relative">
      {/* 1. Barra Superior de Abas de Fluxos (Até 5 Abas) */}
      <div className="h-10 px-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs z-30">
        <div className="flex items-center space-x-1 overflow-x-auto custom-scrollbar max-w-[80%]">
          {openFlows.map(flow => {
            const isActive = flow.id === activeFlowId;
            return (
              <div
                key={flow.id}
                onClick={() => handleSelectFlow(flow.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-t-lg font-medium cursor-pointer transition border-t-2 ${
                  isActive
                    ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 border-emerald-500 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border-transparent hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }`}
                title={flow.description}
              >
                <span className="material-symbols-outlined text-[16px] text-emerald-600 dark:text-emerald-400">account_tree</span>
                <span className="truncate max-w-[140px] text-xs">{flow.name}</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200/60 dark:border-slate-700/60">
                  {flow.currentVersion.split(' ')[0]}
                </span>
                {openFlows.length > 1 && (
                  <button
                    onClick={(e) => handleCloseFlowTab(flow.id, e)}
                    className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                    title="Fechar aba do fluxo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}

          {/* Botão + para abrir novo fluxo (até 5) */}
          {openFlows.length < 5 && (
            <button
              onClick={() => setShowFlowsCatalog(true)}
              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition ml-1"
              title="Abrir outro fluxo da organização (até 5 abas)"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Indicador de Squad / Organização */}
        <div className="flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Squad: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{activeFlow.squad}</strong></span>
        </div>
      </div>

      {/* 2. Barra de Comandos do Fluxo Ativo & Versionamento Salesforce Flow Builder */}
      <div className="h-12 px-5 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between text-xs z-20">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isRunning ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRunning ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-100 text-xs">
              {activeFlow.name}
            </span>
          </div>

          {/* Dropdown de Versionamento Estilo Salesforce Flow Builder */}
          <div className="relative">
            <button
              onClick={() => setIsVersionDropdownOpen(!isVersionDropdownOpen)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-[11px] font-mono border border-slate-200 dark:border-slate-700 transition"
              title="Gerenciamento de Versões (Flow Builder)"
            >
              <GitBranch className="w-3.5 h-3.5 text-indigo-500" />
              <span>{activeFlow.currentVersion}</span>
              <span className={`px-1 rounded text-[9px] font-semibold ${
                activeFlow.status === 'active' 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
              }`}>
                {activeFlow.status === 'active' ? 'Ativa' : 'Rascunho'}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Menu Dropdown de Versões */}
            {isVersionDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-2 z-50 text-xs space-y-1">
                <div className="px-2 py-1 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Versões do Fluxo
                </div>

                {activeFlow.versions.map(v => (
                  <button
                    key={v}
                    onClick={() => handleSelectVersion(v)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition font-mono ${
                      v === activeFlow.currentVersion
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{v}</span>
                    {v === activeFlow.currentVersion && <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />}
                  </button>
                ))}

                <div className="pt-1 border-t border-slate-100 dark:border-slate-800 space-y-1">
                  <button
                    onClick={handleSaveNewVersion}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:text-indigo-600 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Salvar como Nova Versão</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsCloneModalOpen(true);
                      setIsVersionDropdownOpen(false);
                    }}
                    className="w-full flex items-center space-x-2 px-2.5 py-1.5 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Share2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reutilizar em Outro Projeto</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls & Run Flow */}
        <div className="flex items-center space-x-2.5 control-panel">
          <button
            onClick={handleRunFlow}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition flex items-center space-x-1.5 shadow-sm ${
              isRunning 
                ? 'bg-amber-500 text-white cursor-wait animate-pulse' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
            }`}
            title="Simular execução de todo o grafo DAG ponta a ponta"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executando Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Executar Fluxo</span>
              </>
            )}
          </button>

          <button 
            onClick={() => setIsAddNodeOpen(true)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-400 dark:hover:border-slate-600 transition flex items-center space-x-1 text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-500" />
            <span>Adicionar Nó</span>
          </button>
        </div>
      </div>

      {/* 3. Main Viewport: Canvas + Minimap Dinâmico + Slide-Over Drawer Flutuante */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className="flex-1 flex overflow-hidden relative"
        style={{
          cursor: isPanning ? 'grabbing' : panMode ? 'grab' : 'default',
          backgroundImage: 'radial-gradient(#94a3b8 1.2px, transparent 1.2px)',
          backgroundSize: `${24 * zoom}px ${24 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        {/* Floating Viewport Toolbar (Zoom, Fit, Pan, Minimap Toggle) */}
        <div className="absolute left-6 bottom-6 flex items-center space-x-1 p-1.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-30 text-xs control-panel">
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Aumentar Zoom (+15%)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleResetZoom}
            className="px-2 py-1 text-[11px] font-mono font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded transition"
            title="Redefinir Zoom para 100% (1:1)"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition"
            title="Diminuir Zoom (-15%)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 my-auto"></div>

          <button
            onClick={handleFitScreen}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex items-center space-x-1"
            title="Ajustar à Tela (Fit to Viewport)"
          >
            <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
          </button>

          <button
            onClick={() => setPanMode(!panMode)}
            className={`p-1.5 rounded-lg transition ${
              panMode 
                ? 'bg-emerald-500 text-white font-bold shadow-xs' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
            }`}
            title={panMode ? 'Modo Pan Ativo (arraste livremente)' : 'Ativar Ferramenta Pan de Navegação'}
          >
            <Move className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 my-auto"></div>

          <button
            onClick={() => setShowMinimap(!showMinimap)}
            className={`p-1.5 rounded-lg transition text-[11px] ${
              showMinimap 
                ? 'text-emerald-600 dark:text-emerald-400 font-semibold' 
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Alternar exibição do Minimapa"
          >
            <MapPin className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dynamic Minimap Overlay com Deslocamento Anti-Sobreposição */}
        {showMinimap && (
          <div 
            className={`absolute ${selectedNode ? 'right-[440px]' : 'right-6'} bottom-6 w-48 h-28 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-20 p-2 overflow-hidden pointer-events-none control-panel select-none transition-all duration-300`}
          >
            <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 mb-1 border-b border-slate-100 dark:border-slate-800 pb-1">
              <span>MINIMAPA DAG</span>
              <span>1:10</span>
            </div>
            <div className="relative w-full h-20 bg-slate-50 dark:bg-slate-950 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-around px-2">
              {nodes.map(n => (
                <div 
                  key={n.id} 
                  className={`w-3 h-3 rounded-full ${
                    n.status === 'success' 
                      ? 'bg-emerald-500 ring-2 ring-emerald-300' 
                      : n.status === 'running' 
                      ? 'bg-amber-500 animate-ping' 
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`} 
                />
              ))}
            </div>
          </div>
        )}

        {/* Graph Content & Conexões SVG com Pulsos de Luz */}
        <div 
          ref={graphContentRef}
          className="relative transition-transform duration-75 origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
          }}
        >
          {/* Conexões SVG Acíclicas com Pulso Dinâmico */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '2200px', height: '600px' }}>
            <defs>
              <linearGradient id="flowLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#6366f1" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
              </linearGradient>

              {/* Símbolo de Luz em Trânsito para o Pulso de Telemetria */}
              <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="60%" stopColor="#38bdf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>
            </defs>

            {nodes.map((node, idx) => {
              if (idx === nodes.length - 1) return null;
              const startX = idx * 360 + 290;
              const startY = 120;
              const endX = (idx + 1) * 360;
              const endY = 120;
              const midX = (startX + endX) / 2;
              const pathD = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;

              return (
                <g key={`edge-${node.id}`}>
                  {/* Linha Guia de Base */}
                  <path 
                    d={pathD} 
                    fill="none" 
                    stroke="currentColor" 
                    className="text-slate-300 dark:text-slate-800" 
                    strokeWidth="3" 
                    strokeDasharray="6 4" 
                  />

                  {/* Linha Ativa Iluminada quando executado com Sucesso */}
                  {node.status === 'success' && (
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke="url(#flowLineGrad)" 
                      strokeWidth="3.5" 
                      className="animate-in fade-in duration-300"
                    />
                  )}

                  {/* Pulso de Luz/Telemetria em Trânsito SVG */}
                  {node.status === 'running' && (
                    <circle r="6" fill="url(#pulseGlow)">
                      <animateMotion 
                        path={pathD} 
                        dur="1.2s" 
                        repeatCount="indefinite" 
                        rotate="auto" 
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nós do Pipeline DAG */}
          <div className="flex items-center space-x-16 p-8">
            {nodes.map((node, index) => {
              const isSelected = selectedNode?.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node)}
                  className={`node-card w-72 rounded-2xl border p-4 transition-all duration-200 cursor-pointer relative shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white/95 dark:bg-slate-900/95 border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {/* Badge de Status e Número do Passo */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold border border-slate-200/60 dark:border-slate-700/60">
                      Passo {index + 1}
                    </span>
                    <span className={`flex items-center space-x-1 text-[11px] font-semibold ${
                      node.status === 'success' ? 'text-emerald-500' :
                      node.status === 'running' ? 'text-amber-500 animate-pulse' :
                      node.status === 'failed' ? 'text-rose-500' : 'text-slate-400'
                    }`}>
                      {node.status === 'success' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {node.status === 'running' && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                      {node.status === 'idle' && <Clock className="w-3.5 h-3.5" />}
                      <span className="capitalize">{node.status}</span>
                    </span>
                  </div>

                  {/* App Logo & Node Header */}
                  <div className="flex items-center space-x-3 mb-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700/80 flex items-center justify-center flex-shrink-0 shadow-xs">
                      {node.appId === 'cortex' ? (
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                      ) : (
                        renderOfficialLogo(node.appId, 'w-5 h-5 object-contain')
                      )}
                    </div>
                    <div className="truncate pr-12">
                      <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block truncate">
                        {node.name}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate block font-mono">
                        {node.subtitle}
                      </span>
                    </div>
                  </div>

                  {/* Node Type and Execution SLA */}
                  <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span className="px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {node.type.toUpperCase()}
                    </span>
                    {node.executionTimeMs && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{node.executionTimeMs}ms</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Slide-Over Flutuante com Overlay (Drawer que não espreme o Canvas) */}
        {selectedNode && (
          <aside className="inspector-panel absolute right-0 top-0 bottom-0 w-[420px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-2xl z-40 animate-in slide-in-from-right duration-200">
            {/* Inspector Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2.5 truncate">
                <div className="w-7 h-7 flex items-center justify-center">
                  {selectedNode.appId === 'cortex' ? (
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                  ) : (
                    renderOfficialLogo(selectedNode.appId, 'w-4 h-4 object-contain')
                  )}
                </div>
                <div className="truncate">
                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">
                    {selectedNode.name}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Node ID: {selectedNode.id}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                title="Fechar Painel de Inspeção"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Inspector Navigation Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs px-4 pt-2 bg-slate-50/50 dark:bg-slate-900/50">
              <button
                onClick={() => setActiveTab('variables')}
                className={`pb-2 px-2.5 font-medium transition border-b-2 text-xs ${
                  activeTab === 'variables'
                    ? 'border-emerald-500 text-slate-900 dark:text-white font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Payloads JSON
              </button>
              <button
                onClick={() => setActiveTab('logs')}
                className={`pb-2 px-2.5 font-medium transition border-b-2 text-xs ${
                  activeTab === 'logs'
                    ? 'border-emerald-500 text-slate-900 dark:text-white font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Logs SHA-256
              </button>
              <button
                onClick={() => setActiveTab('governance')}
                className={`pb-2 px-2.5 font-medium transition border-b-2 text-xs ${
                  activeTab === 'governance'
                    ? 'border-emerald-500 text-slate-900 dark:text-white font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Governança LGPD
              </button>
            </div>

            {/* Inspector Body Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar text-xs">
              {activeTab === 'variables' ? (
                <>
                  {/* Output Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Payload de Saída (JSON):
                      </span>
                      <button
                        onClick={() => handleCopyJson(selectedNode.outputPayload, 'out')}
                        className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-mono"
                      >
                        {copiedKey === 'out' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'out' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
                      {JSON.stringify(selectedNode.outputPayload, null, 2)}
                    </pre>
                  </div>

                  {/* Input Payload */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                        Parâmetros de Entrada:
                      </span>
                      <button
                        onClick={() => handleCopyJson(selectedNode.inputPayload, 'in')}
                        className="flex items-center space-x-1 text-[10px] text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-mono"
                      >
                        {copiedKey === 'in' ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey === 'in' ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-200 dark:border-slate-800">
                      {JSON.stringify(selectedNode.inputPayload, null, 2)}
                    </pre>
                  </div>
                </>
              ) : activeTab === 'logs' ? (
                <div className="space-y-3 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="text-slate-400 block text-[10px]">Atestação Criptográfica:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] break-all">
                      SHA256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                    </span>
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 space-y-1">
                    <p>• [{new Date().toLocaleTimeString()}] Inicialização do worker em container isolado.</p>
                    <p>• [{new Date().toLocaleTimeString()}] Validação de esquema JSON 100% aprovada.</p>
                    <p>• [{new Date().toLocaleTimeString()}] Latência total de execução computada em {selectedNode.executionTimeMs}ms.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 space-y-1">
                    <div className="flex items-center space-x-1.5 font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Conformidade PCL Guard & LGPD</span>
                    </div>
                    <p className="text-[11px] opacity-90 leading-relaxed">
                      Nenhum dado pessoal sensível (PII) é transmitido para provedores externos sem sanitização e anonimização prévia.
                    </p>
                  </div>
                  <div className="space-y-1 text-slate-500 dark:text-slate-400 text-[11px]">
                    <p>• Criptografia em Trânsito: TLS 1.3</p>
                    <p>• Criptografia em Repouso: AES-256 GCM</p>
                    <p>• Trilha Imutável: PostgreSQL SHA-256</p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>

      {/* Modal: Adicionar Novo Nó ao Grafo DAG */}
      {isAddNodeOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
          <div className="w-[440px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Plus className="w-4 h-4 text-emerald-500" />
                <span>Adicionar Nó ao Pipeline DAG</span>
              </h3>
              <button onClick={() => setIsAddNodeOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Selecione o serviço ou conector oficial para compor o próximo passo acíclico:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'salesforce', name: 'Salesforce CRM', type: 'action' as const },
                { id: 'hubspot', name: 'HubSpot Deals', type: 'action' as const },
                { id: 'pipedrive', name: 'Pipedrive CRM', type: 'action' as const },
                { id: 'rdstation', name: 'RD Station Leads', type: 'trigger' as const },
                { id: 'sap', name: 'SAP ERP Financeiro', type: 'action' as const },
                { id: 'jira', name: 'Jira Issue Ticket', type: 'action' as const },
                { id: 'bigquery', name: 'Google BigQuery', type: 'action' as const },
                { id: 'cortex', name: 'Validador Cortex', type: 'ai_decision' as const }
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => handleAddSampleNode(item.id, item.name, item.type)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition flex items-center space-x-2 text-left"
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {item.id === 'cortex' ? <Sparkles className="w-4 h-4 text-indigo-500" /> : renderOfficialLogo(item.id, 'w-4 h-4 object-contain')}
                  </div>
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 truncate">{item.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Catálogo de Fluxos da Organização */}
      {showFlowsCatalog && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
          <div className="w-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <span className="material-symbols-outlined text-[18px] text-emerald-500">account_tree</span>
                <span>Catálogo de Fluxos da Organização</span>
              </h3>
              <button onClick={() => setShowFlowsCatalog(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Selecione um fluxo para abrir em uma nova aba (até 5 simultâneas):
            </p>

            <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
              {PRESET_FLOWS.map(f => {
                const isOpen = openFlows.some(op => op.id === f.id);
                return (
                  <div
                    key={f.id}
                    onClick={() => handleOpenFlowFromCatalog(f)}
                    className={`p-3 rounded-xl border transition flex items-center justify-between cursor-pointer ${
                      isOpen
                        ? 'border-emerald-300 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{f.name}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {f.currentVersion}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{f.description}</p>
                    </div>
                    {isOpen ? (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">Aberta</span>
                    ) : (
                      <Plus className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Reutilizar / Clonar Template para Outro Projeto */}
      {isCloneModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-100">
          <div className="w-[420px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-indigo-500" />
                <span>Reutilizar Template em Outro Projeto</span>
              </h3>
              <button onClick={() => { setIsCloneModalOpen(false); setCloneSuccessMsg(null); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            {cloneSuccessMsg ? (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-xs">
                  <CheckCheck className="w-4 h-4 text-emerald-500" />
                  <span>{cloneSuccessMsg}</span>
                </div>
                <button
                  onClick={() => { setIsCloneModalOpen(false); setCloneSuccessMsg(null); }}
                  className="w-full py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-500 transition"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500">
                  Exportar a definição da versão <strong className="font-mono text-slate-800 dark:text-slate-200">{activeFlow.currentVersion}</strong> do fluxo <strong>{activeFlow.name}</strong> para uma nova squad/projeto:
                </p>

                <div className="space-y-2 text-xs">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                    Selecione o Projeto de Destino:
                  </label>
                  <select className="w-full p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200">
                    <option>Next Gen Sports - Squad Operações</option>
                    <option>Next Gen Sports - Squad Financeiro & Risco</option>
                    <option>Next Gen Sports - Squad Marketing & CRM</option>
                    <option>PromptCore Labs - Pesquisa & Governança</option>
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setIsCloneModalOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => setCloneSuccessMsg(`Template ${activeFlow.currentVersion} exportado com sucesso!`)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition shadow-sm"
                  >
                    Clonar Template
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
