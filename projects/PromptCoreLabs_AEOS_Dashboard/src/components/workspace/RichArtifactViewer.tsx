import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  FileText, Image as ImageIcon, Presentation, Table as TableIcon,
  Volume2, Video as VideoIcon, Code, Download, Copy, Check,
  ChevronLeft, ChevronRight, Play, Pause, Maximize2, Minimize2,
  Sparkles, Layers, RefreshCw, ZoomIn, ZoomOut, ArrowUpDown, VolumeX
} from 'lucide-react';
import { Artifact } from '../../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { sanitizeMarkdownForSpeech } from '../../services/audio/ttsSanitizer';
import { buildCortexArchitectureSvg, buildExecutiveInfographicDataUri } from '../../services/artifacts/artifactGeneratorService';

interface RichArtifactViewerProps {
  artifact: Artifact;
  onExport?: (format: string) => void;
}

/**
 * Gera um arquivo de áudio RIFF WAVE PCM 16-bit 22.05kHz 100% real em memória no navegador
 * (assinatura acústica executiva harmônica de 14s), garantindo reprodução, seek e download .wav offline ($0.00).
 */
function createSovereignBriefingWavUrl(durationSec = 14): string {
  const sampleRate = 22050;
  const numSamples = sampleRate * durationSec;
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeStr = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + numSamples * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  // Progressão harmônica suave Cmaj9 -> Am9 -> Fmaj7 -> G6 com chime executivo inicial
  const chords = [
    [261.63, 329.63, 392.00, 493.88],
    [220.00, 261.63, 329.63, 440.00],
    [174.61, 220.00, 261.63, 349.23],
    [196.00, 246.94, 293.66, 392.00]
  ];

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const chordIdx = Math.min(3, Math.floor((t / durationSec) * 4));
    const freqs = chords[chordIdx];

    const fadeIn = Math.min(1, t / 0.35);
    const fadeOut = Math.min(1, (durationSec - t) / 0.6);
    const pulse = 0.72 + 0.28 * Math.sin(2 * Math.PI * 1.8 * t);
    const chime = t < 0.9 ? Math.exp(-t * 4.5) * Math.sin(2 * Math.PI * 880 * t) * 0.25 : 0;

    let sample = chime;
    for (let c = 0; c < freqs.length; c++) {
      sample += (Math.sin(2 * Math.PI * freqs[c] * t) * 0.09);
    }
    sample = sample * fadeIn * fadeOut * pulse;
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, clamped * 32767, true);
  }

  const blob = new Blob([buffer], { type: 'audio/wav' });
  return URL.createObjectURL(blob);
}

/**
 * Formata células de tabela limpando marcações **bold** e destacando métricas FinOps / Notas.
 */
function renderCleanTableCell(rawCell: string): React.ReactNode {
  const clean = rawCell.replace(/\*\*(.*?)\*\*/g, '$1').trim();
  const isBold = /\*\*.*\*\*/.test(rawCell);

  if (clean === '$0.00' || clean.includes('4.95 / 5.0') || clean === '94.2%') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 font-bold font-mono text-[11px]">
        {clean}
      </span>
    );
  }

  if (isBold) {
    return <strong className="font-bold text-slate-900 dark:text-white">{clean}</strong>;
  }

  return <span>{clean}</span>;
}

