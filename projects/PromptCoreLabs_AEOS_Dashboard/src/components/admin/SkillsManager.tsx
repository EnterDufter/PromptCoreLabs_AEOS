import React, { useState } from 'react';
import { Cpu, Plus, Download, Upload, Edit3, Trash2, CheckCircle, FileText, Code } from 'lucide-react';
import { Skill } from '../../types';

export const SkillsManager: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: 'skl-1',
      key: 'cortex',
      name: 'Cortex Architecture Engine',
      description: 'Persona de Inteligência e Visualização de Arquitetura do PCL AEOS.',
      sourcePath: 'c:\\PromptCore_Labs\\.agents\\skills\\cortex\\SKILL.md',
      mode: 'Editable',
      usedByAgents: ['Cortex Master', 'Claude 3.5 Architect'],
      markdownContent: '---\nname: cortex\ndescription: Persona de inteligência visual...\n---\n# Instructions\n...'
    },
    {
      id: 'skl-2',
      key: 'accidental-data-loss-prevention',
      name: 'Data Loss Prevention Guard',
      description: 'Confirmação obrigatória antes de executar comandos destrutivos.',
      sourcePath: 'C:\\Users\\eduma\\.gemini\\config\\skills\\accidental-data-loss-prevention\\SKILL.md',
      mode: 'Read-Only',
      usedByAgents: ['Paperclip Auditor', 'Cortex Master'],
      markdownContent: '# SKILL: Data Loss Prevention Guard\n...'
    },
    {
      id: 'skl-3',
      key: 'bigquery-sql',
      name: 'BigQuery SQL Optimizer',
      description: 'Técnicas avançadas de otimização de consulta e particionamento.',
      sourcePath: 'C:\\Users\\eduma\\.gemini\\config\\skills\\bigquery-sql\\SKILL.md',
      mode: 'Editable',
      usedByAgents: ['Cortex Master'],
      markdownContent: '# SKILL: BigQuery SQL\n...'
    }
  ]);

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(skills[0]);

  return (
    <div className="space-y-4 text-xs text-slate-800 dark:text-slate-100 select-none">
      {/* Top Action Bar */}
      <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm">Gerenciador Geral de Skills</h3>
          <p className="text-slate-400 text-[11px] mt-0.5">
            Crie, edite, importe (.md/zip) e exporte habilidades executáveis pelos Agentes do PCL AEOS.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition flex items-center space-x-1">
            <Upload className="w-3.5 h-3.5" />
            <span>Importar Skill</span>
          </button>
          <button className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition flex items-center space-x-1">
            <Plus className="w-3.5 h-3.5" />
            <span>Criar Nova Skill</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Skills List (Left) & Markdown Editor (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left List */}
        <div className="space-y-2">
          <span className="font-bold text-[10px] uppercase tracking-wider text-slate-400 block px-1">
            Skills Registradas ({skills.length})
          </span>

          {skills.map(skill => {
            const isSelected = selectedSkill?.id === skill.id;
            return (
              <div
                key={skill.id}
                onClick={() => setSelectedSkill(skill)}
                className={`p-3 rounded-xl border cursor-pointer transition space-y-1.5 ${
                  isSelected
                    ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 border-emerald-500 shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs truncate">{skill.name}</span>
                  <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono ${
                    skill.mode === 'Editable' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {skill.mode}
                  </span>
                </div>

                <p className="text-[10px] opacity-80 line-clamp-1">{skill.description}</p>

                {/* Used By Agents Chip */}
                <div className="pt-1 text-[9px] font-mono opacity-90 border-t border-slate-200/40 dark:border-slate-800">
                  <span className="opacity-70">USED BY:</span> {skill.usedByAgents.join(', ')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Editor Preview */}
        {selectedSkill && (
          <div className="md:col-span-2 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <span className="font-bold text-sm text-slate-800 dark:text-slate-100">{selectedSkill.name}</span>
                <span className="text-[10px] text-slate-400 font-mono block">{selectedSkill.sourcePath}</span>
              </div>
              <button className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 flex items-center space-x-1 transition font-medium">
                <Download className="w-3.5 h-3.5" />
                <span>Exportar .md</span>
              </button>
            </div>

            <textarea
              readOnly={selectedSkill.mode === 'Read-Only'}
              value={selectedSkill.markdownContent}
              onChange={e => setSelectedSkill({ ...selectedSkill, markdownContent: e.target.value })}
              className="flex-1 w-full min-h-[220px] bg-slate-950 text-slate-100 font-mono text-xs p-3 rounded-lg border border-slate-800 focus:outline-none custom-scrollbar"
            ></textarea>
          </div>
        )}
      </div>
    </div>
  );
};
