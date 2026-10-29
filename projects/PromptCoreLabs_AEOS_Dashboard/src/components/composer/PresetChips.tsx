import React from 'react';

interface PresetChipsProps {
  onSelectPreset: (promptText: string) => void;
}

export const PresetChips: React.FC<PresetChipsProps> = ({ onSelectPreset }) => {
  const presets = [
    { label: '⚡ Analisar Arquitetura Cortex', prompt: 'Realize uma análise detalhada da topologia Cortex e dos Stage Gates de validação.' },
    { label: '🛡️ Audit Trail ISO 27001/42001', prompt: 'Gerar relatório de conformidade auditável com assinatura imutável SHA-256.' },
    { label: '📊 Relatório de Consumo Híbrido', prompt: 'Exibir painel comparativo de consumo Ollama $0.00 vs Provedores Cloud.' },
    { label: '🤖 Criar Nova Skill No-Code', prompt: 'Abrir assistente visual para criação e exportação de Skill em SKILL.md.' }
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 text-[11px] custom-scrollbar select-none">
      {presets.map((p, idx) => (
        <button
          key={idx}
          onClick={() => onSelectPreset(p.prompt)}
          className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition"
        >
          {p.label}
        </button>
      ))}
    </div>
  );
};
