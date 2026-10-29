import React from 'react';
import { Users, Bot, GitBranch, ArrowDown, ChevronRight, ShieldCheck, Cpu } from 'lucide-react';

export const AgentSquadOrgChart: React.FC = () => {
  const squads = [
    {
      name: 'Squad Next Gen Sports',
      lead: 'Eduardo Antigravity (System Admin)',
      agents: [
        { name: 'Cortex Master', role: 'Orquestrador de Arquitetura & Diagrams', model: 'Ollama llama3.3:70b' },
        { name: 'Paperclip Auditor', role: 'Validação de Anexos & Contexto', model: 'Ollama qwen2.5:72b' },
        { name: 'Omniroute Router', role: 'Roteamento Inteligente Híbrido', model: 'Omniroute Local Core' }
      ]
    },
    {
      name: 'Squad Arch Living',
      lead: 'Ana Silva (Squad Lead)',
      agents: [
        { name: 'Arch Designer', role: 'Renderização Visual & Layouts', model: 'Claude 3.5 Sonnet' },
        { name: 'Code Reviewer', role: 'Stage Gate QA & Linter', model: 'GPT-4o' }
      ]
    }
  ];

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-100 select-none">
      <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800">
        <div className="flex items-center space-x-2">
          <GitBranch className="w-5 h-5 text-indigo-400" />
          <h3 className="font-bold text-sm">Organograma Hierárquico de Squads & Agentes</h3>
        </div>
        <p className="text-slate-400 text-[11px] mt-1">
          Visualização da estrutura organizacional de inteligências autônomas delegadas por squads.
        </p>
      </div>

      <div className="space-y-6">
        {squads.map((sq, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-indigo-500" />
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{sq.name}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Lead: {sq.lead}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {sq.agents.map((ag, aIdx) => (
                <div
                  key={aIdx}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-emerald-500" />
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{ag.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">{ag.role}</p>
                  <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 block pt-1 border-t border-slate-200/50 dark:border-slate-800">
                    Engine: {ag.model}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
