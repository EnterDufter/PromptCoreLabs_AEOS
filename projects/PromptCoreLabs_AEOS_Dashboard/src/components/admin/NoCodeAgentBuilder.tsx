import React, { useState } from 'react';
import { Bot, Cpu, Sparkles, CheckCircle, Save, Plus } from 'lucide-react';

export const NoCodeAgentBuilder: React.FC = () => {
  const [agentName, setAgentName] = useState('');
  const [agentRole, setAgentRole] = useState('');
  const [selectedModel, setSelectedModel] = useState('Ollama llama3.3:70b ($0.00)');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['cortex', 'accidental-data-loss-prevention']);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const availableSkills = [
    { key: 'cortex', name: 'Cortex Architecture Engine' },
    { key: 'accidental-data-loss-prevention', name: 'Data Loss Prevention Guard' },
    { key: 'bigquery-sql', name: 'BigQuery SQL Optimizer' },
    { key: 'whisper-voice', name: 'Whisper WASM Local Audio Transcriber' }
  ];

  const toggleSkill = (key: string) => {
    if (selectedSkills.includes(key)) {
      setSelectedSkills(selectedSkills.filter(s => s !== key));
    } else {
      setSelectedSkills([...selectedSkills, key]);
    }
  };

  const handleSaveAgent = () => {
    if (!agentName) return;
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-100 select-none">
      {/* Banner */}
      <div className="p-4 rounded-xl bg-slate-900 text-white dark:bg-slate-950 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm">Criador No-Code Visual de Agentes & Skills</h3>
          </div>
          <p className="text-slate-400 text-[11px] mt-1">
            Interface intuitiva sem código para gestores e usuários leigos montarem inteligências customizadas com 1 clique.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span className="font-bold">Agente de IA criado e publicado na Squad com sucesso!</span>
        </div>
      )}

      {/* Form */}
      <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
              Nome do Agente
            </label>
            <input
              type="text"
              placeholder="Ex: Auditor Financeiro de Contratos"
              value={agentName}
              onChange={e => setAgentName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
              Papel / Especialidade
            </label>
            <input
              type="text"
              placeholder="Ex: Revisar cláusulas legais e conformidade tributária"
              value={agentRole}
              onChange={e => setAgentRole(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {/* Model Selection */}
        <div>
          <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
            Motor de Inteligência LLM (Omniroute)
          </label>
          <select
            value={selectedModel}
            onChange={e => setSelectedModel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none font-mono"
          >
            <option value="Ollama llama3.3:70b ($0.00)">Ollama llama3.3:70b ($0.00 Local - Recomendado)</option>
            <option value="Ollama qwen2.5:72b ($0.00)">Ollama qwen2.5:72b ($0.00 Local)</option>
            <option value="Claude 3.5 Sonnet (Cloud)">Claude 3.5 Sonnet (Cloud)</option>
            <option value="GPT-4o (Cloud)">GPT-4o (Cloud)</option>
          </select>
        </div>

        {/* Skills Selector */}
        <div>
          <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-2">
            Vincular Skills Executáveis
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {availableSkills.map(sk => {
              const isChecked = selectedSkills.includes(sk.key);
              return (
                <div
                  key={sk.key}
                  onClick={() => toggleSkill(sk.key)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                    isChecked
                      ? 'bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 border-emerald-500'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="font-medium text-xs">{sk.name}</span>
                  {isChecked && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSaveAgent}
          disabled={!agentName}
          className={`w-full py-2.5 rounded-lg font-bold transition flex items-center justify-center space-x-2 ${
            agentName
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
          }`}
        >
          <Save className="w-4 h-4" />
          <span>Publicar Agente de IA na Squad</span>
        </button>
      </div>
    </div>
  );
};
