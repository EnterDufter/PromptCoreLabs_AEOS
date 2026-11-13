import React, { useState } from 'react';
import { Play, Code2, Download, RotateCcw, Copy, Check, ExternalLink, ShieldCheck } from 'lucide-react';

interface LiveHtmlSandboxCardProps {
  code: string;
  title?: string;
  initialHeight?: number;
}

export const LiveHtmlSandboxCard: React.FC<LiveHtmlSandboxCardProps> = ({
  code,
  title = 'Simulador Ao Vivo (Sandbox HTML5)',
  initialHeight = 280
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'code'>('live');
  const [iframeKey, setIframeKey] = useState(1);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `app-soberano-${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenNewWindow = () => {
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-cyan-800/60 bg-slate-950 text-slate-100 shadow-2xl text-xs">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-[11px]">
        <div className="flex items-center space-x-2 font-semibold text-slate-200 truncate">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400"></span>
          <span className="truncate">{title}</span>
          <span className="hidden sm:inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-700/60 font-mono text-[9px]">
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>Sandbox Local</span>
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab('live')}
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-semibold transition ${
                activeTab === 'live' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Ao Vivo</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1 px-2.5 py-0.5 rounded text-[10px] font-medium transition ${
                activeTab === 'code' ? 'bg-cyan-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Código HTML</span>
            </button>
          </div>

          <button
            onClick={() => setIframeKey(k => k + 1)}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Recarregar aplicação"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <button
            onClick={handleCopy}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
            title="Copiar código fonte"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          </button>

          <button
            onClick={handleDownloadHtml}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 transition text-[10px] font-semibold"
            title="Baixar arquivo HTML autocontido para rodar em qualquer máquina"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Baixar .html</span>
          </button>

          <button
            onClick={handleOpenNewWindow}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition"
            title="Abrir em nova aba"
          >
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Body */}
      {activeTab === 'live' ? (
        <div className="bg-slate-950 p-1">
          <iframe
            key={iframeKey}
            srcDoc={code}
            sandbox="allow-scripts allow-forms"
            style={{ width: '100%', height: `${initialHeight}px`, border: 'none', borderRadius: '8px' }}
            title={title}
          />
        </div>
      ) : (
        <pre className="p-3.5 overflow-x-auto font-mono text-[12px] leading-relaxed custom-scrollbar bg-slate-950 text-cyan-300 max-h-[350px]">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
};

