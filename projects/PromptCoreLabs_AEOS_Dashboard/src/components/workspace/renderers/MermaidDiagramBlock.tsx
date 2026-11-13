import React, { useState, useEffect, useRef } from 'react';
import { Eye, Code2, ZoomIn, ZoomOut, RotateCcw, Download, Check, Copy, AlertTriangle } from 'lucide-react';

interface MermaidDiagramBlockProps {
  code: string;
  title?: string;
}

export const MermaidDiagramBlock: React.FC<MermaidDiagramBlockProps> = ({ code, title = 'Diagrama Mermaid / Cortex v7' }) => {
  const [activeTab, setActiveTab] = useState<'diagram' | 'code'>('diagram');
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [renderError, setRenderError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;

    async function renderMermaid() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: '#070d19',
            primaryColor: '#0c4a6e',
            primaryTextColor: '#f8fafc',
            primaryBorderColor: '#38bdf8',
            lineColor: '#94a3b8',
            secondaryColor: '#064e3b',
            tertiaryColor: '#1e1b4b'
          },
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif'
        });

        // Limpeza preventiva de possíveis caracteres que causam syntax error no Mermaid
        let cleanCode = code.trim();
        if (!cleanCode.startsWith('graph') && !cleanCode.startsWith('flowchart') && !cleanCode.startsWith('sequenceDiagram') && !cleanCode.startsWith('classDiagram') && !cleanCode.startsWith('stateDiagram')) {
          cleanCode = `flowchart LR\n${cleanCode}`;
        }

        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        const { svg } = await mermaid.render(id, cleanCode);
        if (isMounted) {
          // Garante largura e altura responsiva sem clipping
          const responsiveSvg = svg.replace(/<svg\s+([^>]*?)>/i, '<svg $1 style="max-width: 100%; height: auto; display: block; margin: 0 auto;">');
          setSvgHtml(responsiveSvg);
          setRenderError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          console.warn('Falha na compilação do Mermaid:', err);
          setRenderError(err?.message || 'Erro de sintaxe no código Mermaid');
          setActiveTab('code'); // Mostra o código para o usuário inspecionar
        }
      }
    }

    renderMermaid();
    return () => { isMounted = false; };
  }, [code]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgHtml) return;
    const blob = new Blob([svgHtml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagrama-${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 text-slate-100 shadow-xl text-xs">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-[11px]">
        <div className="flex items-center space-x-2 font-semibold text-slate-200 truncate">
          <span className="w-2 h-2 rounded-full bg-sky-400"></span>
          <span className="truncate">{title}</span>
        </div>

        <div className="flex items-center space-x-1.5">
          <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveTab('diagram')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium transition ${
                activeTab === 'diagram' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Diagrama</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium transition ${
                activeTab === 'code' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Código</span>
            </button>
          </div>

          {activeTab === 'diagram' && svgHtml && (
            <div className="flex items-center space-x-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.5))}
                className="p-1 text-slate-400 hover:text-slate-200 rounded"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
                className="p-1 text-slate-400 hover:text-slate-200 rounded"
                title="Diminuir Zoom"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1 text-slate-400 hover:text-slate-200 rounded"
                title="Resetar Zoom"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition text-[10px]"
            title="Copiar código Mermaid"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar'}</span>
          </button>

          {svgHtml && (
            <button
              onClick={handleDownloadSvg}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 transition text-[10px] font-semibold"
              title="Baixar diagrama em arquivo SVG vetorial"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Baixar .SVG</span>
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo Renderizado */}
      {activeTab === 'diagram' ? (
        <div 
          ref={containerRef}
          className="p-4 bg-slate-950/90 overflow-x-auto min-h-[140px] flex items-center justify-center relative custom-scrollbar"
        >
          {svgHtml ? (
            <div 
              style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
              className="w-full max-w-full flex justify-center"
              dangerouslySetInnerHTML={{ __html: svgHtml }} 
            />
          ) : renderError ? (
            <div className="flex flex-col items-center justify-center p-6 text-center text-amber-400 space-y-2">
              <AlertTriangle className="w-6 h-6" />
              <p className="font-semibold text-xs">Não foi possível renderizar o diagrama automaticamente.</p>
              <p className="text-[11px] text-slate-400 max-w-md">{renderError}</p>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-slate-400 py-6">
              <div className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs">Renderizando fluxograma vetorial Cortex...</span>
            </div>
          )}
        </div>
      ) : (
        <pre className="p-3.5 overflow-x-auto font-mono text-[12px] leading-relaxed custom-scrollbar bg-slate-950 text-emerald-300/90">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
};

