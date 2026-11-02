import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Paperclip, Globe, Server, Cpu, Sparkles, FileCode, Check } from 'lucide-react';

interface ContextPopoverProps {
  onSelectOption: (option: string) => void;
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

  const options = [
    { id: 'paperclip', label: 'Anexar Arquivo Local (Paperclip)', icon: Paperclip, detail: 'PDF, Imagens, CSV, Code' },
    { id: 'drive', label: 'Google Workspace / OneDrive', icon: Globe, detail: 'Google Docs, Sheets, Slides' },
    { id: 'mcp', label: 'Acionar Servidor MCP (Stitch, Notebooks)', icon: Server, detail: 'Model Context Protocol' },
    { id: 'skill', label: 'Injetar Skill PCL AEOS', icon: Cpu, detail: 'Cortex, BigQuery, dbt, PII Guard' }
  ];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex items-center justify-center border border-slate-200 dark:border-slate-800"
        title="Menu Multimodal [+] (Anexos, MCP, Skills, Integrações)"
      >
        <Plus className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`} />
      </button>

      {isOpen && createPortal(
        <div
          ref={popoverRef}
          style={getPortalStyle()}
          className="w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-2 text-xs animate-in fade-in duration-150"
        >
          <div className="px-3 py-1.5 font-semibold text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 mb-1">
            Menu de Contexto Multimodal
          </div>

          <div className="space-y-1">
            {options.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectOption(opt.label);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 flex items-start space-x-2.5 transition group"
                >
                  <Icon className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 block group-hover:text-emerald-500 transition">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-slate-400">{opt.detail}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
