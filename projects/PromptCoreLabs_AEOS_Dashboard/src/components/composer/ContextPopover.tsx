import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Plus, Paperclip, Globe, Server, Cpu, Sparkles, 
  BookOpen, ShieldCheck, FileCode, Check 
} from 'lucide-react';

interface ContextPopoverProps {
  onSelectOption: (option: string) => void;
}

interface ContextItem {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  category: 'files' | 'cognitive' | 'tools';
}

export const ContextPopover: React.FC<ContextPopoverProps> = ({ onSelectOption }) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current && 
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
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
      label: 'Anexar Arquivo Local',
      description: 'Faça upload de PDF, planilhas CSV, imagens ou código',
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
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition flex items-center justify-center border shadow-2xs ${
          isOpen
            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
        }`}
        title="Menu de Ferramentas & Capacidades Multimodais [+]"
      >
        <Plus className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div
          ref={popoverRef}
          style={getPortalStyle()}
          className="w-84 max-w-[calc(100vw-32px)] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-2 text-xs animate-in fade-in duration-150"
        >
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
                Acervo & Arquivos
              </span>
              <div className="space-y-0.5">
                {contextItems.filter(i => i.category === 'files').map(item => {
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
        </div>,
        document.body
      )}
    </div>
  );
};
