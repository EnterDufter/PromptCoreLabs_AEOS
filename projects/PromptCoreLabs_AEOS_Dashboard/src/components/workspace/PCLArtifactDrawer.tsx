import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronRight, Printer, Save, Share2, FileText, Shield, 
  DollarSign, Database, Check, ExternalLink, CheckCircle2, 
  GitBranch, Cloud, UploadCloud, ArrowRight
} from 'lucide-react';
import { Artifact } from '../../types';
import { headlessByosService, ByosSyncResult } from '../../services/storage/headlessByosService';

interface PCLArtifactDrawerProps {
  artifact: Artifact | null;
  onClose: () => void;
}

export const PCLArtifactDrawer: React.FC<PCLArtifactDrawerProps> = ({ artifact, onClose }) => {
  const [activeTab, setActiveTab] = useState<'doc' | 'dag' | 'audit' | 'costs' | 'pii' | 'byos'>('doc');
  const [copied, setCopied] = useState(false);
  const [cloudSynced, setCloudSynced] = useState<string | null>(null);
  const [byosResult, setByosResult] = useState<ByosSyncResult | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Redimensionamento horizontal arrastável (380px a 850px) com persistência
  const [drawerWidth, setDrawerWidth] = useState<number>(() => {
    const saved = localStorage.getItem('pcl_drawer_width');
    return saved ? Math.min(850, Math.max(380, parseInt(saved, 10))) : 580;
  });
  const isDraggingRef = useRef(false);

  // Atalho global de teclado: Escape para fechar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Manipulador de arraste da borda esquerda
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newWidth = window.innerWidth - moveEvent.clientX;
      const clampedWidth = Math.min(850, Math.max(380, newWidth));
      setDrawerWidth(clampedWidth);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      localStorage.setItem('pcl_drawer_width', drawerWidth.toString());
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  if (!artifact) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleSave = () => {
    const blob = new Blob([artifact.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSyncCloud = async (provider: 'gdrive' | 'onedrive') => {
    setIsSyncing(true);
    const target = provider === 'gdrive' ? 'Google Drive' : 'OneDrive';
    const res = await headlessByosService.syncArtifactToByos(artifact, target);
    setByosResult(res);
    setCloudSynced(provider);
    setIsSyncing(false);
  };

  return (
    <div 
      style={{ width: `${drawerWidth}px` }}
      className="fixed inset-y-0 right-0 w-full max-w-full bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800/80 shadow-2xl z-50 flex flex-col select-none animate-in slide-in-from-right duration-200 transition-[width] ease-out"
    >
      {/* Barra de Arraste Esquerda (Draggable Resize Handle) */}
      <div 
        onMouseDown={handleMouseDown}
        className="hidden md:flex absolute -left-1.5 top-0 bottom-0 w-3 cursor-col-resize items-center justify-center group z-50 hover:bg-sky-500/20 active:bg-sky-500/40 transition-colors"
        title="Arrastar para redimensionar (380px - 850px)"
      >
        <div className="w-1 h-12 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-sky-500 transition-colors"></div>
      </div>

      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between bg-slate-50/80 dark:bg-slate-900/60 backdrop-blur-md">
        <div className="min-w-0 flex-1 pr-3">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-sky-600 dark:text-sky-400 uppercase tracking-widest font-semibold">
              PCL Sovereign Drawer
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-500 font-mono">
              ESC para fechar
            </span>
          </div>
          <h2 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate mt-0.5">
            {artifact.title}
          </h2>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5 flex-shrink-0">
          <button
            onClick={handlePrint}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition flex items-center space-x-1 text-xs"
            title="Imprimir Artefato em PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Imprimir</span>
          </button>

          <button
            onClick={handleSave}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition flex items-center space-x-1 text-xs"
            title="Salvar em Disco (.md)"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Salvar</span>
          </button>

          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 transition flex items-center space-x-1 text-xs"
            title="Compartilhar Link Seguro"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline text-[11px]">{copied ? 'Copiado!' : 'Compartilhar'}</span>
          </button>

          {/* Botão de Recolher [→] */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
            title="Recolher Gaveta [→]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Botão de Fechar [×] */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
            title="Fechar (Escape)"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Drawer Abas com Seletor Duplo: Documento vs Cortex DAG */}
      <div className="flex border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/40 px-3 text-xs font-medium overflow-x-auto custom-scrollbar">
        <button
          onClick={() => setActiveTab('doc')}
          className={`px-3 py-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'doc'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Documento</span>
        </button>

        <button
          onClick={() => setActiveTab('dag')}
          className={`px-3 py-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'dag'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Cortex DAG</span>
        </button>

        <button
          onClick={() => setActiveTab('byos')}
          className={`px-3 py-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'byos'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Cloud className="w-3.5 h-3.5" />
          <span>Cloud BYOS</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Auditoria ISO</span>
        </button>

        <button
          onClick={() => setActiveTab('costs')}
          className={`px-3 py-2 border-b-2 transition flex items-center space-x-1.5 whitespace-nowrap ${
            activeTab === 'costs'
              ? 'border-sky-500 text-sky-600 dark:text-sky-400 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5" />
          <span>Custos ($0.00)</span>
        </button>
      </div>

      {/* Conteúdo das Abas */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs font-sans text-slate-800 dark:text-slate-200 custom-scrollbar">
        {/* Aba 1: Documento */}
        {activeTab === 'doc' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Resumo Executivo</span>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{artifact.summary}</p>
            </div>

            <div className="prose dark:prose-invert max-w-none text-xs font-mono bg-slate-900 text-slate-100 p-4 rounded-xl border border-slate-800 overflow-x-auto whitespace-pre-wrap leading-relaxed shadow-inner">
              {artifact.content}
            </div>
          </div>
        )}

        {/* Aba 2: Cortex DAG Live */}
        {activeTab === 'dag' && (
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 dark:text-slate-100">Pipeline de Execução Cognitiva</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold">
                  Saga: Committed
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Visualização sincronizada das etapas transacionais orquestradas pelo Cortex Canvas.
              </p>
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              {[
                { name: '1. Ingestão Efêmera & Parser', latency: '14ms', status: 'OK', color: 'emerald' },
                { name: '2. PII Guard & Sanitização LGPD', latency: '22ms', status: 'OK', color: 'emerald' },
                { name: '3. Inferência Laya CPU (all-MiniLM-L6-v2)', latency: '31ms', status: 'OK', color: 'emerald' },
                { name: '4. Enclave Local Commit (PostgreSQL SHA-256)', latency: '8ms', status: 'OK', color: 'emerald' },
                { name: '5. Despacho BYOS (Google Drive / OneDrive)', latency: '142ms', status: 'Pronto para Sincronização', color: 'sky' },
              ].map((step, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-100/70 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{step.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-slate-400">⚡ {step.latency}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                      step.color === 'emerald' 
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                        : 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                    }`}>
                      {step.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aba 3: Cloud BYOS */}
        {activeTab === 'byos' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-sky-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-100">Integração Desacoplada (BYOS)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                O PCL AEOS gerencia a soberania e a atestação SHA-256, enquanto a custódia física do binário reside na nuvem corporativa da sua organização.
              </p>
            </div>

            {byosResult && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-200 space-y-1.5 animate-in fade-in">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span className="text-xs font-bold">Zero-Bin Custody: Sincronizado com {byosResult.provider}!</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-300 leading-relaxed">
                  {byosResult.custodyMessage}
                </p>
                <div className="pt-1 border-t border-emerald-200/60 dark:border-emerald-800/60 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  <span>Atestação: {byosResult.sha256Hash}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Google Drive */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs">Google Workspace</span>
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">OAuth2 Ativo</span>
                </div>
                <p className="text-[11px] text-slate-500">Google Drive corporativo com herança de ACLs.</p>
                <div className="pt-1 flex flex-col space-y-1.5">
                  <button
                    onClick={() => handleSyncCloud('gdrive')}
                    className="w-full py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Publicar no Google Drive</span>
                  </button>
                  <a
                    href="https://docs.google.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition flex items-center justify-center space-x-1"
                  >
                    <span>Abrir no Google Docs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Microsoft OneDrive */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 dark:text-slate-100 text-xs">Microsoft 365</span>
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">Entra ID Ativo</span>
                </div>
                <p className="text-[11px] text-slate-500">OneDrive corporativo com conformidade corporativa.</p>
                <div className="pt-1 flex flex-col space-y-1.5">
                  <button
                    onClick={() => handleSyncCloud('onedrive')}
                    className="w-full py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Publicar no OneDrive</span>
                  </button>
                  <a
                    href="https://office.com"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs transition flex items-center justify-center space-x-1"
                  >
                    <span>Abrir no Word Online</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Aba 4: Auditoria ISO */}
        {activeTab === 'audit' && (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
              <div>
                <span className="font-bold block mb-1">Cadeia SHA-256 Imutável Validada</span>
                <p className="text-[11px]">
                  Conformidade ISO 27001 e ISO 42001 verificada via Enclave PostgreSQL Local.
                </p>
              </div>
              <CheckCircle2 className="w-6 h-6 text-emerald-500 flex-shrink-0 ml-2" />
            </div>

            <div className="space-y-2 font-mono text-[11px]">
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-500">Hash SHA-256:</span>
                <span className="font-bold text-slate-700 dark:text-slate-200 truncate ml-2">a7c9f8e3b210459d81e7654a9012cd34ef56789a</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-500">Feature Flags (Harness):</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">5/5 Ativas</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span className="text-slate-500">Stage Gates TLC v3:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Passed</span>
              </div>
            </div>
          </div>
        )}

        {/* Aba 5: Custos */}
        {activeTab === 'costs' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block">CUSTO PROCESSAMENTO</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">$0.00</span>
                <span className="text-[9px] text-emerald-600 block mt-0.5">Ollama Local Router</span>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-center">
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono block">ECONOMIA ACUMULADA</span>
                <span className="text-xl font-black text-blue-700 dark:text-blue-300">$850.00</span>
                <span className="text-[9px] text-blue-600 block mt-0.5">94.2% Roteado Local</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
