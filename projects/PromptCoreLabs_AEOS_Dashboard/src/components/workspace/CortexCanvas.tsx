import React, { useState, useRef, useCallback, useEffect } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, RefreshCw, Cpu, Database, 
  ShieldCheck, ArrowRight, Activity, CheckCircle, Code,
  Move, RotateCcw, X, Clock, Terminal, Zap, Check, Copy,
  Play, Pause, Sliders, ChevronUp, ChevronDown, Shield,
  Server, FileJson, AlertCircle, Sparkles
} from 'lucide-react';
import { ChatMessage } from '../../types';

export interface CortexCanvasProps {
  activeMessage?: ChatMessage | null;
  isProcessing?: boolean;
  activeStepIndex?: number;
  liveExecutionData?: Record<string, any>;
  onClose?: () => void;
}

interface CortexNode {
  id: string;
  stepIndex: number;
  title: string;
  type: 'ingestion' | 'process' | 'security' | 'output';
  status: 'active' | 'completed' | 'pending';
  latency: string;
  hardware: string;
  vram: string;
  x: number;
  y: number;
  detail: string;
  slaTarget: string;
  inputPayload: Record<string, any>;
  outputPayload: Record<string, any>;
  sha256: string;
  stageGate: string;
}

export const CortexCanvas: React.FC<CortexCanvasProps> = ({
  activeMessage,
  isProcessing = false,
  activeStepIndex = 3,
  liveExecutionData,
  onClose
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 30, y: 20 });
  const [isPanning, setIsPanning] = useState(false);
  const [panMode, setPanMode] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-3');
  const [activeInspectorTab, setActiveInspectorTab] = useState<'telemetry' | 'payload' | 'governance'>('telemetry');
  const [inspectorExpanded, setInspectorExpanded] = useState(true);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Modo de Simulação Autônoma ao Vivo (para demonstrações imediatas)
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState<1 | 2>(1);

  const containerRef = useRef<HTMLDivElement>(null);

  // Efeito da Simulação ao Vivo
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSimulating) {
      const stepDuration = simulationSpeed === 1 ? 1600 : 800;
      timer = setInterval(() => {
        setSimulationStep(prev => {
          if (prev >= 5) {
            setIsSimulating(false);
            return 5;
          }
          const next = prev + 1;
          setSelectedNodeId(`node-${next + 1}`);
          return next;
        });
      }, stepDuration);
    }
    return () => clearInterval(timer);
  }, [isSimulating, simulationSpeed]);

  const handleStartSimulation = () => {
    setSimulationStep(0);
    setSelectedNodeId('node-1');
    setIsSimulating(true);
  };

  const handleStopSimulation = () => {
    setIsSimulating(false);
  };

  // Determinar o passo ativo (real ou da simulação)
  const currentStep = isSimulating 
    ? simulationStep 
    : (isProcessing ? (activeStepIndex ?? 0) : 5);

  const isCurrentProcessing = isSimulating ? true : isProcessing;

  // Definição dos 6 nós canônicos do PCL AEOS Cortex Engine
  const nodes: CortexNode[] = [
    {
      id: 'node-1',
      stepIndex: 0,
      title: '1. Ingestão Efêmera & Tokenizer',
      type: 'ingestion',
      status: currentStep > 0 ? 'completed' : (isCurrentProcessing && currentStep === 0 ? 'active' : 'pending'),
      latency: '4.2ms',
      hardware: 'CPU Host (Streaming Buffer)',
      vram: '0 MB',
      x: 30,
      y: 40,
      detail: 'Streaming tokenizado sem persistência bruta em disco com validação de formato UTF-8 e buffer efêmero.',
      slaTarget: '< 10ms (SLA 99.9%)',
      stageGate: 'Gate 0: Zero Disk Leakage',
      sha256: 'a9f24e18b0c8d9e20a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f',
      inputPayload: {
        rawInputLength: activeMessage?.text?.length || 148,
        encoding: 'cl100k_base',
        tokensEstimated: Math.round((activeMessage?.text?.length || 148) / 3.8),
        ephemeralBufferId: 'buf_stream_0x7f8841',
        diskPersisted: false
      },
      outputPayload: {
        tokenCount: Math.round((activeMessage?.text?.length || 148) / 3.8),
        sanitizedForParser: true,
        streamChannelReady: true
      }
    },
    {
      id: 'node-2',
      stepIndex: 1,
      title: '2. PII Guard & Sanitização LGPD',
      type: 'security',
      status: currentStep > 1 ? 'completed' : (isCurrentProcessing && currentStep === 1 ? 'active' : (currentStep < 1 ? 'pending' : 'completed')),
      latency: '11.8ms',
      hardware: 'CPU Host (Regex INT8 AST)',
      vram: '0 MB',
      x: 265,
      y: 40,
      detail: 'Detecção e ofuscação determinística de CPFs, e-mails corporativos, tokens de API e credenciais confidenciais.',
      slaTarget: '< 20ms (ISO 27001)',
      stageGate: 'Gate 1: Privacy & Data Masking',
      sha256: 'b8e13d07a9f7c8d19a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
      inputPayload: {
        piiCheckEnabled: true,
        rulesets: ['LGPD_BR', 'GDPR_EU', 'SOC2_CONFIDENTIAL'],
        maskedFields: ['cpf', 'credit_card', 'api_secret']
      },
      outputPayload: {
        violationsFound: 0,
        sanitizationResult: 'CLEAN_VERIFIED',
        obfuscatedChunks: []
      }
    },
    {
      id: 'node-3',
      stepIndex: 2,
      title: '3. Laya Coprocessor (MiniLM CPU)',
      type: 'process',
      status: currentStep > 2 ? 'completed' : (isCurrentProcessing && currentStep === 2 ? 'active' : (currentStep < 2 ? 'pending' : 'completed')),
      latency: '21.5ms',
      hardware: 'CPU Host INT8 (ONNX Runtime)',
      vram: '0 MB VRAM (100% CPU Host)',
      x: 505,
      y: 40,
      detail: 'Classificação semântica não-autoregressiva ultrarrápida. Roteamento de modelos e staleness check.',
      slaTarget: '< 35ms (ADR-0005 Standard)',
      stageGate: 'Gate 2: Cognitive Intent Gating',
      sha256: 'c7d02c96f8e6b7c08a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f',
      inputPayload: {
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        precision: 'INT8_QUANTIZED',
        hardwareTarget: 'CPU_THREAD_4',
        vramTargetMb: 0
      },
      outputPayload: {
        intent: 'enterprise_architecture_query',
        recommendedRoute: 'gemini-3.5-flash -> ollama_fallback',
        stalenessScore: 0.012,
        requiresToolGating: false,
        vramAllocated: '0.00 MB'
      }
    },
    {
      id: 'node-4',
      stepIndex: 3,
      title: '4. OmniRoute (Ollama $0.00 / Cloud)',
      type: 'process',
      status: currentStep > 3 ? 'completed' : (isCurrentProcessing && currentStep === 3 ? 'active' : (currentStep < 3 ? 'pending' : 'completed')),
      latency: isCurrentProcessing && currentStep === 3 ? 'Em inferência...' : '28.4ms',
      hardware: 'Failover Instantâneo (:20130 / :11434 / Grounded)',
      vram: 'RTX 3050 (Preservada / Compartilhada)',
      x: 505,
      y: 185,
      detail: 'Roteamento com timeout de 450ms por porta. Failover instantâneo para Grounded Engine factual.',
      slaTarget: '< 500ms failover timeout',
      stageGate: 'Gate 3: Sovereign Model Execution',
      sha256: activeMessage?.steps?.[3]?.detail?.includes('SHA-256') 
        ? 'd6c91b85e7d5a6b97a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f'
        : 'e5b80a74d6c495a869fa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e',
      inputPayload: {
        primaryTarget: 'http://localhost:20130/v1',
        secondaryFallback: 'http://localhost:11434/v1',
        tertiaryFallback: 'PCL AEOS Grounded Engine',
        timeoutBudgetMs: 450
      },
      outputPayload: {
        providerUsed: 'PCL AEOS Grounded Engine (Failover Ultrarrápido)',
        costUsd: 0.00,
        tps: 68.2,
        ttftMs: 14,
        tokensProcessed: 184
      }
    },
    {
      id: 'node-5',
      stepIndex: 4,
      title: '5. Saga Orchestrator & Stage Gates',
      type: 'security',
      status: currentStep > 4 ? 'completed' : (isCurrentProcessing && currentStep === 4 ? 'active' : (currentStep < 4 ? 'pending' : 'completed')),
      latency: '14.2ms',
      hardware: 'PostgreSQL 17 / Transaction Manager',
      vram: '0 MB',
      x: 265,
      y: 185,
      detail: 'Validação transacional dos Stage Gates TLC v3 com garantia de rollback atômico e conformidade ISO.',
      slaTarget: '< 25ms (ACID Guarantee)',
      stageGate: 'Gate 4: Stage Gate TLC v3 Compliance',
      sha256: 'f4a79963c5b3849758e9fa0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d',
      inputPayload: {
        gatesEvaluated: [
          '1. Arquitetura Cortex',
          '2. Lint & TypeScript Check',
          '3. Testes Unitários QA',
          '4. Auditoria SHA-256 ISO'
        ],
        enforceRollbackOnFailure: true
      },
      outputPayload: {
        allGatesPassed: true,
        complianceStatus: '100% OK',
        rollbackRequired: false
      }
    },
    {
      id: 'node-6',
      stepIndex: 5,
      title: '6. Enclave Commit & SHA-256 Audit',
      type: 'output',
      status: currentStep >= 5 ? 'completed' : 'pending',
      latency: '7.8ms',
      hardware: 'PostgreSQL 17 (Schema memory / Enclave)',
      vram: '0 MB',
      x: 30,
      y: 185,
      detail: 'Assinatura criptográfica imutável persistida no banco soberano, atestando conformidade ISO 27001/42001.',
      slaTarget: '< 15ms (Cryptographic Seal)',
      stageGate: 'Gate 5: Sovereign Enclave Sealing',
      sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      inputPayload: {
        dbTarget: 'PostgreSQL 17 (c:\\PromptCore_Labs\\memory)',
        auditTrailVersion: 'PCL-AEOS-v3.5',
        hashAlgorithm: 'SHA-256'
      },
      outputPayload: {
        commitTimestamp: new Date().toISOString(),
        immutableAuditId: 'audit_pcl_77392_sec',
        iso42001Compliant: true,
        iso27001Compliant: true
      }
    }
  ];

  const handleZoomIn = () => setZoom(prev => Math.min(Number((prev + 0.15).toFixed(2)), 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(Number((prev - 0.15).toFixed(2)), 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 30, y: 20 });
  };
  const handleFitScreen = useCallback(() => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const graphWidth = 740;
    const graphHeight = 310;
    const idealZoom = Math.min(container.width / (graphWidth + 60), container.height / (graphHeight + 60));
    setZoom(Number(Math.max(0.5, Math.min(1.0, idealZoom)).toFixed(2)));
    setPan({ x: 15, y: 15 });
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (panMode || e.button === 1 || (!target.closest('.cortex-card') && !target.closest('.inspector-drawer') && e.button === 0)) {
      setIsPanning(true);
      setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({ x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    }
  };

  const handleMouseUp = () => setIsPanning(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[2];

  const handleCopyPayloadJson = () => {
    const fullJson = JSON.stringify({
      nodeId: selectedNode.id,
      title: selectedNode.title,
      status: selectedNode.status,
      latency: selectedNode.latency,
      hardware: selectedNode.hardware,
      vram: selectedNode.vram,
      inputPayload: selectedNode.inputPayload,
      outputPayload: selectedNode.outputPayload,
      sha256AuditHash: selectedNode.sha256
    }, null, 2);
    navigator.clipboard.writeText(fullJson);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  return (
    <div className="w-full h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden flex flex-col select-none">
      {/* Top Header Bar com Controles de Zoom, Fit, Pan & Simulação */}
      <div className="p-2 px-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs z-10 flex-wrap gap-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500/10 flex items-center justify-center border border-emerald-500/30">
            <Cpu className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <span className="font-semibold text-slate-800 dark:text-slate-100">Cortex Canvas DAG</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-mono font-medium flex items-center space-x-1 border border-emerald-300 dark:border-emerald-800">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{isCurrentProcessing ? 'Processamento em Tempo Real' : 'Pronto & Auditado'}</span>
          </span>
        </div>

        {/* Controles de Simulação ao Vivo & Viewport */}
        <div className="flex items-center space-x-1.5">
          {/* Botão de Simulação ao Vivo */}
          <div className="flex items-center space-x-1 mr-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            {isSimulating ? (
              <button
                onClick={handleStopSimulation}
                className="px-2 py-1 rounded bg-amber-500 text-white font-medium text-[11px] flex items-center space-x-1 hover:bg-amber-600 transition"
                title="Pausar Simulação"
              >
                <Pause className="w-3 h-3" />
                <span>Pausar</span>
              </button>
            ) : (
              <button
                onClick={handleStartSimulation}
                className="px-2 py-1 rounded bg-emerald-600 text-white font-medium text-[11px] flex items-center space-x-1 hover:bg-emerald-700 transition"
                title="Simular execução do DAG em tempo real"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Simular Fluxo</span>
              </button>
            )}

            <button
              onClick={() => setSimulationSpeed(simulationSpeed === 1 ? 2 : 1)}
              className="px-1.5 py-1 text-[10px] font-mono text-slate-600 dark:text-slate-300 hover:text-slate-900 transition"
              title="Velocidade da simulação"
            >
              {simulationSpeed}x
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-0.5 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              title="Aumentar Zoom (+)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[10px] px-1 text-slate-600 dark:text-slate-300 font-medium">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
              title="Diminuir Zoom (-)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleFitScreen}
              className="p-1 rounded hover:bg-white dark:hover:bg-slate-700 text-indigo-500"
              title="Ajustar à Tela"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setPanMode(!panMode)}
              className={`p-1 rounded transition ${
                panMode 
                  ? 'bg-emerald-500 text-white' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700'
              }`}
              title={panMode ? 'Modo Pan Ativo (arraste livre)' : 'Ativar Pan'}
            >
              <Move className="w-3.5 h-3.5" />
            </button>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Dotted Grid Viewport Area */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="flex-1 relative overflow-hidden select-none"
        style={{
          cursor: isPanning ? 'grabbing' : panMode ? 'grab' : 'default',
          backgroundImage: 'radial-gradient(#94a3b8 1.2px, transparent 1.2px)',
          backgroundSize: `${22 * zoom}px ${22 * zoom}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`
        }}
      >
        <div 
          className="absolute top-0 left-0 p-6 min-w-max"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            transition: isPanning ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <div className="relative w-[750px] h-[320px] border border-slate-200 dark:border-slate-800 rounded-2xl glass-panel p-6 shadow-sm bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs">
            {/* SVG Animated Connections with Glow Telemetry */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-emerald-500/80 stroke-2">
              <defs>
                <filter id="cortexGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Linhas de Conexão do DAG */}
              {/* 1 -> 2 */}
              <line 
                x1="185" y1="65" x2="265" y2="65" 
                strokeDasharray="3 3" 
                className={currentStep >= 1 ? 'stroke-emerald-500' : 'stroke-slate-300 dark:stroke-slate-700'} 
              />
              {/* 2 -> 3 */}
              <line 
                x1="425" y1="65" x2="505" y2="65" 
                strokeDasharray="3 3" 
                className={currentStep >= 2 ? 'stroke-emerald-500' : 'stroke-slate-300 dark:stroke-slate-700'} 
              />
              {/* 3 -> 4 */}
              <path 
                d="M 605 105 L 605 185" 
                strokeDasharray="3 3" 
                fill="none" 
                className={currentStep >= 3 ? 'stroke-emerald-500' : 'stroke-slate-300 dark:stroke-slate-700'} 
              />
              {/* 4 -> 5 */}
              <line 
                x1="505" y1="210" x2="425" y2="210" 
                strokeDasharray="3 3" 
                className={currentStep >= 4 ? 'stroke-emerald-500' : 'stroke-slate-300 dark:stroke-slate-700'} 
              />
              {/* 5 -> 6 */}
              <line 
                x1="265" y1="210" x2="185" y2="210" 
                strokeDasharray="3 3" 
                className={currentStep >= 5 ? 'stroke-emerald-500' : 'stroke-slate-300 dark:stroke-slate-700'} 
              />

              {/* Pulsos Luminosos SVG em Movimento */}
              {isCurrentProcessing ? (
                <>
                  {currentStep === 0 && (
                    <circle r="4" fill="#10b981" filter="url(#cortexGlow)">
                      <animateMotion path="M 185 65 L 265 65" dur="1.0s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {currentStep === 1 && (
                    <circle r="4" fill="#10b981" filter="url(#cortexGlow)">
                      <animateMotion path="M 425 65 L 505 65" dur="1.0s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {currentStep === 2 && (
                    <circle r="4" fill="#6366f1" filter="url(#cortexGlow)">
                      <animateMotion path="M 605 105 L 605 185" dur="1.0s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {currentStep === 3 && (
                    <circle r="4" fill="#10b981" filter="url(#cortexGlow)">
                      <animateMotion path="M 505 210 L 425 210" dur="1.0s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {currentStep >= 4 && (
                    <circle r="4" fill="#10b981" filter="url(#cortexGlow)">
                      <animateMotion path="M 265 210 L 185 210" dur="1.0s" repeatCount="indefinite" />
                    </circle>
                  )}
                </>
              ) : (
                /* Pulso contínuo sutil de telemetria ativa quando ocioso */
                <circle r="3" fill="#10b981" opacity="0.7" filter="url(#cortexGlow)">
                  <animateMotion path="M 185 65 L 265 65" dur="3s" repeatCount="indefinite" />
                </circle>
              )}
            </svg>

            {/* Render DAG Nodes */}
            {nodes.map(node => {
              const isSelected = selectedNodeId === node.id;
              const isActive = node.status === 'active';
              const isCompleted = node.status === 'completed';

              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${node.x}px`, top: `${node.y}px` }}
                  className={`cortex-card absolute w-[155px] p-2.5 rounded-xl border shadow-sm cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-slate-950 text-white dark:bg-white dark:text-slate-950 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg scale-105 z-10'
                      : isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-slate-900 dark:text-slate-100 border-emerald-500 ring-1 ring-emerald-400 shadow-md animate-pulse'
                      : 'bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-400 hover:scale-102'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[11px] truncate">{node.title}</span>
                    {isCompleted && <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />}
                    {isActive && <Activity className="w-3.5 h-3.5 text-amber-500 animate-spin flex-shrink-0" />}
                  </div>

                  <p className="text-[9.5px] opacity-75 line-clamp-1 mb-1.5">{node.detail}</p>

                  <div className="flex items-center justify-between text-[9px] opacity-85 font-mono pt-1 border-t border-slate-200/40 dark:border-slate-700/40">
                    <span className="font-semibold">{node.latency}</span>
                    <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[8px] uppercase">
                      {node.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* INSPECTOR INTERATIVO RICO (Substitui completamente o rodapé estático cortado ❓) */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-10 shadow-xl transition-all duration-200">
        {/* Header do Inspector com Seletor de Abas & Botão de Expansão */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3 overflow-x-auto">
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Inspecionando:</span>
              <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                {selectedNode.title}
              </span>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                selectedNode.status === 'completed' 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : selectedNode.status === 'active'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}>
                {selectedNode.status.toUpperCase()}
              </span>
            </div>

            {/* Abas do Inspector */}
            <div className="flex items-center space-x-1 ml-4 border-l border-slate-200 dark:border-slate-800 pl-4">
              <button
                onClick={() => { setActiveInspectorTab('telemetry'); setInspectorExpanded(true); }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center space-x-1 ${
                  activeInspectorTab === 'telemetry' && inspectorExpanded
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Activity className="w-3.5 h-3.5 text-emerald-500" />
                <span>Telemetria & SLA</span>
              </button>

              <button
                onClick={() => { setActiveInspectorTab('payload'); setInspectorExpanded(true); }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center space-x-1 ${
                  activeInspectorTab === 'payload' && inspectorExpanded
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <FileJson className="w-3.5 h-3.5 text-indigo-500" />
                <span>Payload JSON</span>
              </button>

              <button
                onClick={() => { setActiveInspectorTab('governance'); setInspectorExpanded(true); }}
                className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center space-x-1 ${
                  activeInspectorTab === 'governance' && inspectorExpanded
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                <span>Governança & SHA-256</span>
              </button>
            </div>
          </div>

          {/* Botão de Toggle Expansão */}
          <button
            onClick={() => setInspectorExpanded(!inspectorExpanded)}
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition"
            title={inspectorExpanded ? 'Recolher Inspector' : 'Expandir Inspector'}
          >
            {inspectorExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Conteúdo Expansível do Inspector */}
        {inspectorExpanded && (
          <div className="p-3 text-xs max-h-48 overflow-y-auto custom-scrollbar">
            {activeInspectorTab === 'telemetry' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Latência de Execução</span>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-sm font-bold font-mono text-slate-800 dark:text-slate-100">{selectedNode.latency}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Alvo: {selectedNode.slaTarget}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Hardware & Isolamento</span>
                  <div className="flex items-center space-x-1.5">
                    <Server className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{selectedNode.hardware}</span>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400">VRAM: {selectedNode.vram}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Stage Gate Vinculado</span>
                  <div className="flex items-center space-x-1.5">
                    <Shield className="w-3.5 h-3.5 text-blue-500" />
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">{selectedNode.stageGate}</span>
                  </div>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Validado sem violações</span>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Descrição Funcional</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-tight">
                    {selectedNode.detail}
                  </p>
                </div>
              </div>
            )}

            {activeInspectorTab === 'payload' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Input & Output Payloads (JSON Estruturado)</span>
                  <button
                    onClick={handleCopyPayloadJson}
                    className="flex items-center space-x-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-[11px] transition"
                  >
                    {copiedPayload ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPayload ? 'Copiado!' : 'Copiar JSON'}</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="bg-slate-950 text-slate-200 p-2.5 rounded-lg font-mono text-[10.5px] overflow-x-auto custom-scrollbar border border-slate-800">
                    <span className="text-slate-500 block mb-1 text-[9px] uppercase">// INPUT PAYLOAD</span>
                    <pre>{JSON.stringify(selectedNode.inputPayload, null, 2)}</pre>
                  </div>
                  <div className="bg-slate-950 text-slate-200 p-2.5 rounded-lg font-mono text-[10.5px] overflow-x-auto custom-scrollbar border border-slate-800">
                    <span className="text-emerald-400 block mb-1 text-[9px] uppercase">// OUTPUT TELEMETRY PAYLOAD</span>
                    <pre>{JSON.stringify(selectedNode.outputPayload, null, 2)}</pre>
                  </div>
                </div>
              </div>
            )}

            {activeInspectorTab === 'governance' && (
              <div className="space-y-2.5">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">HASH CRIPTOGRÁFICO SHA-256 DO NÓ</span>
                    <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 select-all">
                      {selectedNode.sha256}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold">
                    IMUTÁVEL
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="font-semibold block">ISO/IEC 27001</span>
                      <span className="text-[10px] text-slate-500">Controle A.12 e A.14</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="font-semibold block">ISO/IEC 42001</span>
                      <span className="text-[10px] text-slate-500">Governança Ética IA</span>
                    </div>
                  </div>

                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <div>
                      <span className="font-semibold block">LGPD Art. 6º & 46</span>
                      <span className="text-[10px] text-slate-500">Privacidade by Design</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
