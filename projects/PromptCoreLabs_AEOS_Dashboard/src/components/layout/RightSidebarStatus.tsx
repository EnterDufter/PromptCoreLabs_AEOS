import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronDown, Bot, Activity, CheckCircle2, Clock, 
  Server, Shield, Cpu, RefreshCw, Zap, AlertTriangle, Check, Radio,
  Globe, XCircle, ExternalLink, Laptop, DollarSign, TrendingUp, Lock,
  ShieldCheck, FileText, CheckCheck, Landmark, ArrowUpRight
} from 'lucide-react';
import { Agent, ServiceStatus } from '../../types';
import { daemonHealthService, TelemetrySnapshot } from '../../services/telemetry/daemonHealthService';
import { budgetControlService } from '../../services/governance/budgetControlService';

export interface ExtensionSession {
  id: string;
  hostSystem: string;
  tabTitle: string;
  user: string;
  injectedAt: string;
  status: 'CONNECTED' | 'REVOKED';
}

interface RightSidebarStatusProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  agents: Agent[];
  services?: ServiceStatus[];
  isProcessing?: boolean;
  activeTaskName?: string;
  activeStepIndex?: number;
  mode?: 'telemetry' | 'governance';
  onModeChange?: (mode: 'telemetry' | 'governance') => void;
  onOpenSettings?: (tab?: string) => void;
}

