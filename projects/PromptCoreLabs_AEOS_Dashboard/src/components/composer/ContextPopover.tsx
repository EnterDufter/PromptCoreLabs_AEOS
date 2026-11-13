import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, Paperclip, Globe, Server, Cpu, Sparkles, 
  BookOpen, ShieldCheck, FileCode, Check, Loader2, ChevronRight, X
} from 'lucide-react';
import { StudyAttachment } from '../../types';
import { studyIngestionService } from '../../services/study/studyIngestionService';

interface ContextPopoverProps {
  onSelectOption: (option: string) => void;
  onStudyAttached?: (attachment: StudyAttachment) => void;
}

interface ContextItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  category: 'files' | 'cognitive' | 'tools';
}

export const ContextPopover: React.FC<ContextPopoverProps> = ({ 
  onSelectOption,
  onStudyAttached 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isIngesting, setIsIngesting] = useState(false);
  const [showCanonicalList, setShowCanonicalList] = useState(false);
  const [canonicalFiles, setCanonicalFiles] = useState<Array<{ filename: string; path: string; sizeBytes: number; category: string }>>([]);
  const [loadingCanonical, setLoadingCanonical] = useState(false);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setShowCanonicalList(false);
      return;
    }
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current && 
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
        setShowCanonicalList(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setShowCanonicalList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const getPortalStyle = (): React.CSSProperties => {
    if (!buttonRef.current) return { display: 'none' };
    const rect = buttonRef.current.getBoundingClientRect();
    return {
      position: 'fixed',
      bottom: `${window.innerHeight - rect.top + 8}px`,
      left: `${Math.max(16, rect.left)}px`,
      zIndex: 9999,
    };
  };

  const handleOpenCanonicalList = async () => {
    setShowCanonicalList(true);
    setLoadingCanonical(true);
    try {
      const res = await fetch('/api/aeos/knowledge/list', { signal: AbortSignal.timeout(2000) });
      if (res.ok) {
        const data = await res.json();
        if (data.ok && Array.isArray(data.files)) {
          setCanonicalFiles(data.files);
        }
      }
    } catch {
      // Fallback com as normas conhecidas
      setCanonicalFiles([
        { filename: 'PCL_COCKPIT_SPEC_V3.6.md', path: 'knowledge/warm/spec.md', sizeBytes: 42000, category: 'Norma' },
        { filename: 'ADR-0007-multi-turn-memory.md', path: 'knowledge/warm/adr0007.md', sizeBytes: 18000, category: 'ADR' },
        { filename: 'Matriz_Competitiva_PCL.md', path: 'knowledge/warm/matriz.md', sizeBytes: 25000, category: 'Benchmark' }
      ]);
    } finally {
      setLoadingCanonical(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsIngesting(true);
    try {
      const result = await studyIngestionService.ingestFile(file);
      if (onStudyAttached) {
        onStudyAttached(result.attachment);
      }
      setIsOpen(false);
    } catch (err: any) {
      console.error('Falha na ingestão do arquivo de estudo:', err);
      alert('Não foi possível ler o arquivo: ' + (err?.message || 'formato ilegível'));
    } finally {
      setIsIngesting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const contextItems: ContextItem[] = [
    // 1. Ingestão & Acervo
    {
      id: 'canonical-library',
      label: 'Acervo Canônico PCL',
      description: 'Explore normas, ADRs arquiteturais e relatórios confidenciais',
      icon: BookOpen,
      iconColor: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60',
      category: 'files'
    },
    {
      id: 'paperclip-local',
      label: 'Anexar Estudo / Arquivo Local',
      description: 'Upload de PDF, DOCX, planilhas XLSX/CSV ou código com indexação local',
      icon: Paperclip,
      iconColor: 'text-sky-500 bg-sky-50 dark:bg-sky-950/60',
      category: 'files'
    },
    // 2. Modos Cognitivos
    {
      id: 'web-search-mode',
      label: 'Busca na Web Verificada',
      description: 'Consulta fontes externas contemporâneas com pílulas de citação',
      icon: Globe,
      iconColor: 'text-blue-500 bg-blue-50 dark:bg-blue-950/60',
      category: 'cognitive'
    },
    {
      id: 'deep-research-mode',
      label: 'Pesquisa Aprofundada (Deep Research)',
      description: 'Gere relatório detalhado com múltiplas iterações e síntese de mercado',
      icon: Sparkles,
      iconColor: 'text-purple-500 bg-purple-50 dark:bg-purple-950/60',
      category: 'cognitive'
    },
    {
      id: 'tlc-spec-gate',
      label: 'Validação TLC v3 (Stage Gates)',
      description: 'Auditoria formal de arquitetura com assinatura de trilha SHA-256',
      icon: ShieldCheck,
      iconColor: 'text-amber-500 bg-amber-50 dark:bg-amber-950/60',
      category: 'cognitive'
    },
    // 3. Servidores MCP & Ferramentas
    {
      id: 'mcp-server',
      label: 'Conectar Servidor MCP',
      description: 'Acione Stitch, Notebooks, BigQuery ou conectores externos BYOS',
      icon: Server,
      iconColor: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60',
      category: 'tools'
    },
    {
      id: 'skill-injection',
      label: 'Injetar Skill de Engenharia',
      description: 'Invoque personas /cortex, /laya, BigQuery SQL ou dbt',
      icon: Cpu,
      iconColor: 'text-rose-500 bg-rose-50 dark:bg-rose-950/60',
      category: 'tools'
    }
  ];

  return (
    <div className="relative">
      {/* Hidden file input for native file dialog */}
      <input 
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,.xlsx,.xls,.csv,.md,.txt,.json,.sql"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        disabled={isIngesting}
        className={`p-2 rounded-xl transition flex items-center justify-center border shadow-2xs ${
          isOpen
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
        }`}
        title="Menu de Ferramentas & Capacidades Multimodais [+]"
      >
        {isIngesting ? (
          <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
        ) : (
          <Plus className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
        )}
      </button>

      {isOpen && createPortal(
        <div
          ref={popoverRef}
          style={getPortalStyle()}
          className="w-88 max-w-[calc(100vw-32px)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 text-xs animate-in fade-in duration-150"
        >
          {showCanonicalList ? (
            /* Submenu do Acervo Canônico PCL */
            <div className="space-y-2">
              <div className="px-2 py-1 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">
                    Acervo Canônico PCL
                  </span>
                </div>
                <button
                  onClick={() => setShowCanonicalList(false)}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-400"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {loadingCanonical ? (
                <div className="py-6 flex flex-col items-center justify-center text-slate-400 space-y-1">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="text-[11px]">Indexando normas canônicas...</span>
                </div>
              ) : canonicalFiles.length === 0 ? (
                <div className="py-4 text-center text-slate-400 text-xs">
                  Nenhum documento canônico encontrado.
                </div>
              ) : (
                <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-1 p-0.5">
                  {canonicalFiles.map((doc, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectOption(`[Acervo Canônico: ${doc.filename}]`);
                        setIsOpen(false);
                        setShowCanonicalList(false);
                      }}
                      className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-medium text-xs text-slate-800 dark:text-slate-200 block truncate group-hover:text-emerald-500">
                          {doc.filename}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {doc.category || 'Especificação'} • {(doc.sizeBytes / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <ChevronRight className="w-3 h-3 text-slate-400 opacity-60 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Menu Principal de Contexto */
            <>
              {/* Header */}
              <div className="px-3 py-1.5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  Adicionar ao Contexto
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                  Escopo Ativo
                </span>
              </div>

              <div className="space-y-2 max-h-[360px] overflow-y-auto custom-scrollbar p-0.5">
                {/* Categoria 1: Ingestão */}
                <div>
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-1">
                    Acervo & Arquivos Locais
                  </span>
                  <div className="space-y-0.5">
                    {contextItems.filter(i => i.category === 'files').map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.id === 'paperclip-local') {
                              fileInputRef.current?.click();
                            } else if (item.id === 'canonical-library') {
                              handleOpenCanonicalList();
                            } else {
                              onSelectOption(item.label);
                              setIsOpen(false);
                            }
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 flex items-start space-x-2.5 transition group"
                        >
                          <div className={`p-1.5 rounded-lg ${item.iconColor} flex-shrink-0 mt-0.5`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition truncate">
                              {item.label}
                            </span>
                            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {item.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Categoria 2: Modos Cognitivos */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1.5">
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-1">
                    Modos Cognitivos
                  </span>
                  <div className="space-y-0.5">
                    {contextItems.filter(i => i.category === 'cognitive').map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectOption(item.label);
                            setIsOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 flex items-start space-x-2.5 transition group"
                        >
                          <div className={`p-1.5 rounded-lg ${item.iconColor} flex-shrink-0 mt-0.5`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block group-hover:text-sky-600 dark:group-hover:text-sky-400 transition truncate">
                              {item.label}
                            </span>
                            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {item.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Categoria 3: MCP & Ferramentas */}
                <div className="border-t border-slate-100 dark:border-slate-800/80 pt-1.5">
                  <span className="text-[9.5px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500 px-2 block mb-1">
                    Servidores MCP & Skills
                  </span>
                  <div className="space-y-0.5">
                    {contextItems.filter(i => i.category === 'tools').map(item => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            onSelectOption(item.label);
                            setIsOpen(false);
                          }}
                          className="w-full text-left p-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/60 flex items-start space-x-2.5 transition group"
                        >
                          <div className={`p-1.5 rounded-lg ${item.iconColor} flex-shrink-0 mt-0.5`}>
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-xs text-slate-800 dark:text-slate-200 block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition truncate">
                              {item.label}
                            </span>
                            <span className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {item.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
};
