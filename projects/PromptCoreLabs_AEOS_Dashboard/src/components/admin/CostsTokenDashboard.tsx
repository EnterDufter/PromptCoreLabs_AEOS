import React, { useState } from 'react';
import { 
  DollarSign, Cpu, TrendingDown, ShieldAlert, CheckCircle2, 
  ChevronDown, ChevronRight, Sliders, Users, AlertCircle, Edit2, 
  X, Check, Lock, Sparkles
} from 'lucide-react';
import { budgetControlService, DepartmentBudget, UserBudget, WorkspaceBudgetConfig } from '../../services/governance/budgetControlService';

export const CostsTokenDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'budget'>('overview');
  const [config, setConfig] = useState<WorkspaceBudgetConfig>(budgetControlService.getConfig());
  const [departments] = useState<DepartmentBudget[]>(budgetControlService.getDepartments());
  const [expandedDept, setExpandedDept] = useState<string | null>('tech');
  const [showEditModal, setShowEditModal] = useState(false);
  const [providerView, setProviderView] = useState<'providers' | 'models'>('providers');

  // Modal editing temporary state
  const [tempLimit, setTempLimit] = useState(config.monthlyLimitUSD);
  const [tempHardLock, setTempHardLock] = useState(config.hardLockEnabled);
  const [tempNotify, setTempNotify] = useState(config.notifyAdminAtLimit);

  const percentUsed = Math.round((config.currentSpendUSD / config.monthlyLimitUSD) * 100);
  const availableUSD = Math.max(0, config.monthlyLimitUSD - config.currentSpendUSD);

  const handleSaveBudget = () => {
    const updated = budgetControlService.updateConfig({
      monthlyLimitUSD: tempLimit,
      hardLockEnabled: tempHardLock,
      notifyAdminAtLimit: tempNotify
    });
    setConfig(updated);
    setShowEditModal(false);
  };

  const usersInExpandedDept = expandedDept ? budgetControlService.getUsersByDepartment(expandedDept) : [];

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-100 select-none">
      {/* Top Header Bar & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Controle Orçamentário & Governança de IA</h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Acompanhamento de consumo por modelo, rateio por squad e travas rígidas de faturamento.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center space-x-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 self-start">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              activeTab === 'overview'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition ${
              activeTab === 'budget'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs font-semibold'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Orçamento & Alocação
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Top 3 Metric Bento Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Orçamento Utilizado */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                <span className="font-medium text-xs">Orçamento de IA utilizado</span>
                <span className="font-bold text-xs font-mono text-slate-800 dark:text-slate-200">{percentUsed}%</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <span className="text-[10px] text-slate-400 block">Gasto este mês</span>
                  <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                    ${config.currentSpendUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Disponível</span>
                  <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                    ${availableUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${percentUsed > 90 ? 'bg-rose-500' : 'bg-slate-900 dark:bg-slate-100'}`}
                  style={{ width: `${Math.min(100, percentUsed)}%` }}
                />
              </div>
            </div>

            {/* 2. Gasto Diário */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Gasto diário médio</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 pt-2">
                ${config.dailyAverageUSD.toFixed(2)}
              </p>
              <span className="text-[10px] text-slate-400 font-sans block">
                Média calculada sobre os últimos 25 dias operacionais
              </span>
            </div>

            {/* 3. Projeção do Mês */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block">Projeção do mês</span>
              <p className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 pt-2">
                ${config.monthlyProjectionUSD.toFixed(2)}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                ✓ Dentro do limite teto de ${config.monthlyLimitUSD.toLocaleString('en-US')}
              </span>
            </div>
          </div>

          {/* Breakdown Section: Provedores/Modelos & Economia Local */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Gastos por Provedor / Modelo */}
            <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                  {providerView === 'providers' ? 'Gastos por provedor' : 'Gastos por modelo'}
                </span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setProviderView('providers')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      providerView === 'providers'
                        ? 'bg-slate-200 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Provedores
                  </button>
                  <button
                    onClick={() => setProviderView('models')}
                    className={`px-2 py-0.5 rounded text-[10px] transition ${
                      providerView === 'models'
                        ? 'bg-slate-200 dark:bg-slate-800 font-semibold text-slate-800 dark:text-slate-200'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Modelos
                  </button>
                </div>
              </div>

              {providerView === 'providers' ? (
                <div className="space-y-2">
                  {[
                    { name: 'Anthropic', models: '5 modelos ativos', spend: 4174.40, color: 'text-amber-600' },
                    { name: 'Qwen / Alibaba', models: '4 modelos ativos', spend: 94.10, color: 'text-indigo-600' },
                    { name: 'Grok / xAI', models: '3 modelos ativos', spend: 94.05, color: 'text-blue-600' }
                  ].map((p, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                      <div>
                        <span className="font-medium text-xs text-slate-800 dark:text-slate-200 block">{p.name}</span>
                        <span className="text-[10px] text-slate-400">{p.models}</span>
                      </div>
                      <span className="font-mono font-semibold text-xs text-slate-800 dark:text-slate-200">
                        ${p.spend.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { name: 'claude-sonnet-4-5', provider: 'Anthropic', spend: 860.20 },
                    { name: 'Qwen3.8-Max', provider: 'Qwen', spend: 94.10 },
                    { name: 'Grok 4.7', provider: 'Grok', spend: 58.40 },
                    { name: 'Grok 4.5', provider: 'Grok', spend: 35.65 },
                    { name: 'gpt-4.1-nano', provider: 'OpenAI', spend: 12.35 }
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800/60 last:border-0">
                      <div>
                        <span className="font-medium text-xs text-slate-800 dark:text-slate-200 block font-mono">{m.name}</span>
                        <span className="text-[10px] text-slate-400">{m.provider}</span>
                      </div>
                      <span className="font-mono font-semibold text-xs text-slate-800 dark:text-slate-200">
                        ${m.spend.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Economia Estratégica Soberana */}
            <div className="p-4 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/70 dark:border-emerald-800/60 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-emerald-800 dark:text-emerald-300 flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Economia Roteamento Local ($0.00)</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 font-bold">
                  95.2% Local
                </span>
              </div>
              <p className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-200">
                $850.00 USD Poupados
              </p>
              <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400 leading-relaxed">
                42.5M tokens processados em CPU local via Laya e Ollama privado, sem chamadas a APIs pagas de nuvem e com proteção de dados ponta a ponta.
              </p>
              <div className="pt-2 border-t border-emerald-200/50 dark:border-emerald-800/40 flex items-center justify-between text-[10px] font-mono text-emerald-700 dark:text-emerald-300">
                <span>Tríade de Resiliência: Ativa</span>
                <span>Audit Trail SHA-256</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-4">
          {/* Corporate Budget Overview Card */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">Orçamento de IA da empresa</span>
                {config.hardLockEnabled && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium flex items-center space-x-1">
                    <Lock className="w-3 h-3" />
                    <span>Hard Lock Ativo</span>
                  </span>
                )}
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-1">
                ${config.monthlyLimitUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                <span className="text-xs font-normal text-slate-400 ml-1.5 font-sans">/ mensal</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">
                <span>Alocado: ${config.allocatedUSD.toLocaleString('en-US')}</span>
                <span>•</span>
                <span>Gasto este mês: ${config.currentSpendUSD.toFixed(2)}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400">Disponível: ${availableUSD.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setTempLimit(config.monthlyLimitUSD);
                setTempHardLock(config.hardLockEnabled);
                setTempNotify(config.notifyAdminAtLimit);
                setShowEditModal(true);
              }}
              className="px-3.5 py-2 rounded-lg bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 font-medium text-xs hover:opacity-90 transition flex items-center space-x-1.5 self-start"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Editar Orçamento</span>
            </button>
          </div>

          {/* Departmental Allocation List */}
          <div className="space-y-2">
            <h4 className="font-semibold text-xs text-slate-700 dark:text-slate-300 pt-2">
              Alocação por Departamento e Squad
            </h4>

            <div className="space-y-2">
              {departments.map(dept => {
                const isExpanded = expandedDept === dept.id;
                const deptPercent = Math.min(100, Math.round((dept.spendUSD / dept.allocatedUSD) * 100));

                return (
                  <div
                    key={dept.id}
                    className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden transition"
                  >
                    {/* Header Row */}
                    <div 
                      onClick={() => setExpandedDept(isExpanded ? null : dept.id)}
                      className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 transition"
                    >
                      <div className="flex items-center space-x-2.5">
                        <button className="text-slate-400">
                          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <div>
                          <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{dept.name}</span>
                          <span className="text-[10px] text-slate-400 block">{dept.usersCount} colaboradores</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                            ${dept.spendUSD.toFixed(1)} / ${dept.allocatedUSD.toFixed(0)}
                          </span>
                          <div className="w-24 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-1 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${deptPercent > 85 ? 'bg-amber-500' : 'bg-slate-900 dark:bg-slate-200'}`}
                              style={{ width: `${deptPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Users Drill-down */}
                    {isExpanded && (
                      <div className="px-4 py-3 bg-slate-50/60 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                          Consumo Individual — {dept.name}
                        </div>

                        {usersInExpandedDept.map(u => {
                          const uPercent = Math.min(100, Math.round((u.spendUSD / u.limitUSD) * 100));
                          return (
                            <div 
                              key={u.id}
                              className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between"
                            >
                              <div className="flex items-center space-x-2.5">
                                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-bold flex items-center justify-center text-slate-600 dark:text-slate-300">
                                  {u.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-medium text-xs text-slate-800 dark:text-slate-200 block">{u.name}</span>
                                  <span className="text-[10px] text-slate-400">{u.email}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-3">
                                <div className="text-right">
                                  <span className="font-mono text-xs text-slate-700 dark:text-slate-300">
                                    ${u.spendUSD.toFixed(1)} / ${u.limitUSD.toFixed(0)}
                                  </span>
                                  <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 mt-0.5 overflow-hidden">
                                    <div 
                                      className={`h-full rounded-full ${uPercent >= 100 ? 'bg-rose-500' : uPercent > 70 ? 'bg-amber-500' : 'bg-slate-800 dark:bg-slate-200'}`}
                                      style={{ width: `${uPercent}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Modal: Editar Orçamento da Empresa */}
      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-5 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">Editar orçamento de IA</h4>
                <p className="text-[11px] text-slate-400">Defina um limite mensal de gastos para todo o workspace.</p>
              </div>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Slider e Input de Limite Mensal */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block">
                Orçamento mensal (USD) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-mono">$</span>
                <input
                  type="number"
                  value={tempLimit}
                  onChange={e => setTempLimit(parseFloat(e.target.value) || 0)}
                  className="w-full pl-7 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-slate-400"
                />
              </div>
              {/* Range Slider */}
              <input
                type="range"
                min={2000}
                max={50000}
                step={500}
                value={tempLimit}
                onChange={e => setTempLimit(parseFloat(e.target.value))}
                className="w-full accent-slate-900 dark:accent-slate-100 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>$2,000</span>
                <span>$25,000</span>
                <span>$50,000</span>
              </div>
            </div>

            {/* Toggle 1: Notificar Admin */}
            <div className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex items-center justify-between">
              <div>
                <span className="font-medium text-xs text-slate-800 dark:text-slate-200 block">Notificar admin no limite</span>
                <span className="text-[10px] text-slate-400">Envia alerta quando o gasto atingir 90% do orçamento.</span>
              </div>
              <input
                type="checkbox"
                checked={tempNotify}
                onChange={e => setTempNotify(e.target.checked)}
                className="w-4 h-4 accent-slate-900 dark:accent-slate-100 rounded"
              />
            </div>

            {/* Toggle 2: Hard Lock (Budget Control) */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between space-x-3">
              <div>
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Habilitar Budget Control (Hard Lock)</span>
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block mt-0.5">
                  Quando habilitado, usuários e departamentos que excederem seus limites de orçamento serão bloqueados imediatamente de usar IA.
                </span>
              </div>
              <input
                type="checkbox"
                checked={tempHardLock}
                onChange={e => setTempHardLock(e.target.checked)}
                className="w-4 h-4 mt-1 accent-emerald-600 rounded"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveBudget}
                className="px-4 py-1.5 rounded-lg bg-slate-950 text-white dark:bg-slate-100 dark:text-slate-950 font-medium text-xs hover:opacity-90 transition"
              >
                Salvar Orçamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