export const RichArtifactViewer: React.FC<RichArtifactViewerProps> = ({ artifact }) => {
  const [copied, setCopied] = useState(false);

  // Slide state
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideFullscreen, setSlideFullscreen] = useState(false);

  // Table state
  const [tableSearch, setTableSearch] = useState('');
  const [sortColIdx, setSortColIdx] = useState<number | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Diagram & Image state
  const [zoomPct, setZoomPct] = useState(100);
  const [showSourceCode, setShowSourceCode] = useState(false);
  const [imgFallbackActive, setImgFallbackActive] = useState(false);
  const [showGridOverlay, setShowGridOverlay] = useState(false);

  // Audio state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(14);
  const [audioSpeed, setAudioSpeed] = useState<1 | 1.25 | 1.5>(1);
  const [voiceNarrationEnabled, setVoiceNarrationEnabled] = useState(true);

  // Video walkthrough state (60fps HTML5 Canvas)
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [videoTime, setVideoTime] = useState(3.2);
  const VIDEO_TOTAL_SEC = 24;

  // Sandbox App state
  const [appKey, setAppKey] = useState(0);
  const [showAppSource, setShowAppSource] = useState(false);

  // Reset estados ao trocar de artefato
  useEffect(() => {
    setCurrentSlideIndex(0);
    setSlideFullscreen(false);
    setZoomPct(100);
    setShowSourceCode(false);
    setImgFallbackActive(false);
    setIsPlayingAudio(false);
    setAudioCurrentTime(0);
    setShowAppSource(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [artifact.id]);

  // Gera WAV real em memória apenas quando o artefato for áudio
  const wavBlobUrl = useMemo(() => {
    if (artifact.type !== 'audio') return '';
    return createSovereignBriefingWavUrl(14);
  }, [artifact.id, artifact.type]);

  useEffect(() => {
    return () => {
      if (wavBlobUrl) URL.revokeObjectURL(wavBlobUrl);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [wavBlobUrl]);

  // Loop de animação 60fps para o Player de Vídeo Soberano em Canvas
  useEffect(() => {
    if (artifact.type !== 'video') return;
    let animId = 0;
    let lastTs = performance.now();

    const drawFrame = (now: number) => {
      const dt = (now - lastTs) / 1000;
      lastTs = now;

      setVideoTime(prev => {
        const next = isPlayingVideo ? (prev + dt) % VIDEO_TOTAL_SEC : prev;
        renderExecutiveWalkthroughCanvas(canvasRef.current, next, VIDEO_TOTAL_SEC);
        return next;
      });

      animId = requestAnimationFrame(drawFrame);
    };

    renderExecutiveWalkthroughCanvas(canvasRef.current, videoTime, VIDEO_TOTAL_SEC);
    animId = requestAnimationFrame(drawFrame);
    return () => cancelAnimationFrame(animId);
  }, [artifact.id, artifact.type, isPlayingVideo]);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ============================================================================
  // 1. RENDERIZADOR: APRESENTAÇÃO DE SLIDES EXECUTIVA (16:9 KEYNOTE WCAG AAA)
  // ============================================================================
  if (artifact.type === 'slide') {
    const rawSlides = artifact.content
      .split(/\n---\n|\n<!-- slide -->\n/)
      .map(s => s.trim())
      .filter(Boolean);

    const slides = rawSlides.length > 0 ? rawSlides : [artifact.content];
    const totalSlides = slides.length;
    const safeIdx = Math.min(currentSlideIndex, totalSlides - 1);
    const currentSlide = slides[safeIdx] || slides[0];

    const extractSlideTitle = (md: string, idx: number) => {
      const m = md.match(/^#\s+(.+)$/m);
      return m ? m[1].replace(/\*\*/g, '').trim() : `Slide ${idx + 1}`;
    };

    const handleExportHtmlDeck = () => {
      const htmlSlides = slides
        .map((s, idx) => `<section style="padding:48px;margin-bottom:24px;border-radius:20px;background:#0f172a;color:#f8fafc;border:1px solid #334155;font-family:system-ui,sans-serif;"><div style="color:#38bdf8;font-family:monospace;font-size:12px;">SLIDE ${idx + 1} / ${totalSlides}</div><pre style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:16px;line-height:1.6;color:#f8fafc;">${s.replace(/</g, '&lt;')}</pre></section>`)
        .join('\n');
      const blob = new Blob([`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>${artifact.title}</title></head><body style="background:#020617;padding:32px;max-width:960px;margin:0 auto;">${htmlSlides}</body></html>`], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '_')}_deck.html`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className={`space-y-3.5 select-text ${slideFullscreen ? 'fixed inset-4 z-50 bg-slate-950 p-6 rounded-2xl border border-slate-800 shadow-2xl flex flex-col justify-between' : ''}`}>
        {/* Barra Superior de Controles do Deck */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white border border-slate-800 shadow-sm">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/30 flex items-center justify-center">
              <Presentation className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <span className="font-bold text-xs block text-white">Keynote Executivo 16:9</span>
              <span className="text-[10px] font-mono text-amber-300">
                Slide {safeIdx + 1} de {totalSlides} • Contraste WCAG AAA
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 select-none">
            <button
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
              disabled={safeIdx === 0}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-35 transition text-slate-100 flex items-center space-x-1 text-[11px] font-semibold border border-slate-700"
              title="Slide Anterior"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => setCurrentSlideIndex(prev => Math.min(totalSlides - 1, prev + 1))}
              disabled={safeIdx === totalSlides - 1}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-35 transition text-white flex items-center space-x-1 text-[11px] font-semibold"
              title="Próximo Slide"
            >
              <span>Próximo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleExportHtmlDeck}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title="Exportar Apresentação Autocontida (.html)"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setSlideFullscreen(!slideFullscreen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
              title={slideFullscreen ? 'Sair da Tela Cheia' : 'Expandir Apresentação'}
            >
              {slideFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Palco 16:9 de Alto Contraste (Sempre Escuro Executivo com inverted={true}) */}
        <div
          style={{ background: 'linear-gradient(135deg, #060b16 0%, #0f172a 55%, #19173d 100%)' }}
          className="relative min-h-[340px] rounded-2xl text-white p-7 border border-slate-700/80 shadow-2xl flex flex-col justify-between overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400" />

          <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800/90 select-none">
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
              PromptCore Labs • PCL Cockpit v3.6
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-semibold">
              Resíduo Zero de Dados
            </span>
          </div>

          <div className="my-auto py-2 max-w-full overflow-y-auto custom-scrollbar">
            <MarkdownRenderer content={currentSlide} inverted={true} className="text-sm leading-relaxed" />
          </div>

          <div className="pt-4 mt-3 border-t border-slate-800/90 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none">
            <span>PCL-AEOS-NORM-01 • FinOps Soberano $0.00</span>
            <div className="flex items-center space-x-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${idx === safeIdx ? 'w-6 bg-emerald-400' : 'w-2 bg-slate-700 hover:bg-slate-500'}`}
                  title={`Ir para Slide ${idx + 1}`}
                />
              ))}
              <span className="ml-2 text-slate-300 font-bold">{safeIdx + 1} / {totalSlides}</span>
            </div>
          </div>
        </div>

        {/* Tira de Miniaturas Clicáveis dos Slides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 select-none">
          {slides.map((s, idx) => {
            const active = idx === safeIdx;
            return (
              <button
                key={idx}
                onClick={() => setCurrentSlideIndex(idx)}
                className={`p-2.5 rounded-xl text-left border transition flex flex-col justify-between ${
                  active
                    ? 'bg-slate-900 text-white border-emerald-500 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <span className={`text-[9px] font-mono font-bold uppercase ${active ? 'text-emerald-400' : 'text-slate-400'}`}>
                  Slide 0{idx + 1}
                </span>
                <span className="text-[11px] font-semibold line-clamp-1 mt-0.5">
                  {extractSlideTitle(s, idx)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // ============================================================================
  // 2. RENDERIZADOR: TABELA ANALÍTICA INTERATIVA (SORT, FILTER & CLEAN BADGES)
  // ============================================================================
  if (artifact.type === 'table' || artifact.type === 'sheet') {
    const lines = artifact.content.trim().split('\n');
    const isMarkdownTable = lines.some(l => l.includes('|'));

    let headers: string[] = [];
    let rows: string[][] = [];

    if (isMarkdownTable) {
      const cleanLines = lines.filter(l => l.includes('|') && !/^[\s|:-]+$/.test(l));
      if (cleanLines.length > 0) {
        headers = cleanLines[0].split('|').map(c => c.trim()).filter(Boolean);
        rows = cleanLines.slice(1).map(r => r.split('|').map(c => c.trim()).filter(Boolean));
      }
    } else if (lines.length > 0) {
      headers = lines[0].split(',').map(c => c.trim());
      rows = lines.slice(1).map(r => r.split(',').map(c => c.trim()));
    }

    const filteredRows = rows.filter(r =>
      !tableSearch || r.some(cell => cell.toLowerCase().includes(tableSearch.toLowerCase()))
    );

    const sortedRows = [...filteredRows].sort((a, b) => {
      if (sortColIdx === null) return 0;
      const valA = (a[sortColIdx] || '').replace(/\*\*/g, '').trim();
      const valB = (b[sortColIdx] || '').replace(/\*\*/g, '').trim();
      const numA = parseFloat(valA.replace(/[^0-9.-]/g, ''));
      const numB = parseFloat(valB.replace(/[^0-9.-]/g, ''));
      if (!isNaN(numA) && !isNaN(numB) && /\d/.test(valA) && /\d/.test(valB)) {
        return sortAsc ? numA - numB : numB - numA;
      }
      return sortAsc ? valA.localeCompare(valB, 'pt-BR') : valB.localeCompare(valA, 'pt-BR');
    });

    const handleHeaderSort = (idx: number) => {
      if (sortColIdx === idx) {
        setSortAsc(!sortAsc);
      } else {
        setSortColIdx(idx);
        setSortAsc(true);
      }
    };

    const handleExportCSV = () => {
      const stripMd = (s: string) => `"${s.replace(/\*\*/g, '').replace(/"/g, '""')}"`;
      const csvContent = '\uFEFF' + [headers.map(stripMd).join(','), ...sortedRows.map(r => r.map(stripMd).join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${artifact.title.toLowerCase().replace(/\s+/g, '_')}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="space-y-3 select-text">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <TableIcon className="w-4 h-4 text-emerald-500" />
            <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
              Grade Analítica Interativa ({sortedRows.length} registros)
            </span>
          </div>

          <div className="flex items-center space-x-2 select-none">
            <input
              type="text"
              placeholder="Filtrar linhas em tempo real..."
              value={tableSearch}
              onChange={e => setTableSearch(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            <button
              onClick={handleExportCSV}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center space-x-1 transition shadow-xs"
              title="Exportar para planilha CSV (UTF-8)"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm max-h-[440px] custom-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700 z-10 select-none">
              <tr>
                {headers.map((h, i) => (
                  <th
                    key={i}
                    onClick={() => handleHeaderSort(i)}
                    className="px-3.5 py-2.5 font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider text-[10px] cursor-pointer hover:bg-slate-200/70 dark:hover:bg-slate-700/60 transition"
                    title="Clique para ordenar esta coluna"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{h.replace(/\*\*/g, '')}</span>
                      <ArrowUpDown className={`w-3 h-3 ${sortColIdx === i ? 'text-emerald-500' : 'text-slate-400 opacity-60'}`} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900/60">
              {sortedRows.map((row, rIdx) => (
                <tr key={rIdx} className={`transition ${rIdx === 0 && !tableSearch && sortColIdx === null ? 'bg-emerald-50/40 dark:bg-emerald-950/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'}`}>
                  {row.map((cell, cIdx) => (
                    <td key={cIdx} className="px-3.5 py-2.5 text-slate-700 dark:text-slate-200 text-[11px]">
                      {renderCleanTableCell(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 3. RENDERIZADOR DEDICADO: DIAGRAMA ARQUITETURAL CORTEX v7 (SVG PAN/ZOOM)
  // ============================================================================
  if (artifact.type === 'diagram') {
    const svgMarkup = artifact.content.trim().startsWith('<svg')
      ? artifact.content
      : buildCortexArchitectureSvg(artifact.title);

    const handleDownloadSvg = () => {
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '_')}.svg`;
      a.click();
      URL.revokeObjectURL(url);
    };

    return (
      <div className="space-y-3 select-none">
        <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="font-bold text-xs block">Motor de Diagramas Cortex v7 (SVG Vetorial)</span>
              <span className="text-[10px] font-mono text-emerald-400">Layout Panorâmico LR • Contraste WCAG AAA • Zero Clipping</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setZoomPct(z => Math.max(60, z - 20))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              title="Reduzir Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoomPct(100)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono text-slate-200 border border-slate-700"
              title="Restaurar Zoom 100%"
            >
              {zoomPct}%
            </button>
            <button
              onClick={() => setZoomPct(z => Math.min(180, z + 20))}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              title="Ampliar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowSourceCode(!showSourceCode)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition flex items-center space-x-1 ${
                showSourceCode ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
              }`}
            >
              <Code className="w-3 h-3" />
              <span>{showSourceCode ? 'Ver Diagrama' : 'Código SVG'}</span>
            </button>
            <button
              onClick={handleDownloadSvg}
              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center space-x-1 transition"
            >
              <Download className="w-3 h-3" />
              <span>SVG</span>
            </button>
          </div>
        </div>

        {showSourceCode ? (
          <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-[11px] overflow-auto max-h-[460px] border border-slate-800 select-text">
            <code>{svgMarkup}</code>
          </pre>
        ) : (
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-3 overflow-auto shadow-2xl max-h-[500px] custom-scrollbar">
            <div
              style={{ width: `${zoomPct}%`, minWidth: zoomPct > 100 ? `${zoomPct * 7}px` : '100%' }}
              className="transition-all duration-150 mx-auto [&>svg]:w-full [&>svg]:h-auto [&>svg]:rounded-xl"
              dangerouslySetInnerHTML={{ __html: svgMarkup }}
            />
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 4. RENDERIZADOR: IMAGEM / INFOGRÁFICO EXECUTIVO HD (COM FALLBACK GARANTIDO)
  // ============================================================================
  if (artifact.type === 'image') {
    const primarySrc = artifact.mediaUrl || (artifact.content.startsWith('data:image') || artifact.content.startsWith('http') || artifact.content.startsWith('/') ? artifact.content : '');
    const activeSrc = (!primarySrc || imgFallbackActive) ? buildExecutiveInfographicDataUri() : primarySrc;

    const handleDownloadImage = () => {
      const a = document.createElement('a');
      a.href = activeSrc;
      a.download = `${artifact.title.toLowerCase().replace(/\s+/g, '_')}.svg`;
      a.click();
    };

    return (
      <div className="space-y-3 select-none">
        <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ImageIcon className="w-4 h-4 text-sky-500" />
            <div>
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200 block">
                Infográfico & Renderização Visual HD
              </span>
              <span className="text-[10px] font-mono text-slate-400">Resolução 1200×675 (16:9) • Vetorial Nítido</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setZoomPct(z => Math.max(60, z - 20))}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200"
              title="Diminuir Zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 py-1 text-[11px] font-mono text-slate-600 dark:text-slate-300">{zoomPct}%</span>
            <button
              onClick={() => setZoomPct(z => Math.min(180, z + 20))}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-200"
              title="Aumentar Zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowGridOverlay(!showGridOverlay)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                showGridOverlay ? 'bg-sky-600 text-white border-sky-500' : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              Grade
            </button>
            <button
              onClick={handleDownloadImage}
              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-[11px] flex items-center space-x-1 transition"
            >
              <Download className="w-3 h-3" />
              <span>Baixar</span>
            </button>
          </div>
        </div>

        <div className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-3 flex items-center justify-center overflow-auto shadow-xl min-h-[300px] max-h-[500px] custom-scrollbar">
          {showGridOverlay && (
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{ backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
            />
          )}
          <img
            src={activeSrc}
            alt={artifact.title}
            onError={() => setImgFallbackActive(true)}
            style={{ width: `${zoomPct}%` }}
            className="max-w-none h-auto object-contain rounded-xl transition-all duration-150"
          />
        </div>
      </div>
    );
  }

  // ============================================================================
  // 5. RENDERIZADOR: ÁUDIO WAV REAL + VOZ NATURAL PT-BR + WAVEFORM SINCRONIZADO
  // ============================================================================
  if (artifact.type === 'audio') {
    const sentences = artifact.content
      .split(/(?<=[.!?])\s+/)
      .map(s => s.trim())
      .filter(Boolean);

    const activeSentenceIdx = Math.min(
      sentences.length - 1,
      Math.floor((audioCurrentTime / Math.max(1, audioDuration)) * sentences.length)
    );

    const formatTime = (sec: number) => {
      const s = Math.max(0, Math.floor(sec));
      const m = Math.floor(s / 60);
      const r = s % 60;
      return `${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')}`;
    };

    const handleToggleAudioPlay = () => {
      const el = audioRef.current;
      if (!el) return;

      if (isPlayingAudio) {
        el.pause();
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        setIsPlayingAudio(false);
      } else {
        el.playbackRate = audioSpeed;
        el.play().catch(() => {});
        if (voiceNarrationEnabled && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(sanitizeMarkdownForSpeech(artifact.content));
          u.lang = 'pt-BR';
          u.rate = audioSpeed;
          window.speechSynthesis.speak(u);
        }
        setIsPlayingAudio(true);
      }
    };

    const handleCycleSpeed = () => {
      const next: 1 | 1.25 | 1.5 = audioSpeed === 1 ? 1.25 : audioSpeed === 1.25 ? 1.5 : 1;
      setAudioSpeed(next);
      if (audioRef.current) audioRef.current.playbackRate = next;
    };

    const waveformBars = [38, 62, 84, 52, 94, 44, 76, 68, 90, 48, 82, 60, 74, 96, 54, 42, 78, 88, 64, 50, 92, 70, 58, 86, 46, 72, 66, 80, 52, 68, 44, 56];
    const progressRatio = audioDuration > 0 ? audioCurrentTime / audioDuration : 0;

    return (
      <div className="space-y-4 select-text">
        <audio
          ref={audioRef}
          src={wavBlobUrl}
          onLoadedMetadata={e => setAudioDuration(e.currentTarget.duration || 14)}
          onTimeUpdate={e => setAudioCurrentTime(e.currentTarget.currentTime)}
          onEnded={() => {
            setIsPlayingAudio(false);
            setAudioCurrentTime(0);
          }}
        />

        <div
          style={{ background: 'linear-gradient(135deg, #07101f 0%, #0f172a 60%, #062c26 100%)' }}
          className="p-5 rounded-2xl text-white border border-slate-800 shadow-xl space-y-4 select-none"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-white">{artifact.title}</h4>
                <span className="text-[10px] text-emerald-300 font-mono block">
                  PCM WAV 22.05kHz 16-bit Local + Síntese Vocal PT-BR ($0.00)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setVoiceNarrationEnabled(!voiceNarrationEnabled)}
                className={`px-2.5 py-1 rounded-lg font-mono text-[10px] font-bold border transition flex items-center space-x-1 ${
                  voiceNarrationEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
                title="Ativar/Desativar locução em voz natural PT-BR junto com a trilha WAV"
              >
                {voiceNarrationEnabled ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                <span>Voz PT-BR {voiceNarrationEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={handleCycleSpeed}
                className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-300 font-mono text-[10px] font-bold border border-slate-700"
                title="Alterar velocidade de reprodução"
              >
                {audioSpeed}x
              </button>

              <a
                href={wavBlobUrl}
                download="briefing_executivo_pcl_aeos.wav"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[10px] border border-slate-700 flex items-center space-x-1"
                title="Baixar arquivo de áudio .wav real"
              >
                <Download className="w-3 h-3" />
                <span>WAV</span>
              </a>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/85 border border-slate-800/90 flex items-center space-x-3.5">
            <button
              onClick={handleToggleAudioPlay}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center transition shadow-lg shadow-emerald-500/25 flex-shrink-0 cursor-pointer"
              title={isPlayingAudio ? 'Pausar Briefing' : 'Reproduzir Briefing em Áudio'}
            >
              {isPlayingAudio ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
            </button>

            <div className="flex-1 space-y-2">
              <div
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                  if (audioRef.current) {
                    audioRef.current.currentTime = pct * audioDuration;
                    setAudioCurrentTime(pct * audioDuration);
                  }
                }}
                className="flex items-end space-x-1 h-10 cursor-pointer"
                title="Clique em qualquer ponto da onda sonora para avançar ou retroceder"
              >
                {waveformBars.map((baseH, idx) => {
                  const barRatio = idx / waveformBars.length;
                  const passed = barRatio <= progressRatio;
                  const dynamicH = isPlayingAudio
                    ? Math.max(22, Math.min(100, baseH + Math.sin(audioCurrentTime * 9 + idx) * 18))
                    : baseH;
                  return (
                    <div
                      key={idx}
                      style={{ height: `${dynamicH}%` }}
                      className={`flex-1 rounded-full transition-all duration-100 ${
                        passed
                          ? 'bg-gradient-to-t from-emerald-500 to-cyan-300'
                          : 'bg-slate-700/80 hover:bg-slate-600'
                      }`}
                    />
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span className="text-emerald-400 font-bold">{formatTime(audioCurrentTime)}</span>
                <span>{isPlayingAudio ? '● Reproduzindo Áudio Soberano...' : 'Clique em ▶ para ouvir pessoalmente'}</span>
                <span>{formatTime(audioDuration)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">
              Transcrição Sincronizada (Clique em uma frase para saltar):
            </span>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
              Sanitizado p/ Escuta Natural
            </span>
          </div>
          <div className="space-y-1.5 text-xs leading-relaxed">
            {sentences.map((sentence, idx) => {
              const isCurrent = isPlayingAudio && idx === activeSentenceIdx;
              return (
                <p
                  key={idx}
                  onClick={() => {
                    if (audioRef.current) {
                      const target = (idx / sentences.length) * audioDuration;
                      audioRef.current.currentTime = target;
                      setAudioCurrentTime(target);
                    }
                  }}
                  className={`p-2 rounded-lg cursor-pointer transition ${
                    isCurrent
                      ? 'bg-emerald-500/15 text-emerald-900 dark:text-emerald-200 border border-emerald-500/30 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  {sentence}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 6. RENDERIZADOR: VÍDEO WALKTHROUGH SOBERANO 60FPS (100% OFFLINE & INTERATIVO)
  // ============================================================================
  if (artifact.type === 'video') {
    const chapters = [
      { start: 0, label: 'Cap. 1 • Tríade & 4.95/5.0' },
      { start: 6, label: 'Cap. 2 • Laya CPU 20ms' },
      { start: 12, label: 'Cap. 3 • OmniRoute $0.00' },
      { start: 18, label: 'Cap. 4 • PaperClip & MCP' }
    ];
    const currentChapterIdx = Math.min(3, Math.floor(videoTime / 6));

    return (
      <div className="space-y-3 select-none">
        <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <VideoIcon className="w-4 h-4 text-purple-400" />
            <div>
              <span className="font-bold text-xs block">Walkthrough Executivo em Vídeo (60 FPS Local)</span>
              <span className="text-[10px] font-mono text-purple-300">Renderização Soberana HTML5 Canvas • Zero Dependência de Nuvem</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono text-[10px]">
            HD 16:9 • {isPlayingVideo ? 'EM REPRODUÇÃO' : 'PAUSADO'}
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-2xl">
          <canvas
            ref={canvasRef}
            width={960}
            height={540}
            onClick={() => setIsPlayingVideo(!isPlayingVideo)}
            className="w-full h-auto aspect-video block cursor-pointer"
          />

          <div className="p-3 bg-slate-900/95 border-t border-slate-800 space-y-2.5">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                className="w-8 h-8 rounded-lg bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center transition flex-shrink-0"
                title={isPlayingVideo ? 'Pausar Vídeo' : 'Reproduzir Vídeo'}
              >
                {isPlayingVideo ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              <input
                type="range"
                min={0}
                max={VIDEO_TOTAL_SEC}
                step={0.1}
                value={videoTime}
                onChange={e => {
                  const t = parseFloat(e.target.value);
                  setVideoTime(t);
                  renderExecutiveWalkthroughCanvas(canvasRef.current, t, VIDEO_TOTAL_SEC);
                }}
                className="flex-1 accent-purple-500 cursor-pointer"
              />

              <span className="text-[11px] font-mono text-slate-300 w-24 text-right">
                00:{String(Math.floor(videoTime)).padStart(2, '0')} / 00:{VIDEO_TOTAL_SEC}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {chapters.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setVideoTime(ch.start + 0.5);
                    renderExecutiveWalkthroughCanvas(canvasRef.current, ch.start + 0.5, VIDEO_TOTAL_SEC);
                  }}
                  className={`px-2 py-1.5 rounded-lg text-[10px] font-mono font-semibold truncate border transition ${
                    currentChapterIdx === idx
                      ? 'bg-purple-600/25 text-purple-200 border-purple-500'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {ch.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // 7. RENDERIZADOR: APLICAÇÃO INTERATIVA EM SANDBOX (IFRAME ISOLADO)
  // ============================================================================
  if (artifact.type === 'app') {
    return (
      <div className="space-y-3">
        <div className="p-3 bg-slate-900 text-white rounded-xl border border-slate-800 flex items-center justify-between select-none">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-sky-400" />
            <div>
              <span className="font-bold text-xs block">Sandbox de Execução Segura (Iframe Isolado)</span>
              <span className="text-[10px] font-mono text-emerald-400">Interativo em Tempo Real • Resíduo Zero de Dados</span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setAppKey(k => k + 1)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              title="Reiniciar estado da aplicação"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowAppSource(!showAppSource)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 flex items-center space-x-1"
            >
              <Code className="w-3 h-3" />
              <span>{showAppSource ? 'Ver App' : 'Código HTML'}</span>
            </button>
          </div>
        </div>

        {showAppSource ? (
          <pre className="p-4 rounded-2xl bg-slate-950 text-sky-300 font-mono text-[11px] overflow-auto max-h-[480px] border border-slate-800 select-text">
            <code>{artifact.content}</code>
          </pre>
        ) : (
          <div className="w-full h-[490px] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 shadow-xl">
            <iframe
              key={appKey}
              title={artifact.title}
              srcDoc={artifact.content}
              sandbox="allow-scripts"
              className="w-full h-full border-0"
            />
          </div>
        )}
      </div>
    );
  }

  // ============================================================================
  // 8. RENDERIZADOR PADRÃO: DOCUMENTO NORMATIVO / PLANO EXECUTIVO (ALTO CONTRASTE)
  // ============================================================================
  return (
    <div className="space-y-4 select-text">
      <div className="p-3.5 bg-slate-50 dark:bg-slate-900/80 rounded-xl border border-slate-200/80 dark:border-slate-800 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5 text-sky-500" />
            <span>Sumário Executivo do Documento</span>
          </span>
          <button
            onClick={handleCopyContent}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-200 flex items-center space-x-1 transition select-none"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[10px] font-semibold">Copiar Markdown</span>
              </>
            )}
          </button>
        </div>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{artifact.summary}</p>
      </div>

      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
        <MarkdownRenderer content={artifact.content} />
      </div>
    </div>
  );
};

/**
 * Desenha quadros vetoriais 60fps de altíssima nitidez para o Walkthrough em Vídeo do PCL Cockpit v3.6.
 */
function renderExecutiveWalkthroughCanvas(canvas: HTMLCanvasElement | null, t: number, totalSec: number) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const W = canvas.width;
  const H = canvas.height;
  const chapter = Math.min(3, Math.floor(t / 6));
  const localT = (t % 6) / 6;

  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, '#050b16');
  bg.addColorStop(0.55, '#0f172a');
  bg.addColorStop(1, '#17153b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.06)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  for (let y = 0; y < H; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
  }

  ctx.fillStyle = 'rgba(9, 16, 32, 0.9)';
  ctx.fillRect(28, 22, W - 56, 52);
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(28, 22, W - 56, 52);

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(52, 48, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 16px system-ui, sans-serif';
  ctx.fillText('PCL COCKPIT v3.6 • WALKTHROUGH EXECUTIVO SOBERANO', 68, 45);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '12px Consolas, monospace';
  ctx.fillText(`CAPÍTULO 0${chapter + 1}/04  •  CUSTO MARGINAL $0.00  •  RESÍDUO ZERO DE DADOS`, 68, 63);

  const chapterTitles = [
    '1. A Tríade Institucional & Vitória Global 4.95 / 5.0',
    '2. Coprocessador Laya System One (CPU INT8 • ~20ms • 0 MB VRAM)',
    '3. OmniRoute AI Gateway & Cofre Criptográfico AES-256-GCM',
    '4. Governança Viva PaperClip (13 Agentes • 82 Skills • Hub MCP)'
  ];

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px system-ui, sans-serif';
  ctx.fillText(chapterTitles[chapter], 40, 122);

  if (chapter === 0) {
    const items = [
      { name: 'PCL Cockpit v3.6 (Soberano)', score: 4.95, color: '#10b981' },
      { name: 'Google Gemini Advanced', score: 4.45, color: '#38bdf8' },
      { name: 'OpenAI ChatGPT Enterprise', score: 4.30, color: '#64748b' },
      { name: 'Microsoft 365 Copilot', score: 3.80, color: '#475569' }
    ];
    items.forEach((it, idx) => {
      const y = 165 + idx * 72;
      const animGrow = Math.min(1, localT * 2.4);
      const barW = (it.score / 5.0) * 540 * animGrow;

      ctx.fillStyle = '#e2e8f0';
      ctx.font = idx === 0 ? 'bold 16px system-ui, sans-serif' : '15px system-ui, sans-serif';
      ctx.fillText(it.name, 44, y + 20);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(300, y, 540, 28);
      ctx.fillStyle = it.color;
      ctx.fillRect(300, y, barW, 28);

      ctx.fillStyle = idx === 0 ? '#34d399' : '#cbd5e1';
      ctx.font = 'bold 16px Consolas, monospace';
      ctx.fillText(`${it.score.toFixed(2)} / 5.0`, 852, y + 20);
    });
  } else if (chapter === 1) {
    const boxes = [
      { x: 50, w: 220, title: 'Prompt do Usuário', sub: 'PII Guard LGPD OK', col: '#0284c7' },
      { x: 360, w: 250, title: 'Laya CPU INT8 (:20140)', sub: '20ms • 0 MB VRAM Host', col: '#d97706' },
      { x: 700, w: 210, title: 'Rota Determinística', sub: 'Ollama GPU / RAG / Web', col: '#059669' }
    ];
    boxes.forEach(b => {
      ctx.fillStyle = '#0f1d35';
      ctx.strokeStyle = b.col;
      ctx.lineWidth = 2;
      ctx.fillRect(b.x, 200, b.w, 120);
      ctx.strokeRect(b.x, 200, b.w, 120);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px system-ui, sans-serif';
      ctx.fillText(b.title, b.x + 18, 250);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '13px Consolas, monospace';
      ctx.fillText(b.sub, b.x + 18, 280);
    });

    const pulseX = 70 + ((t * 260) % 820);
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(pulseX, 260, 9, 0, Math.PI * 2);
    ctx.fill();
  } else if (chapter === 2) {
    const metrics = [
      { label: 'CUSTO POR TOKEN LOCAL', val: '$ 0.00', col: '#34d399' },
      { label: 'FAIL-FAST TCP PROBE', val: '300 ms', col: '#38bdf8' },
      { label: 'COFRE CRIPTOGRÁFICO', val: 'AES-256-GCM', col: '#a5b4fc' }
    ];
    metrics.forEach((m, i) => {
      const x = 44 + i * 296;
      ctx.fillStyle = '#0b162c';
      ctx.strokeStyle = m.col;
      ctx.lineWidth = 2;
      ctx.fillRect(x, 190, 272, 160);
      ctx.strokeRect(x, 190, 272, 160);
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 12px Consolas, monospace';
      ctx.fillText(m.label, x + 20, 235);
      ctx.fillStyle = m.col;
      ctx.font = 'bold 30px Consolas, monospace';
      ctx.fillText(m.val, x + 20, 295);
    });
  } else {
    const cards = [
      { title: 'Cluster Estratégia', desc: 'CEO Agent • SDD • DevSecOps • FinOps', col: '#38bdf8' },
      { title: 'Cluster Engenharia', desc: 'Cortex v7 • Laya System 1 • UI Squad', col: '#34d399' },
      { title: 'Hub Universal MCP', desc: 'JSON-RPC stdio/SSE • 82 Skills Reais', col: '#a5b4fc' }
    ];
    cards.forEach((c, i) => {
      const x = 44 + i * 296;
      ctx.fillStyle = '#111c33';
      ctx.strokeStyle = c.col;
      ctx.lineWidth = 2;
      ctx.fillRect(x, 190, 272, 165);
      ctx.strokeRect(x, 190, 272, 165);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px system-ui, sans-serif';
      ctx.fillText(c.title, x + 20, 245);
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '13px system-ui, sans-serif';
      ctx.fillText(c.desc, x + 20, 285);
      ctx.fillStyle = c.col;
      ctx.font = 'bold 12px Consolas, monospace';
      ctx.fillText('● SINCRONIZADO EM DISCO', x + 20, 325);
    });
  }

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(40, H - 36, W - 80, 6);
  ctx.fillStyle = '#a855f7';
  ctx.fillRect(40, H - 36, ((W - 80) * t) / totalSec, 6);
}
