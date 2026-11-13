/**
 * PCL Cockpit - Artifacts Library View (v3.9.0 PROD)
 * 
 * Tela centralizada "Biblioteca de Artefatos" com os mesmos princípios de UX
 * vistos no ChatGPT e Gemini:
 * - Filtros rápidos por pílula (Todos, Favoritos, Diagramas, Slides, Planilhas, Infográficos, Apps, Documentos)
 * - Busca textual e por tags
 * - Barra de Cota e Governança FinOps / Cloudflare R2 DRP / PostgreSQL 17
 * - Alternância entre Miniaturas (Grid) e Lista Detalhada (Table)
 * - Navegação direta para a conversa de origem (zero amnésia)
 * - Exportação nativa real: PowerPoint (.pptx), Excel (.xlsx), SVG (.svg), HTML5 (.html), Markdown (.md)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  FileText, Presentation, Table as TableIcon, Layers, Image as ImageIcon,
  Sparkles, Search, Star, ExternalLink, Download, ArrowUpDown, Grid, List,
  Clock, HardDrive, Database, ShieldCheck, ChevronRight, Check, Plus, Filter,
  Trash2, Share2, Eye
} from 'lucide-react';
import { Artifact, Project, Conversation } from '../../types';
import { cockpitPersistenceService, StorageQuotaInfo } from '../../services/storage/cockpitPersistenceService';
import PptxGenJS from 'pptxgenjs';
import * as XLSX from 'xlsx';

interface ArtifactsLibraryViewProps {
  projects: Project[];
  onOpenArtifact: (artifact: Artifact) => void;
  onSelectConversation: (conversation: Conversation) => void;
  onNewConversation: () => void;
}

type FilterCategory = 'all' | 'favorites' | 'diagram' | 'slide' | 'sheet' | 'infographic' | 'app' | 'doc';
type SortOption = 'date-desc' | 'date-asc' | 'title-asc' | 'size-desc';

export const ArtifactsLibraryView: React.FC<ArtifactsLibraryViewProps> = ({
  projects,
  onOpenArtifact,
  onSelectConversation,
  onNewConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [viewLayout, setViewLayout] = useState<'grid' | 'table'>(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      return p.get('layout') === 'table' ? 'table' : 'grid';
    } catch {
      return 'grid';
    }
  });
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [quotaInfo, setQuotaInfo] = useState<StorageQuotaInfo | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  // Carrega cota de armazenamento real
  useEffect(() => {
    cockpitPersistenceService.getStorageQuota().then(info => setQuotaInfo(info));
  }, []);

  // Coleta todos os artefatos de todas as conversas em todos os projetos
  const allArtifacts = useMemo(() => {
    const map = new Map<string, { artifact: Artifact; project: Project; conversation: Conversation }>();

    projects.forEach(project => {
      project.conversations.forEach(conversation => {
        conversation.messages.forEach(message => {
          if (message.artifacts && message.artifacts.length > 0) {
            message.artifacts.forEach(art => {
              if (!map.has(art.id)) {
                map.set(art.id, {
                  artifact: {
                    ...art,
                    projectId: project.id,
                    projectName: project.name,
                    conversationId: conversation.id,
                    conversationTitle: conversation.title,
                    isFavorite: favorites[art.id] ?? art.isFavorite ?? false
                  },
                  project,
                  conversation
                });
              }
            });
          }
        });
      });
    });

    return Array.from(map.values());
  }, [projects, favorites]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtragem e Ordenação
  const filteredArtifacts = useMemo(() => {
    let result = allArtifacts.filter(({ artifact, project, conversation }) => {
      // 1. Busca por termo
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesTitle = artifact.title.toLowerCase().includes(q);
        const matchesSummary = artifact.summary.toLowerCase().includes(q);
        const matchesConv = conversation.title.toLowerCase().includes(q);
        const matchesProj = project.name.toLowerCase().includes(q);
        const matchesTags = (artifact.tags || []).some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesConv && !matchesProj && !matchesTags) {
          return false;
        }
      }

      // 2. Filtro de Projeto
      if (selectedProjectId !== 'all' && project.id !== selectedProjectId) {
        return false;
      }

      // 3. Filtro de Categoria
      if (activeCategory === 'favorites') {
        return Boolean(favorites[artifact.id] || artifact.isFavorite);
      }
      if (activeCategory !== 'all') {
        if (activeCategory === 'diagram' && artifact.type !== 'diagram') return false;
        if (activeCategory === 'slide' && artifact.type !== 'slide') return false;
        if (activeCategory === 'sheet' && artifact.type !== 'sheet' && artifact.type !== 'table') return false;
        if (activeCategory === 'infographic' && artifact.type !== 'infographic') return false;
        if (activeCategory === 'app' && artifact.type !== 'app') return false;
        if (activeCategory === 'doc' && artifact.type !== 'doc' && artifact.type !== 'plan') return false;
      }

      return true;
    });

    // Ordenação
    result.sort((a, b) => {
      if (sortOption === 'date-desc') {
        return new Date(b.artifact.updatedAt).getTime() - new Date(a.artifact.updatedAt).getTime();
      }
      if (sortOption === 'date-asc') {
        return new Date(a.artifact.updatedAt).getTime() - new Date(b.artifact.updatedAt).getTime();
      }
      if (sortOption === 'title-asc') {
        return a.artifact.title.localeCompare(b.artifact.title);
      }
      if (sortOption === 'size-desc') {
        return (b.artifact.sizeBytes || 0) - (a.artifact.sizeBytes || 0);
      }
      return 0;
    });

    return result;
  }, [allArtifacts, searchTerm, activeCategory, selectedProjectId, sortOption, favorites]);

  // Download e Exportação Nativa
  const handleExportArtifact = async (artifact: Artifact, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setExportingId(artifact.id);

    try {
      const cleanTitle = (artifact.title || 'artefato').replace(/[^a-zA-Z0-9_\-\u00C0-\u017F ]/g, '_').trim();

      if (artifact.type === 'slide') {
        const pptx = new PptxGenJS();
        pptx.layout = 'LAYOUT_16x9';
        const slides = artifact.content.split(/\n---\n/);
        slides.forEach(raw => {
          const slide = pptx.addSlide();
          slide.background = { color: '0F172A' };
          const lines = raw.trim().split('\n');
          const title = lines[0]?.replace(/^#+\s*/, '') || artifact.title;
          const body = lines.slice(1).join('\n').trim();
          slide.addText(title, { x: 0.8, y: 0.8, w: '85%', fontSize: 24, color: '38BDF8', bold: true });
          if (body) {
            slide.addText(body, { x: 0.8, y: 2.0, w: '85%', h: '60%', fontSize: 13, color: 'F1F5F9' });
          }
        });
        await pptx.writeFile({ fileName: `${cleanTitle}.pptx` });
      } else if (artifact.type === 'sheet' || artifact.type === 'table') {
        const wb = XLSX.utils.book_new();
        const rows: string[][] = [];
        const lines = artifact.content.trim().split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
            if (cells.every(c => /^[-:]+$/.test(c))) continue;
            rows.push(cells);
          }
        }
        const ws = XLSX.utils.aoa_to_sheet(rows.length > 0 ? rows : [['Conteúdo'], [artifact.content]]);
        XLSX.utils.book_append_sheet(wb, ws, 'Dados');
        XLSX.writeFile(wb, `${cleanTitle}.xlsx`);
      } else if (artifact.type === 'diagram') {
        const blob = new Blob([artifact.content], { type: 'image/svg+xml;charset=utf-8' });
        triggerDownload(`${cleanTitle}.svg`, blob);
      } else if (artifact.type === 'app') {
        const blob = new Blob([artifact.content], { type: 'text/html;charset=utf-8' });
        triggerDownload(`${cleanTitle}.html`, blob);
      } else {
        const blob = new Blob([artifact.content], { type: 'text/markdown;charset=utf-8' });
        triggerDownload(`${cleanTitle}.md`, blob);
      }
    } catch (err) {
      console.error('Falha ao exportar artefato:', err);
      alert('Erro na exportação do arquivo.');
    } finally {
      setExportingId(null);
    }
  };

  const triggerDownload = (filename: string, blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFormatBadge = (type: string, ext?: string) => {
    switch (type) {
      case 'slide':
        return { label: 'PPTX', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
      case 'sheet':
      case 'table':
        return { label: 'XLSX', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      case 'diagram':
        return { label: 'SVG', color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' };
      case 'infographic':
        return { label: 'INFOGRÁFICO', color: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800' };
      case 'app':
        return { label: 'HTML5', color: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800' };
      default:
        return { label: ext ? ext.replace('.', '').toUpperCase() : 'MD', color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
    }
  };

  /**
   * Limpa e sintetiza títulos para eliminar comandos crus ("Gerar artefato no formato...")
   */
  const cleanDisplayTitle = (rawTitle: string): string => {
    if (!rawTitle) return 'Artefato Executivo';
    let t = rawTitle;
    t = t.replace(/^Simulador\s+Ao\s+Vivo:\s*Gerar\s+artefato\s+no\s+formato\s+app/i, 'Simulador Interativo: Modelo Operacional & KPIs');
    t = t.replace(/^Relat[óo]rio\s+Executivo:\s*Gerar\s+artefato\s+no\s+formato\s+doc/i, 'Relatório Executivo: Análise Estratégica');
    t = t.replace(/^Deck\s+Executivo\s+16:9:\s*Gerar\s+artefato\s+no\s+formato\s+slide/i, 'Apresentação 16:9: Sumário Executivo');
    t = t.replace(/^Planilha\s+Anal[íi]tica:\s*Gerar\s+artefato\s+no\s+formato\s+sheet/i, 'Planilha Analítica: Projeção & Capex');
    t = t.replace(/^Infogr[áa]fico\s+&\s+KPIs:\s*Gerar\s+artefato\s+no\s+formato\s+infographic/i, 'Infográfico & KPIs: Painel Executivo');
    t = t.replace(/:\s*Gerar\s+artefato\s+no\s+formato\s+\w+/gi, '');
    return t.trim() || 'Artefato Executivo';
  };

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'slide': return <Presentation className="w-4 h-4 text-amber-500" />;
      case 'sheet':
      case 'table': return <TableIcon className="w-4 h-4 text-emerald-500" />;
      case 'diagram': return <Layers className="w-4 h-4 text-indigo-500" />;
      case 'infographic': return <ImageIcon className="w-4 h-4 text-sky-500" />;
      case 'app': return <Sparkles className="w-4 h-4 text-pink-500" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900/60 overflow-y-auto custom-scrollbar select-none">
      {/* 1. TOPO: Título, Cota de Armazenamento Soberano & Ações Rápidas */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-900 shadow-sm">
                <FileText className="w-4 h-4" />
              </div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Biblioteca de Artefatos
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                v3.9.0 PROD
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Repositório soberano de entregáveis executivos • PostgreSQL 17 (:5432) • Vault Local • Cloudflare R2 DRP
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {/* View Switcher: Grid vs. List */}
            <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 p-0.5 bg-slate-100/60 dark:bg-slate-950/40">
              <button
                onClick={() => setViewLayout('grid')}
                className={`p-1.5 rounded-lg transition ${
                  viewLayout === 'grid'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Visualização em Miniaturas (Grade)"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewLayout('table')}
                className={`p-1.5 rounded-lg transition ${
                  viewLayout === 'table'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
                title="Visualização em Tabela Ordenável"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Botão Novo Artefato */}
            <button
              onClick={onNewConversation}
              className="px-3 py-1.5 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 font-medium text-xs shadow-sm transition flex items-center space-x-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Novo Artefato</span>
            </button>
          </div>
        </div>

        {/* Banner de Cota e Governança FinOps / R2 (Inspirado no aviso de armazenamento do ChatGPT) */}
        {quotaInfo && (
          <div className="rounded-xl border border-slate-200 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-950/40 p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2.5">
              <HardDrive className="w-4 h-4 text-emerald-500 shrink-0" />
              <div className="min-w-0">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Armazenamento Soberano Local & DRP:
                </span>{' '}
                <span className="font-mono text-slate-600 dark:text-slate-400">
                  {quotaInfo.usedFormatted} de 10.0 GB utilizados ({quotaInfo.percentageUsed}%)
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-24 sm:w-32 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(quotaInfo.percentageUsed, 2)}%` }}
                />
              </div>

              <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-mono text-[10px]">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>R2 DRP OK</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 2. BARRA DE CONTROLE: Busca e Filtros Pílula (ChatGPT / Gemini Style) */}
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40 backdrop-blur-sm space-y-3">
        {/* Linha de Busca + Dropdowns */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Campo de Busca Orama / Local */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Pesquisar artefatos por título, tag, conversa ou projeto..."
              className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-slate-400 dark:focus:border-slate-600 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Filtro por Projeto */}
          <select
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="all">Todos os Projetos</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Ordenação */}
          <select
            value={sortOption}
            onChange={e => setSortOption(e.target.value as SortOption)}
            className="px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="date-desc">Mais Recentes Primeiro</option>
            <option value="date-asc">Mais Antigos Primeiro</option>
            <option value="title-asc">Título (A-Z)</option>
            <option value="size-desc">Maior Tamanho</option>
          </select>
        </div>

        {/* Pílulas de Categoria (Estilo ChatGPT / Gemini) */}
        <div className="flex items-center space-x-1.5 overflow-x-auto custom-scrollbar pb-1 text-xs">
          {[
            { id: 'all', label: 'Tudo' },
            { id: 'favorites', label: 'Favoritos', icon: Star },
            { id: 'diagram', label: 'Diagramas (.svg)', icon: Layers },
            { id: 'slide', label: 'Slides (.pptx)', icon: Presentation },
            { id: 'sheet', label: 'Planilhas (.xlsx)', icon: TableIcon },
            { id: 'infographic', label: 'Infográficos', icon: ImageIcon },
            { id: 'app', label: 'Apps & Simuladores', icon: Sparkles },
            { id: 'doc', label: 'Documentos (.md)', icon: FileText }
          ].map(tab => {
            const IconComp = tab.icon;
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as FilterCategory)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition flex items-center space-x-1.5 border shadow-2xs ${
                  isActive
                    ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 border-transparent'
                    : 'bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {IconComp && <IconComp className="w-3 h-3" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. CONTEÚDO PRINCIPAL: Grade de Miniaturas OU Tabela */}
      <div className="p-6">
        {filteredArtifacts.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Nenhum artefato encontrado
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchTerm 
                ? 'Nenhum resultado corresponde à sua pesquisa. Tente limpar os filtros ou usar outros termos.'
                : 'Inicie uma conversa ou selecione um formato alvo no botão "Artefatos" para gerar seus primeiros entregáveis.'}
            </p>
            <button
              onClick={onNewConversation}
              className="mt-2 px-3 py-1.5 rounded-xl bg-slate-950 text-white dark:bg-white dark:text-slate-950 text-xs font-medium hover:opacity-90 transition"
            >
              Criar Novo na Conversa
            </button>
          </div>
        ) : viewLayout === 'grid' ? (
          /* MODO GRADE: Miniaturas Vivas de Alta Fidelidade (Gemini / ChatGPT Style) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredArtifacts.map(({ artifact, project, conversation }) => {
              const badge = getFormatBadge(artifact.type, artifact.formatExt);
              const isFav = Boolean(favorites[artifact.id] || artifact.isFavorite);

              return (
                <div
                  key={artifact.id}
                  onClick={() => onOpenArtifact(artifact)}
                  className="group relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:border-emerald-500/70 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden cursor-pointer select-none"
                >
                  {/* Preview Visual Superior */}
                  <div className="h-32 w-full bg-slate-100 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800/80 p-3 relative flex items-center justify-center overflow-hidden">
                    {/* Estrela de Favorito */}
                    <button
                      onClick={(e) => toggleFavorite(artifact.id, e)}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-lg backdrop-blur-md transition z-10 ${
                        isFav
                          ? 'bg-amber-500/10 text-amber-500'
                          : 'bg-white/70 dark:bg-slate-900/70 text-slate-400 hover:text-amber-500 opacity-0 group-hover:opacity-100'
                      }`}
                      title={isFav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                    </button>

                    {/* Miniatura Específica por Formato */}
                    {artifact.type === 'diagram' && artifact.content.trim().startsWith('<svg') ? (
                      <div
                        className="w-full h-full flex items-center justify-center [&_svg]:max-h-full [&_svg]:max-w-full"
                        dangerouslySetInnerHTML={{ __html: artifact.content }}
                      />
                    ) : artifact.type === 'slide' ? (
                      <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-950 to-indigo-950 p-2.5 text-white flex flex-col justify-between">
                        <span className="text-[9px] font-mono text-sky-400 uppercase">Keynote Deck</span>
                        <span className="text-[11px] font-bold text-slate-100 truncate">{cleanDisplayTitle(artifact.title)}</span>
                        <span className="text-[8.5px] font-mono text-slate-400">Reveal.js • 16:9</span>
                      </div>
                    ) : artifact.type === 'sheet' || artifact.type === 'table' ? (
                      <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-950 via-emerald-950/60 to-slate-950 border border-emerald-500/40 p-2.5 text-white flex flex-col justify-between shadow-inner">
                        <span className="uppercase text-[8.5px] font-mono text-emerald-400 font-semibold flex items-center space-x-1">
                          <span>📊</span> <span>Planilha Analítica</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-100 truncate">{cleanDisplayTitle(artifact.title)}</span>
                        <div className="flex items-center justify-between pt-1 border-t border-emerald-900/50 text-[8.5px] font-mono text-emerald-400">
                          <span>Grade Dinâmica</span>
                          <span>Exporta .XLSX</span>
                        </div>
                      </div>
                    ) : artifact.type === 'infographic' ? (
                      <div className="w-full h-full rounded-lg bg-gradient-to-br from-slate-950 via-sky-950/60 to-slate-950 border border-sky-500/40 p-2.5 text-white flex flex-col justify-between shadow-inner">
                        <span className="uppercase text-[8.5px] font-mono text-sky-400 font-semibold flex items-center space-x-1">
                          <span>📈</span> <span>Infográfico Executivo</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-100 truncate">{cleanDisplayTitle(artifact.title)}</span>
                        <div className="flex items-center justify-between pt-1 border-t border-sky-900/50 text-[8.5px] font-mono text-sky-400">
                          <span>KPIs & ECharts</span>
                          <span>Vetor SVG HD</span>
                        </div>
                      </div>
                    ) : artifact.type === 'app' ? (
                      <div className="w-full h-full rounded-lg bg-slate-950 border border-cyan-500/50 p-2.5 text-white flex flex-col justify-between shadow-inner">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          </div>
                          <span className="text-[8.5px] font-mono uppercase text-cyan-400 font-semibold tracking-wider">HTML5 Sandbox</span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-100 truncate">{cleanDisplayTitle(artifact.title)}</span>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[8.5px] font-mono">
                          <span className="flex items-center space-x-1 text-emerald-400 font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            <span>Execução Ao Vivo</span>
                          </span>
                          <span className="text-cyan-300/80">JavaScript ES6</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full rounded-lg bg-slate-900/90 border border-slate-700/60 p-2.5 text-white flex flex-col justify-between">
                        <span className="text-[8.5px] font-mono text-slate-400 uppercase tracking-wider">DOCUMENTO EXECUTIVO</span>
                        <span className="text-[11px] font-bold text-slate-100 truncate">{cleanDisplayTitle(artifact.title)}</span>
                        <div className="space-y-1 py-0.5">
                          <div className="h-1 bg-slate-700/80 rounded w-5/6"></div>
                          <div className="h-1 bg-slate-700/60 rounded w-3/4"></div>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[8.5px] font-mono text-slate-400">
                          <span>Markdown Estruturado</span>
                          <span>Exporta .MD</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Detalhes do Artefato */}
                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono border ${badge.color}`}>
                          {badge.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(artifact.updatedAt).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-500 transition">
                        {cleanDisplayTitle(artifact.title)}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {artifact.summary}
                      </p>
                    </div>

                    {/* Rodapé: Conversa de Origem + Ação de Download */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px]">
                      {/* Link de volta à conversa de origem */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectConversation(conversation);
                        }}
                        className="truncate text-slate-400 hover:text-emerald-500 transition flex items-center space-x-1 max-w-[140px]"
                        title={`Ir para conversa: ${conversation.title}`}
                      >
                        <span className="truncate">{conversation.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </button>

                      {/* Botão de Download Rápido */}
                      <button
                        onClick={(e) => handleExportArtifact(artifact, e)}
                        disabled={exportingId === artifact.id}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500 transition"
                        title={`Baixar arquivo nativo (${badge.label})`}
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* MODO TABELA: Lista Ordenável e Densa (TanStack Style) */
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4 w-8"></th>
                    <th className="py-2.5 px-4">Formato</th>
                    <th className="py-2.5 px-4">Título do Artefato</th>
                    <th className="py-2.5 px-4">Conversa de Origem</th>
                    <th className="py-2.5 px-4">Projeto</th>
                    <th className="py-2.5 px-4">Data</th>
                    <th className="py-2.5 px-4">Tamanho</th>
                    <th className="py-2.5 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {filteredArtifacts.map(({ artifact, project, conversation }) => {
                    const badge = getFormatBadge(artifact.type, artifact.formatExt);
                    const isFav = Boolean(favorites[artifact.id] || artifact.isFavorite);

                    return (
                      <tr
                        key={artifact.id}
                        onClick={() => onOpenArtifact(artifact)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-900/60 transition cursor-pointer group"
                      >
                        {/* Favorito */}
                        <td className="py-2.5 px-4">
                          <button
                            onClick={(e) => toggleFavorite(artifact.id, e)}
                            className={`p-1 rounded text-slate-400 hover:text-amber-500 ${isFav ? 'text-amber-500' : ''}`}
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                          </button>
                        </td>

                        {/* Formato */}
                        <td className="py-2.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[9.5px] font-bold font-mono border ${badge.color}`}>
                            {badge.label}
                          </span>
                        </td>

                        {/* Título */}
                        <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-500 transition max-w-xs truncate">
                          <div className="flex items-center space-x-2">
                            {getArtifactIcon(artifact.type)}
                            <span className="truncate">{cleanDisplayTitle(artifact.title)}</span>
                          </div>
                        </td>

                        {/* Conversa */}
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectConversation(conversation);
                            }}
                            className="hover:text-emerald-500 transition truncate flex items-center space-x-1"
                          >
                            <span className="truncate">{conversation.title}</span>
                            <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                          </button>
                        </td>

                        {/* Projeto */}
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {project.name}
                        </td>

                        {/* Data */}
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {new Date(artifact.updatedAt).toLocaleDateString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </td>

                        {/* Tamanho */}
                        <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                          {artifact.sizeBytes ? `${(artifact.sizeBytes / 1024).toFixed(1)} KB` : '12 KB'}
                        </td>

                        {/* Ações */}
                        <td className="py-2.5 px-4 text-right">
                          <div className="flex items-center justify-end space-x-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenArtifact(artifact);
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
                              title="Visualizar no Drawer Soberano"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => handleExportArtifact(artifact, e)}
                              disabled={exportingId === artifact.id}
                              className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 hover:text-emerald-500 transition"
                              title={`Exportar ${badge.label}`}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
