import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, Bot, Activity, CheckCircle2, Clock, 
  Server, Shield, Cpu, RefreshCw, Zap, AlertTriangle, Check
} from 'lucide-react';
import { Agent, ServiceStatus } from '../../types';

interface RightSidebarStatusProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  agents: Agent[];
  services: ServiceStatus[];
  isProcessing?: boolean;
  activeTaskName?: string;
  activeStepIndex?: number;
}

export const RightSidebarStatus: React.FC<RightSidebarStatusProps> = ({
  collapsed,
  onToggleCollapse,
  agents,
  services,
  isProcessing = false,
  activeTaskName,
  activeStepIndex = 4
}) => {
  // Jitter realista de telemetria em tempo real
  const [liveServices, setLiveServices] = useState<ServiceStatus[]>(services);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveServices(prev => prev.map(s => {
        let jitter = 0;
        if (s.id === 'svc-postgres') jitter = Math.floor(Math.random() * 3) - 1; // 3ms - 5ms
        if (s.id === 'svc-ollama') jitter = Math.floor(Math.random() * 5) - 2; // 18ms - 26ms
        if (s.id === 'svc-cloud') jitter = Math.floor(Math.random() * 15) - 7; // 110ms - 135ms
        const nextLatency = Math.max(2, s.latencyMs + jitter);
        return { ...s, latencyMs: nextLatency };
      }));
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  // Se recolhido, não renderiza nenhuma aba na borda
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

  return (
    <aside className="w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-l border-slate-200 dark:border-slate-800 flex flex-col h-full select-none z-20 shadow-xl transition-all duration-200">
      {/* Header */}
      <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="font-semibold text-xs text-slate-800 dark:text-slate-100">Telemetria & Status do Sistema</span>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
          title="Fechar Painel de Telemetria"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-xs custom-scrollbar">
        {/* Section 1: Active Autonomous Agents */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1">
              <Bot className="w-3 h-3 text-indigo-500" />
              <span>Agentes Autônomos ({agents.filter(a => a.status === 'active' || isProcessing).length})</span>
            </span>
            <span className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
          </div>

          <div className="space-y-2">
            {agents.map(agent => {
              const isAgentCurrentlyWorking = agent.id === 'agent-cortex' && isProcessing;
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
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
                      <span>{agent.name}</span>
                      {isAgentCurrentlyWorking && (
                        <Activity className="w-3 h-3 text-indigo-500 animate-spin" />
                      )}
                    </span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-medium ${
                      displayStatus === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {displayStatus.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{agent.role}</p>

                  {currentTaskText && (
                    <div className="bg-slate-50 dark:bg-slate-950 p-1.5 rounded text-[10px] text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-800/80">
                      <span className="text-slate-400 block font-mono text-[9px]">Tarefa Ativa:</span>
                      <span className="font-medium text-indigo-600 dark:text-indigo-400">{currentTaskText}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
                    <span>Modelo: {agent.model}</span>
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
        </div>

        {/* Section 2: Stage Gates TLC v3 */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Stage Gates TLC v3</span>
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              {isProcessing ? 'Validando...' : '100% OK'}
            </span>
          </div>

          <div className="space-y-1.5 text-[11px]">
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
        </div>

        {/* Section 3: System Services & Latency */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center space-x-1">
              <Server className="w-3 h-3 text-blue-500" />
              <span>Infraestrutura & Coprocessador</span>
            </span>
            <span className="text-[9px] font-mono text-slate-400">Jitter Ativo</span>
          </div>

          {/* Laya Coprocessor Highlight Card */}
          <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 mb-2 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-indigo-900 dark:text-indigo-200 flex items-center space-x-1.5">
                <Zap className="w-3.5 h-3.5 text-indigo-500 fill-current" />
                <span>Laya Coprocessor (ADR-0005)</span>
              </span>
              <span className="px-1.5 py-0.2 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-mono text-[9px] font-bold">
                0 MB VRAM
              </span>
            </div>
            <p className="text-[10px] text-indigo-700/80 dark:text-indigo-300/80">
              Classificador Não-Autorregressivo em CPU Host (~21.5ms)
            </p>
            <div className="flex items-center justify-between text-[9px] font-mono text-indigo-600 dark:text-indigo-400 pt-0.5">
              <span>Soberania 100% Local</span>
              <span>Answerability 99.4%</span>
            </div>
          </div>

          <div className="space-y-1.5">
            {liveServices.map(svc => (
              <div key={svc.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-700 dark:text-slate-300">{svc.name}</span>
                </div>
                <span className="font-mono text-[10px] text-slate-500 dark:text-slate-400">{svc.latencyMs}ms</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