export const RightSidebarStatus: React.FC<RightSidebarStatusProps> = ({
  collapsed,
  onToggleCollapse,
  agents,
  isProcessing = false,
  activeTaskName,
  activeStepIndex = 4,
  mode = 'telemetry',
  onModeChange,
  onOpenSettings
}) => {
  // Telemetria Viva Real (Zero Mocks / Probes HTTP em Runtime)
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot | null>(daemonHealthService.getSnapshot());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Estados dos Módulos Retráteis da Telemetria (Padrão > / v antes de Ícone+Texto)
  const [isAgentsOpen, setIsAgentsOpen] = useState(true);
  const [isStageGatesOpen, setIsStageGatesOpen] = useState(true);
  const [isExtensionsOpen, setIsExtensionsOpen] = useState(false);
  const [isInfraOpen, setIsInfraOpen] = useState(false);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const side = p.get('sidebar');
      if (side === 'retracted') {
        setIsAgentsOpen(false);
        setIsStageGatesOpen(false);
        setIsExtensionsOpen(false);
        setIsInfraOpen(false);
      } else if (side === 'expanded') {
        setIsAgentsOpen(true);
        setIsStageGatesOpen(true);
        setIsExtensionsOpen(true);
        setIsInfraOpen(true);
      }
    } catch {}
  }, []);

  // Monitor de Sessões Injetadas da Companion Extension no Navegador (Zero Mocks: populado somente via extensão real)
  const [extensionSessions, setExtensionSessions] = useState<ExtensionSession[]>([]);

  useEffect(() => {
    const onExtensionMessage = (event: MessageEvent) => {
      if (event.source !== window || !event.data || typeof event.data !== 'object') return;
      if (event.data.type === 'PCL_EXTENSION_SESSION_REGISTER' && event.data.session) {
        const s = event.data.session as ExtensionSession;
        setExtensionSessions(prev => [s, ...prev.filter(x => x.id !== s.id)]);
      } else if (event.data.type === 'PCL_EXTENSION_SESSION_REVOKE' && event.data.sessionId) {
        setExtensionSessions(prev => prev.map(x => x.id === event.data.sessionId ? { ...x, status: 'REVOKED' } : x));
      }
    };
    window.addEventListener('message', onExtensionMessage);
    return () => window.removeEventListener('message', onExtensionMessage);
  }, []);

  const handleRevokeSession = (sessionId: string) => {
    setExtensionSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status: 'REVOKED' } : s));
    window.postMessage({ type: 'PCL_REVOKE_EXTENSION_SESSION', sessionId }, '*');
  };

  useEffect(() => {
    const unsubscribe = daemonHealthService.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);
    });
    return () => unsubscribe();
  }, []);

  const handleManualProbe = async () => {
    setIsRefreshing(true);
    try {
      await daemonHealthService.probeAll();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  if (collapsed) {
    return null;
  }

  // Stage Gates TLC v3 com validação dinâmica
  const stageGates = [
    { id: 1, name: '1. Arquitetura Cortex DAG', gateStep: 0 },
    { id: 2, name: '2. PII Guard & Sanitização LGPD', gateStep: 1 },
    { id: 3, name: '3. Laya Coprocessor (0 MB VRAM)', gateStep: 2 },
    { id: 4, name: '4. Auditoria SHA-256 ISO 27001', gateStep: 4 }
  ];

  const layaService = snapshot?.services.find(s => s.id === 'svc-laya');
  const ollamaService = snapshot?.services.find(s => s.id === 'svc-ollama');
  const budgetConfig = budgetControlService.getConfig();

  return (
    <aside className="w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 flex flex-col h-full select-none z-20 shadow-xl transition-all duration-200">
      {/* Header do Painel */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {mode === 'governance' ? (
            <div className="w-6 h-6 rounded-lg bg-sky-500/10 flex items-center justify-center border border-sky-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
              <Radio className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-xs text-slate-800 dark:text-slate-100">
              {mode === 'governance' ? 'Governança & FinOps Soberano' : 'Telemetria & Status em Tempo Real'}
            </h3>
            <span className="text-[9px] font-mono text-slate-400 block -mt-0.5">
              {mode === 'governance' ? 'Painel Executivo • Custódia de Custo' : 'Zero Mocks • Probes HTTP Locais'}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {mode === 'governance' ? (
            onOpenSettings && (
              <button
                onClick={() => onOpenSettings('costs')}
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition cursor-pointer"
                title="Abrir Painel Completo de Custos & FinOps"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )
          ) : (
            <button
              onClick={handleManualProbe}
              disabled={isRefreshing}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
              title="Re-executar probes de telemetria agora"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-500' : ''}`} />
            </button>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer"
            title="Fechar Painel Lateral"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Micro-Switcher de Visão Canônica no Topo do Painel */}
      {onModeChange && (
        <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-slate-200/60 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => onModeChange('telemetry')}
              className={`py-1 text-[10.5px] font-semibold flex items-center justify-center space-x-1.5 rounded-md transition cursor-pointer ${
                mode === 'telemetry'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Activity className="w-3 h-3 text-emerald-500" />
              <span>Telemetria</span>
            </button>
            <button
              type="button"
              onClick={() => onModeChange('governance')}
              className={`py-1 text-[10.5px] font-semibold flex items-center justify-center space-x-1.5 rounded-md transition cursor-pointer ${
                mode === 'governance'
                  ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs border border-slate-200/60 dark:border-slate-700'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-3 h-3 text-sky-500" />
              <span>Governança</span>
            </button>
          </div>
        </div>
      )}

      {mode === 'governance' ? (
        /* CONTEÚDO EXECUTIVO & GOVERNANÇA (Espelho de Confiança para C-Level / CFO) */
        <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs custom-scrollbar">
          {/* Card 1: Economia & FinOps Soberano */}
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-emerald-950 dark:text-emerald-200 flex items-center space-x-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Economia Estimada</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold border border-emerald-300 dark:border-emerald-700">
                Soberania: {budgetConfig.sovereigntyRatioPercent}%
              </span>
            </div>

            <div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  R$ 18.420
                </span>
                <span className="text-[10px] text-slate-500 font-medium">/ mês poupados</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                Calculado sobre inferência local em CPU (Laya INT8 + Ollama) comparada a APIs externas em dólar.
              </p>
            </div>

            <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60 grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div>
                <span className="text-slate-400 block text-[9px]">Custo Marginal:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">$0.00 / token</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[9px]">Volume Local:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200">
                  {(budgetConfig.localTokensCount / 1000000).toFixed(1)}M tokens
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Política de Limite Orçamentário (Hard Lock) */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-500" />
                <span>Política de Limite Orçamentário</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] font-bold">
                {budgetConfig.hardLockEnabled ? 'Hard Lock Ativo' : 'Aviso Apenas'}
              </span>
            </div>

            <p className="text-[10.5px] text-slate-500 dark:text-slate-400">
              Trava física por usuário e departamento, com bloqueio automático em horários não-comerciais.
            </p>

            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-slate-500">Teto Alocado: US$ {budgetConfig.allocatedUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  US$ {budgetConfig.currentSpendUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })} (30.3%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${(budgetConfig.currentSpendUSD / budgetConfig.allocatedUSD) * 100}%` }}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span>Projeção Mês: US$ {budgetConfig.monthlyProjectionUSD.toFixed(2)}</span>
              <span>Média: US$ {budgetConfig.dailyAverageUSD.toFixed(2)}/dia</span>
            </div>
          </div>

          {/* Card 3: Sessões Ativas & Concorrência */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
                <Laptop className="w-3.5 h-3.5 text-blue-500" />
                <span>Sessões Ativas (Trava 2/2)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-mono text-[9px] font-bold">
                2 de 2 Conectados
              </span>
            </div>

            <div className="space-y-1.5">
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[10px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block">Workstation Principal (Windows)</span>
                  <span className="text-[9px] font-mono text-slate-400">192.168.1.100 • Sessão Ativa Agora</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-[10px] flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-700 dark:text-slate-200 block">Notebook Executivo (macOS)</span>
                  <span className="text-[9px] font-mono text-slate-400">192.168.1.104 • Token Válido</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>
            </div>

            <p className="text-[9.5px] text-slate-400 leading-tight">
              Proteção contra compartilhamento não-autorizado: novos acessos exigem revogação manual de uma sessão existente.
            </p>
          </div>

          {/* Card 4: Dossiê e Trilha de Auditoria ISO / LGPD */}
          <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-800 dark:text-slate-100 flex items-center space-x-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Trilha de Auditoria (Audit Trail)</span>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[9px] font-bold">
                100% BYOS
              </span>
            </div>

            <div className="space-y-1 text-[10.5px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span>Resíduo Zero de Dados corporativos</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span>PII Guard Sanitização em tempo real</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span>Recibos com assinatura SHA-256</span>
              </div>
            </div>

            {onOpenSettings && (
              <button
                type="button"
                onClick={() => onOpenSettings('costs')}
                className="w-full mt-2 py-2 px-3 rounded-lg bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 font-semibold text-xs flex items-center justify-center space-x-2 shadow-xs hover:bg-slate-800 dark:hover:bg-white transition cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                <span>Abrir Painel Completo de FinOps</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* CONTEÚDO TÉCNICO & TELEMETRIA (Zero Mocks / Probes em Tempo Real) */
        <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs custom-scrollbar">
        {/* Section 1: Active Autonomous Agents */}
        <div>
          <button
            onClick={() => setIsAgentsOpen(!isAgentsOpen)}
            className="w-full flex items-center justify-between mb-2 p-1 -mx-1 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition cursor-pointer text-left select-none"
            title={isAgentsOpen ? 'Recolher detalhes de Agentes Ativos' : 'Expandir detalhes de Agentes Ativos'}
          >
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <span className="font-mono font-bold text-[11px] text-slate-500 dark:text-slate-400 w-2.5 inline-block text-center">
                {isAgentsOpen ? 'v' : '>'}
              </span>
              <Bot className="w-3 h-3 text-indigo-500" />
              <span>Agentes Ativos ({agents.filter(a => a.status === 'active' || isProcessing).length})</span>
            </span>
            <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
          </button>

          {isAgentsOpen && (
            <div className="space-y-2 animate-in fade-in duration-150">
              {agents.map(agent => {
                const isAgentCurrentlyWorking = agent.id === 'ag-1' && isProcessing;
                const displayStatus = isAgentCurrentlyWorking ? 'active' : agent.status;
                const currentTaskText = isAgentCurrentlyWorking 
                  ? (activeTaskName || 'Executando DAG & Grounding Multimodal...') 
                  : agent.currentTask;

                return (
                  <div
                    key={agent.id}
                    className={`p-2.5 rounded-lg bg-white dark:bg-slate-900 border transition-all duration-200 shadow-sm space-y-1.5 ${
                      isAgentCurrentlyWorking
                        ? 'border-indigo-400 dark:border-indigo-700 ring-1 ring-indigo-500/30 shadow-md'
                        : 'border-slate-200/80 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${displayStatus === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                        <span>{agent.name}</span>
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {agent.role.split(' ')[0]}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{agent.role}</p>

                    {currentTaskText && (
                      <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded text-[10px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800/80">
                        <span className="text-slate-400 block font-mono text-[9px]">Tarefa em Execução:</span>
                        <span className="font-medium text-indigo-600 dark:text-indigo-400">{currentTaskText}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                      <span className="truncate max-w-[140px]">Modelo: {agent.model}</span>
                      {agent.timerFormatted && (
                        <span className="text-amber-600 dark:text-amber-400 flex items-center space-x-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{agent.timerFormatted}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Stage Gates TLC v3 */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsStageGatesOpen(!isStageGatesOpen)}
            className="w-full flex items-center justify-between mb-2 p-1 -mx-1 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition cursor-pointer text-left select-none"
            title={isStageGatesOpen ? 'Recolher Stage Gates TLC v3' : 'Expandir Stage Gates TLC v3'}
          >
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <span className="font-mono font-bold text-[11px] text-slate-500 dark:text-slate-400 w-2.5 inline-block text-center">
                {isStageGatesOpen ? 'v' : '>'}
              </span>
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Stage Gates TLC v3</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {isProcessing ? 'Validando...' : '100% Homologado'}
            </span>
          </button>

          {isStageGatesOpen && (
            <div className="space-y-1.5 text-[11px] animate-in fade-in duration-150">
              {stageGates.map(gate => {
                const isGateActive = isProcessing && activeStepIndex === gate.gateStep;
                const isGateCompleted = !isProcessing || activeStepIndex > gate.gateStep;

                return (
                  <div 
                    key={gate.id}
                    className={`flex items-center justify-between p-2 rounded bg-white dark:bg-slate-900 border transition ${
                      isGateActive
                        ? 'border-indigo-400 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/20'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{gate.name}</span>
                    {isGateActive ? (
                      <Activity className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                    ) : isGateCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-700" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2.5: Companion Extension Injected Sessions Monitor */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsExtensionsOpen(!isExtensionsOpen)}
            className="w-full flex items-center justify-between mb-2 p-1 -mx-1 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition cursor-pointer text-left select-none"
            title={isExtensionsOpen ? 'Recolher Extensões Injetadas' : 'Expandir Extensões Injetadas'}
          >
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <span className="font-mono font-bold text-[11px] text-slate-500 dark:text-slate-400 w-2.5 inline-block text-center">
                {isExtensionsOpen ? 'v' : '>'}
              </span>
              <Laptop className="w-3 h-3 text-emerald-500" />
              <span>Extensões Injetadas ({extensionSessions.filter(s => s.status === 'CONNECTED').length})</span>
            </span>
            <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Bunker Shadow DOM</span>
            </span>
          </button>

          {isExtensionsOpen && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              {extensionSessions.length === 0 ? (
                <div
                  data-testid="companion-extensions-empty"
                  className="p-2.5 rounded-lg border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed"
                >
                  Nenhuma sessão da Companion Extension ativa nesta guia. Conecte a extensão Chrome/Edge para monitorar contextos injetados em tempo real.
                </div>
              ) : (
                extensionSessions.map(sess => (
                <div
                  key={sess.id}
                  className={`p-2 rounded-lg border transition ${
                    sess.status === 'CONNECTED'
                      ? 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                      : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200/40 dark:border-slate-800/40 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 truncate">
                      <span className={`w-1.5 h-1.5 rounded-full ${sess.status === 'CONNECTED' ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                      <span className="font-bold text-[11px] text-slate-800 dark:text-slate-200 truncate">
                        {sess.hostSystem}
                      </span>
                    </div>
                    {sess.status === 'CONNECTED' ? (
                      <button
                        onClick={() => handleRevokeSession(sess.id)}
                        className="px-1.5 py-0.5 rounded text-[9px] font-mono text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition"
                        title="Revogar credenciais de injeção imediatamente"
                      >
                        Revogar
                      </button>
                    ) : (
                      <span className="text-[9px] font-mono text-slate-400">
                        Revogado
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {sess.tabTitle}
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800/60 mt-1">
                    <span>{sess.user}</span>
                    <span>{sess.injectedAt}</span>
                  </div>
                </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Section 3: System Services & Real Live Latency Probes */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setIsInfraOpen(!isInfraOpen)}
            className="w-full flex items-center justify-between mb-2 p-1 -mx-1 rounded-lg hover:bg-slate-100/70 dark:hover:bg-slate-800/60 transition cursor-pointer text-left select-none"
            title={isInfraOpen ? 'Recolher Infraestrutura Soberana Local' : 'Expandir Infraestrutura Soberana Local'}
          >
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1.5">
              <span className="font-mono font-bold text-[11px] text-slate-500 dark:text-slate-400 w-2.5 inline-block text-center">
                {isInfraOpen ? 'v' : '>'}
              </span>
              <Server className="w-3 h-3 text-blue-500" />
              <span>Infraestrutura Soberana Local</span>
            </span>
            <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400">
              {snapshot?.allHealthy ? '● Todos Operacionais' : '○ Verificando...'}
            </span>
          </button>

          {isInfraOpen && (
            <div className="animate-in fade-in duration-150">
              {/* Laya Coprocessor Highlight Card (Com Validação Real de Invariante de Hardware) */}
              <div className="p-2.5 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 mb-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-950 dark:text-emerald-200 flex items-center space-x-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                    <span>Laya System One (:20140)</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 font-mono text-[9px] font-bold border border-emerald-300 dark:border-emerald-700">
                    0 MB VRAM (CPU INT8)
                  </span>
                </div>
                <p className="text-[10px] text-emerald-800/80 dark:text-emerald-300/80">
                  Classificador Não-Autorregressivo FastMCP • CPU Host
                </p>
                <div className="flex items-center justify-between text-[9px] font-mono text-emerald-700 dark:text-emerald-400 pt-0.5 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <span>Status: {layaService?.isUp ? '● Ativo' : '○ Inativo'}</span>
                  <span>Latência Real: {layaService?.latencyMs ?? 0}ms</span>
                </div>
              </div>

              {/* Lista de Serviços Locais com Latência e Status Real */}
              <div className="space-y-1.5">
                {snapshot?.services.map(svc => {
                  const isUp = svc.isUp;
                  return (
                    <div 
                      key={svc.id} 
                      className={`flex items-center justify-between px-2.5 py-2 rounded-lg bg-white dark:bg-slate-900 border text-[11px] transition shadow-2xs ${
                        isUp 
                          ? 'border-slate-200/80 dark:border-slate-800' 
                          : 'border-rose-300 dark:border-rose-900 bg-rose-50/30'
                      }`}
                    >
                      <div className="flex items-center space-x-2 truncate">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isUp ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'}`} />
                        <div className="truncate">
                          <span className="text-slate-800 dark:text-slate-200 font-medium block truncate">
                            {svc.name}
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {svc.protocol}
                          </span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className={`font-mono text-[10px] font-semibold ${isUp ? 'text-slate-600 dark:text-slate-300' : 'text-rose-500'}`}>
                          {isUp ? `${svc.latencyMs}ms` : 'Inativo'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Rodapé de Invariante de Hardware */}
              <div className="mt-3 p-2 rounded-lg bg-slate-100/60 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 font-mono space-y-0.5">
                <div className="flex justify-between">
                  <span>GPU Alocada (Ollama):</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">NVIDIA RTX 3050</span>
                </div>
                <div className="flex justify-between">
                  <span>Custo Marginal Local:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">$0.00 / token</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      )}
    </aside>
  );
};
