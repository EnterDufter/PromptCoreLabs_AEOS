import React, { useState, useEffect } from 'react';
import {
  Bot, Cpu, Sparkles, CheckCircle, Save, Plus, ArrowRight, ArrowLeft,
  ShieldCheck, Zap, DollarSign, HelpCircle, Layers, Users, ExternalLink,
  Lock, Check, Palette, FileText, CheckCircle2
} from 'lucide-react';
import { squadService, SquadDefinition } from '../../services/admin/squadService';
import { skillsService } from '../../services/admin/skillsService';

export const NoCodeAgentBuilder: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [squads, setSquads] = useState<SquadDefinition[]>(squadService.getSquads());

  // Step 1: Identity & Mission
  const [agentName, setAgentName] = useState('');
  const [targetSquadId, setTargetSquadId] = useState(squads[0]?.id || '');
  const [selectedAvatar, setSelectedAvatar] = useState('Bot');
  const [agentMission, setAgentMission] = useState('');

  // Step 2: Brain & FinOps
  const [selectedEngine, setSelectedEngine] = useState<'local' | 'cloud'>('local');
  const [selectedModel, setSelectedModel] = useState('Ollama qwen2.5-coder:7b-instruct-q4_K_M');
  const [autonomyLevel, setAutonomyLevel] = useState<'Assistido (TLC v3)' | 'Supervisionado' | 'Autônomo'>('Assistido (TLC v3)');

  // Step 3: Skills & Tools
  const [selectedSkills, setSelectedSkills] = useState<string[]>(['cortex', 'accidental-data-loss-prevention']);

  // Step 4: Governance & Hard Lock
  const [monthlyBudgetUSD, setMonthlyBudgetUSD] = useState<number>(0);
  const [piiRedactionEnabled, setPiiRedactionEnabled] = useState(true);
  const [layaStalenessGuard, setLayaStalenessGuard] = useState(true);

  // Success state
  const [isPublished, setIsPublished] = useState(false);
  const [publishedAgentName, setPublishedAgentName] = useState('');

  const allSkills = skillsService.getSkills();

  useEffect(() => {
    const unsubscribe = squadService.subscribe(updated => {
      setSquads(updated);
      if (!targetSquadId && updated.length > 0) {
        setTargetSquadId(updated[0].id);
      }
    });
    return () => unsubscribe();
  }, [targetSquadId]);

  const toggleSkill = (key: string) => {
    if (selectedSkills.includes(key)) {
      setSelectedSkills(selectedSkills.filter(s => s !== key));
    } else {
      setSelectedSkills([...selectedSkills, key]);
    }
  };

  const handlePublishAgent = () => {
    if (!agentName.trim() || !targetSquadId) return;

    const isLocal = selectedEngine === 'local';
    const chosenModel = isLocal ? 'Ollama qwen2.5-coder:7b-instruct-q4_K_M' : selectedModel;

    squadService.addAgent(targetSquadId, {
      name: agentName,
      role: agentMission,
      model: chosenModel,
      status: 'active',
      autonomyLevel: autonomyLevel,
      systemPrompt: `Você é o agente corporativo ${agentName}. Sua missão: ${agentMission}. Opere em conformidade com o TLC v3 e normas PCL AEOS.`,
      assignedSkills: selectedSkills,
      isLocalSovereign: isLocal,
      monthlyBudgetCapUSD: monthlyBudgetUSD
    });

    setPublishedAgentName(agentName);
    setIsPublished(true);
  };

  const handleResetWizard = () => {
    setCurrentStep(1);
    setAgentName('');
    setAgentMission('');
    setSelectedEngine('local');
    setSelectedModel('Ollama qwen2.5-coder:7b-instruct-q4_K_M');
    setAutonomyLevel('Assistido (TLC v3)');
    setSelectedSkills(['cortex', 'accidental-data-loss-prevention']);
    setMonthlyBudgetUSD(0);
    setIsPublished(false);
  };

  const selectedSquad = squads.find(s => s.id === targetSquadId) || squads[0];

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-100 select-none pb-12">
      {/* Executive Purpose & Value Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Criador No-Code Visual de Agentes de IA
              </h2>
            </div>
            <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
              Crie e publique inteligências artificiais especializadas em 4 passos sem programar. O novo agente entra imediatamente em operação no seu Squad e pode ser chamado no chat com <strong className="text-white">@NomeDoAgente</strong>.
            </p>
          </div>

          <div className="hidden sm:flex items-center space-x-2 text-[11px] bg-slate-950/60 px-3.5 py-2 rounded-xl border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Publicação Direta no Cockpit</span>
          </div>
        </div>

        {/* Wizard Stepper Progress Bar */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 mt-6 pt-5 border-t border-slate-800/80">
          {[
            { step: 1, label: '1. Identidade & Missão' },
            { step: 2, label: '2. Cérebro & FinOps' },
            { step: 3, label: '3. Habilidades & Skills' },
            { step: 4, label: '4. Governança & Publicação' }
          ].map((st) => (
            <div
              key={st.step}
              onClick={() => !isPublished && setCurrentStep(st.step)}
              className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${currentStep === st.step
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm font-bold'
                  : currentStep > st.step
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-medium'
                    : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
                }`}
            >
              <span className="text-[11px] block truncate">{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area: Wizard Steps + Live Preview Card */}
      {!isPublished ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Form: Active Step */}
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-5 shadow-sm">
            {/* STEP 1: IDENTIDADE & MISSÃO */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Passo 1: Identidade & Missão do Agente
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Dê um nome intuitivo e defina a qual equipe corporativa este agente pertencerá.
                  </p>
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                    Nome do Agente *
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Auditor Tributário, Analista de Contratos, QA Tester"
                    value={agentName}
                    onChange={e => setAgentName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-medium text-xs"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Será invocado no chat via: <code>@{agentName ? agentName.toLowerCase().replace(/\s+/g, '') : 'nome'}</code>
                  </span>
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                    Squad de Destino *
                  </label>
                  <select
                    value={targetSquadId}
                    onChange={e => setTargetSquadId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-medium text-xs"
                  >
                    {squads.map(sq => (
                      <option key={sq.id} value={sq.id}>
                        {sq.name} ({sq.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                    Missão Principal (O que este agente deve fazer?) *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Ex: Analisar minutas de contratos comerciais, confrontar com as políticas da empresa e alertar sobre cláusulas abusivas ou penalidades desproporcionais."
                    value={agentMission}
                    onChange={e => setAgentMission(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-medium text-xs leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* STEP 2: CÉREBRO & FINOPS */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Passo 2: Cérebro de Inferência & Estratégia FinOps
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Escolha onde o modelo executará suas decisões: Soberano Local ($0.00) ou Nuvem Externa.
                  </p>
                </div>

                {/* Engine Selector Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => {
                      setSelectedEngine('local');
                      setSelectedModel('Ollama qwen2.5-coder:7b-instruct-q4_K_M');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${selectedEngine === 'local'
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-70'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          Soberano Local ($0.00)
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white font-mono">
                        RECOMENDADO
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Executa 100% no servidor host local (Ollama + Laya). Resíduo zero de dados e sem faturas em dólar.
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      setSelectedEngine('cloud');
                      setSelectedModel('Claude 3.5 Sonnet');
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition space-y-2 ${selectedEngine === 'cloud'
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 ring-2 ring-indigo-500/20'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-70'
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Cpu className="w-4 h-4 text-indigo-500" />
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          Nuvem de Alta Performance
                        </span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-600 text-white font-mono">
                        CLOUD
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Inferência em nuvem (Claude 3.5 Sonnet ou GPT-4o). Requer orçamento configurado.
                    </p>
                  </div>
                </div>

                {selectedEngine === 'cloud' && (
                  <div>
                    <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                      Modelo em Nuvem
                    </label>
                    <select
                      value={selectedModel}
                      onChange={e => setSelectedModel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-mono text-xs"
                    >
                      <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Anthropic Direct)</option>
                      <option value="GPT-4o">GPT-4o (OpenAI Enterprise)</option>
                      <option value="Gemini 1.5 Pro">Gemini 1.5 Pro (Google Cloud Vertex)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="font-bold text-xs text-slate-700 dark:text-slate-300 block mb-1">
                    Grau de Autonomia (Governança TLC v3)
                  </label>
                  <select
                    value={autonomyLevel}
                    onChange={e => setAutonomyLevel(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-slate-100 font-medium text-xs"
                  >
                    <option value="Assistido (TLC v3)">
                      Assistido (TLC v3) — Sempre pede confirmação humana antes de executar
                    </option>
                    <option value="Supervisionado">
                      Supervisionado — Executa leituras e pede confirmação em ações de escrita
                    </option>
                    <option value="Autônomo">
                      Autônomo — Roda em segundo plano sob auditoria contínua
                    </option>
                  </select>
                </div>
              </div>
            )}

            {/* STEP 3: HABILIDADES & FERRAMENTAS */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Passo 3: Habilidades & Ferramentas Executáveis
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Selecione quais rotinas este agente pode acionar para cumprir sua missão.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                  {allSkills.map(sk => {
                    const isChecked = selectedSkills.includes(sk.key);
                    return (
                      <div
                        key={sk.key}
                        onClick={() => toggleSkill(sk.key)}
                        className={`p-3 rounded-xl border cursor-pointer transition flex items-start justify-between space-x-2 ${isChecked
                            ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 ring-1 ring-emerald-500/20'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                          }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
                            {sk.name}
                          </span>
                          <span className="text-[10px] text-slate-500 line-clamp-1">
                            {sk.description}
                          </span>
                          <span className="text-[9px] font-mono text-indigo-600 dark:text-indigo-400 block pt-1">
                            {sk.domain}
                          </span>
                        </div>
                        {isChecked && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: GOVERNANÇA, FINOPS & PUBLICAÇÃO */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Passo 4: Governança, Teto Orçamentário & Revisão Final
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Defina limites financeiros e blindagens de segurança antes da publicação.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Lock className="w-4 h-4 text-indigo-500" />
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          Redação Automática de PII (LGPD / ISO 27001)
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={piiRedactionEnabled}
                        onChange={e => setPiiRedactionEnabled(e.target.checked)}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Ofusca automaticamente dados pessoais como CPF, cartões de crédito e emails em memória.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-xs text-slate-900 dark:text-slate-100">
                          Validador de Staleness do Coprocessador Laya
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={layaStalenessGuard}
                        onChange={e => setLayaStalenessGuard(e.target.checked)}
                        className="rounded text-emerald-600 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Coprocessador em CPU INT8 (0 MB VRAM) verifica contradições e stale claims em ~20ms.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold transition flex items-center space-x-1.5 ${currentStep === 1
                    ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar</span>
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                  disabled={!agentName.trim() && currentStep === 1}
                  className={`px-5 py-2 rounded-xl font-bold text-white transition flex items-center space-x-1.5 ${agentName.trim() || currentStep > 1
                      ? 'bg-indigo-600 hover:bg-indigo-500 shadow-sm'
                      : 'bg-slate-400 cursor-not-allowed'
                    }`}
                >
                  <span>Próximo Passo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={handlePublishAgent}
                  disabled={!agentName.trim()}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center space-x-2 shadow-md shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Publicar Agente no PCL Cockpit</span>
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Live Agent Preview Card */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
              Pré-visualização Executiva em Tempo Real
            </span>

            {/* Simulated Agent Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 border border-slate-200 dark:border-slate-800 space-y-3.5 shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${selectedEngine === 'local'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                    }`}>
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-900 dark:text-slate-100 block">
                      {agentName || 'Nome do Agente'}
                    </span>
                    <span className="text-[11px] font-mono text-indigo-600 dark:text-indigo-400 block">
                      @{agentName ? agentName.toLowerCase().replace(/\s+/g, '') : 'seunome'}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-mono">
                  {selectedEngine === 'local' ? '$0.00 SOBERANO' : 'CLOUD API'}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Missão Atribuída</span>
                <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{agentMission || 'Defina a missão no Passo 1 para visualizar o resumo...'}"
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/80 text-[10px]">
                <div>
                  <span className="text-slate-400 block font-mono">Squad:</span>
                  <strong className="text-slate-800 dark:text-slate-200 truncate block">
                    {selectedSquad?.name || 'Squad Principal'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono">Autonomia:</span>
                  <strong className="text-slate-800 dark:text-slate-200 block truncate">
                    {autonomyLevel}
                  </strong>
                </div>
              </div>

              {/* Skills linked in preview */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-mono block mb-1">
                  Skills Vinculadas ({selectedSkills.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedSkills.map(skKey => (
                    <span
                      key={skKey}
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                    >
                      #{skKey}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick explanation pill */}
            <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-[11px] text-indigo-900 dark:text-indigo-300 space-y-1">
              <strong className="block font-bold">O que acontece ao clicar em Publicar?</strong>
              <p className="leading-relaxed">
                O agente é imediatamente injetado no motor de orquestração do Cockpit. Ele constará no Organograma de Squads e responderá às menções no Chat Stream sem necessidade de reiniciar a aplicação.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* SUCCESS CELEBRATION VIEW */
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-5 max-w-xl mx-auto shadow-lg animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Agente "{publishedAgentName}" Publicado com Sucesso!
            </h3>
            <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
              Sua nova inteligência de IA foi registrada no Squad e já está ativa com todas as diretrizes de governança e FinOps configuradas.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 text-slate-100 font-mono text-xs border border-slate-800 text-left space-y-2">
            <span className="text-[10px] text-slate-400 uppercase block font-bold">
              Como invocar no Chat Stream:
            </span>
            <div className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 select-all border border-slate-800">
              @{publishedAgentName.toLowerCase().replace(/\s+/g, '')} Olá, analise o documento anexo de acordo com sua missão.
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetWizard}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              Criar Outro Agente
            </button>
            <button
              onClick={() => {
                // Alterna para squads ou recarrega
                window.location.reload();
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center justify-center space-x-1.5"
            >
              <span>Ver no Organograma de Squads</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
