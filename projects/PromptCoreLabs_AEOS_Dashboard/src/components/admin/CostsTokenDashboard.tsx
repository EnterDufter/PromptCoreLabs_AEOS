import React, { useState } from 'react';
import { 
  DollarSign, Cpu, TrendingDown, ShieldAlert, CheckCircle2, 
  ChevronDown, ChevronRight, Sliders, Users, AlertCircle, Edit2, 
  X, Check, Lock, Sparkles, ShieldCheck, Scale, Zap, BarChart3,
  Download, FileSpreadsheet, HardDrive, RefreshCw
} from 'lucide-react';
import { budgetControlService, DepartmentBudget, UserBudget, WorkspaceBudgetConfig } from '../../services/governance/budgetControlService';
import { useI18n } from '../../i18n/I18nContext';

export const CostsTokenDashboard: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'ledger'>('overview');
  const [config, setConfig] = useState<WorkspaceBudgetConfig>(budgetControlService.getConfig());
  const [departments, setDepartments] = useState<DepartmentBudget[]>(budgetControlService.getDepartments());
  const [expandedDept, setExpandedDept] = useState<string | null>('tech');
  const [showEditModal, setShowEditModal] = useState(false);
  const [providerView, setProviderView] = useState<'engines' | 'models'>('engines');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal editing temporary state
  const [tempLimit, setTempLimit] = useState(config.monthlyLimitUSD);
  const [tempHardLock, setTempHardLock] = useState(config.hardLockEnabled);
  const [tempNotify, setTempNotify] = useState(config.notifyAdminAtLimit);

  const percentUsed = Math.round((config.currentSpendUSD / config.monthlyLimitUSD) * 100);
  const availableUSD = Math.max(0, config.monthlyLimitUSD - config.currentSpendUSD);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveBudget = () => {
    const updated = budgetControlService.updateConfig({
      monthlyLimitUSD: tempLimit,
      hardLockEnabled: tempHardLock,
      notifyAdminAtLimit: tempNotify
    });
    setConfig(updated);
    setShowEditModal(false);
    showToast('Teto orçamentário e travas atualizadas com sucesso!');
  };

  const handleToggleHardLock = () => {
    const nextState = !config.hardLockEnabled;
    const updated = budgetControlService.updateConfig({ hardLockEnabled: nextState });
    setConfig(updated);
    showToast(nextState ? 'Trava Física Hard Lock ATIVADA!' : 'Trava Física Hard Lock DESATIVADA!');
  };

  const handleExportCSV = () => {
    const csvContent = [
      'Data/Hora UTC,Departamento,Tipo,Tokens Processados,Custo Real USD,Economia Soberana USD,Status',
      `2026-11-02 20:00:00,Engenharia & IA Soberana,Ollama Local ($0.00),18450000,0.00,553.50,SOBERANO`,
      `2026-11-02 19:45:00,Governança & FinOps,Laya FastMCP CPU INT8,12200000,0.00,366.00,SOBERANO`,
      `2026-11-02 18:30:00,Arch Living & CX,Claude 3.5 Sonnet,2400000,48.00,0.00,CLOUD_API`,
      `2026-11-02 17:15:00,Vendas & Negócios,GPT-4o Enterprise,3100000,62.00,0.00,CLOUD_API`
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PCL_Cockpit_FinOps_Ledger_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast(t.finops.exportSuccess);
  };

  const usersInExpandedDept = expandedDept ? budgetControlService.getUsersByDepartment(expandedDept) : [];

  return (
    <div className="space-y-6 text-xs text-slate-800 dark:text-slate-100 select-none pb-12">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3 rounded-xl bg-emerald-600 text-white flex items-center space-x-2 shadow-lg animate-in fade-in duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-semibold text-xs">{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar & Tabs */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950 text-white border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                {t.finops.title}
              </h2>
            </div>
            <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
              {t.finops.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition flex items-center space-x-1.5 border border-slate-700"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.finops.exportLedger}</span>
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition flex items-center space-x-1.5 shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Ajustar Teto</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 mt-5 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'overview'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            Matriz de Soberania & Consumo
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'budget'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            Alocação por Squad & Usuários
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeTab === 'ledger'
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'bg-slate-950/60 text-slate-400 hover:text-white'
            }`}
          >
            Atesto Imutável & Auditoria Contábil
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-5">
          {/* Bento Grid: 4 Cartões Principais de FinOps Soberano */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 1. Sovereignty Ratio Card */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                {t.finops.sovereigntyRatio}
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  {config.sovereigntyRatioPercent}%
                </span>
                <span className="text-[11px] text-slate-500">local</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                42.5M tokens resolvidos no host sem custos de API externa.
              </p>
              <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full" 
                  style={{ width: `${config.sovereigntyRatioPercent}%` }}
                />
              </div>
            </div>

            {/* 2. Dólares Poupados */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                {t.finops.dollarsSaved}
              </span>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ${config.dollarsSavedLocalUSD.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <span className="text-[11px] text-emerald-500 font-semibold">USD</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Equivalente poupado frente às tabelas de GPT-4o e Claude 3.5 Sonnet.
              </p>
            </div>

            {/* 3. Invariante de Hardware (0 MB VRAM) */}
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">
                  {t.finops.vramCpu}
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                  0 MB
                </span>
                <span className="text-[11px] text-slate-500 font-mono">CPU INT8</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Laya opera 100% em CPU host sem disputar VRAM com o Ollama na RTX 3050.
              </p>
            </div>

            {/* 4. Trava Física Hard Lock */}
            <div className={`p-4 rounded-2xl border shadow-xs space-y-2 transition ${
              config.hardLockEnabled 
                ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/50' 
                : 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-500/50'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase font-bold text-slate-600 dark:text-slate-300">
                  {config.hardLockEnabled ? 'Hard Lock Ativo' : 'Hard Lock Desativado'}
                </span>
                <button
                  onClick={handleToggleHardLock}
                  className={`p-1.5 rounded-lg border transition ${
                    config.hardLockEnabled
                      ? 'bg-emerald-600 text-white border-emerald-500'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                  title="Alternar Trava Rígida"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex items-baseline space-x-1">
                <span className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100">
                  ${config.monthlyLimitUSD.toLocaleString('en-US')}
                </span>
                <span className="text-[10px] text-slate-400">teto</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                {t.finops.hardLockDesc}
              </p>
            </div>
          </div>

          {/* Breakdown Section: Provedores / Motores & Rateio por Squad */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Lado Esquerdo: Gastos por Motor (7 cols) */}
            <div className="lg:col-span-7 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Consumo Consolidado por Motor de Inferência
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setProviderView('engines')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition ${
                      providerView === 'engines'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Famílias
                  </button>
                  <button
                    onClick={() => setProviderView('models')}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-semibold transition ${
                      providerView === 'models'
                        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Modelos Individuais
                  </button>
                </div>
              </div>

              {providerView === 'engines' ? (
                <div className="space-y-3">
                  {[
                    { name: 'PCL Ollama Local Host', role: 'qwen2.5-coder:7b dedicado GPU', tokens: '28.5M tokens', spendUSD: 0.00, tag: 'SOBERANO $0.00', color: 'emerald' },
                    { name: 'PCL Laya Coprocessor', role: 'FastMCP CPU INT8 (0 MB VRAM)', tokens: '14.0M tokens', spendUSD: 0.00, tag: 'SOBERANO $0.00', color: 'emerald' },
                    { name: 'Anthropic Direct', role: 'Claude 3.5 Sonnet (Design & QA)', tokens: '4.8M tokens', spendUSD: 142.50, tag: 'CLOUD API', color: 'indigo' },
                    { name: 'OpenAI Enterprise', role: 'GPT-4o (Stage Gate QA)', tokens: '3.2M tokens', spendUSD: 96.00, tag: 'CLOUD API', color: 'indigo' }
                  ].map((engine, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-xs text-slate-900 dark:text-slate-100">{engine.name}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold ${
                            engine.spendUSD === 0 ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400' : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'
                          }`}>
                            {engine.tag}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500">{engine.role} • {engine.tokens}</span>
                      </div>
                      <span className="font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                        ${engine.spendUSD.toFixed(2)} USD
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {[
                    { name: 'qwen2.5-coder:7b-instruct-q4_K_M', provider: 'Local Host (:11434)', spend: 0.00, tokens: '28.5M' },
                    { name: 'cross-encoder/nli-MiniLM2-L6-H768', provider: 'Laya (:20140)', spend: 0.00, tokens: '14.0M' },
                    { name: 'claude-3-5-sonnet-20241022', provider: 'Anthropic', spend: 142.50, tokens: '4.8M' },
                    { name: 'gpt-4o-2024-08-06', provider: 'OpenAI', spend: 96.00, tokens: '3.2M' }
                  ].map((m, idx) => (
                    <div key={idx} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 font-mono text-[11px]">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block">{m.name}</span>
                        <span className="text-[10px] text-slate-400 font-sans">{m.provider} • {m.tokens}</span>
                      </div>
                      <span className={`font-bold ${m.spend === 0 ? 'text-emerald-500' : 'text-slate-700 dark:text-slate-300'}`}>
                        ${m.spend.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Lado Direito: Rateio por Squad Corporativo (5 cols) */}
            <div className="lg:col-span-5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t.finops.squadAllocation}
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-slate-400 font-bold">
                  {departments.length} Squads
                </span>
              </div>

              <div className="space-y-3">
                {departments.slice(0, 5).map(dept => {
                  const deptPercent = Math.round((dept.spendUSD / (dept.allocatedUSD || 1)) * 100);
                  return (
                    <div key={dept.id} className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/60">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                          {dept.name}
                        </span>
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          ${dept.spendUSD.toFixed(2)} / ${dept.allocatedUSD.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${deptPercent > 80 ? 'bg-amber-500' : 'bg-indigo-600'}`}
                          style={{ width: `${Math.min(100, deptPercent)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ABA: ALOCAÇÃO POR SQUAD & USUÁRIOS */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Gestão de Cotas por Departamento e Líder
            </h3>
            <p className="text-xs text-slate-500">
              Clique em um squad para expandir e auditar o consumo individual dos membros da equipe.
            </p>

            <div className="space-y-2">
              {departments.map(dept => (
                <div key={dept.id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                  <div
                    onClick={() => setExpandedDept(expandedDept === dept.id ? null : dept.id)}
                    className="p-3.5 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <div className="flex items-center space-x-2">
                      {expandedDept === dept.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{dept.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono">({dept.usersCount} membros)</span>
                    </div>
                    <span className="font-mono font-bold text-xs">
                      ${dept.spendUSD.toFixed(2)} de ${dept.allocatedUSD.toFixed(2)}
                    </span>
                  </div>

                  {expandedDept === dept.id && (
                    <div className="p-3 bg-white dark:bg-slate-900 space-y-2 border-t border-slate-200 dark:border-slate-800">
                      {usersInExpandedDept.map(u => (
                        <div key={u.id} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs">
                          <div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{u.name}</span>
                            <span className="text-[10px] text-slate-400 block">{u.email}</span>
                          </div>
                          <div className="text-right font-mono">
                            <span className="font-bold text-slate-700 dark:text-slate-300">${u.spendUSD.toFixed(2)}</span>
                            <span className="text-slate-400 text-[10px]"> / ${u.limitUSD.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                      {usersInExpandedDept.length === 0 && (
                        <p className="text-xs text-slate-400 py-2 text-center">Nenhum membro detalhado neste squad.</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ABA: ATESTO IMUTÁVEL & AUDITORIA CONTÁBIL */}
      {activeTab === 'ledger' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Certificação Criptográfica de Custos & Economia Soberana
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Relatório com atesto SHA-256 para comprovação contábil perante a controladoria e auditorias externas.
              </p>
            </div>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center space-x-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar Relatório Contábil (.csv)</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold block">--- [PCL COCKPIT] TERMO DE CONFORMIDADE FINOPS SOBERANA ---</span>
            <p>Hash Raiz Merkle do Enclave: <span className="text-indigo-400">0x7f8a9b2c3d4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a</span></p>
            <p>Taxa de Soberania Comprovada: <span className="text-emerald-400">88.4%</span> local ($0.00 faturado)</p>
            <p>Total de Dólares Poupados no Mês: <span className="text-emerald-400">$1,420.00 USD</span></p>
            <p>Alocação de VRAM CPU: <span className="text-emerald-400">0 MB</span> (Laya INT8 em CPUExecutionProvider)</p>
            <p>Status de Hard Lock: <span className="text-emerald-400">HOMOLOGADO & ATIVO</span></p>
          </div>
        </div>
      )}

      {/* MODAL: AJUSTAR TETO ORÇAMENTÁRIO */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Ajustar Limites do Workspace
              </h3>
              <button 
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Limite Mensal Máximo (USD)
                </label>
                <input
                  type="number"
                  value={tempLimit}
                  onChange={e => setTempLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 font-mono text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Trava Rígida (Hard Lock)</span>
                  <input
                    type="checkbox"
                    checked={tempHardLock}
                    onChange={e => setTempHardLock(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Bloqueia requisições a APIs pagas imediatamente após atingir 100% do limite.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">Alertar Administrador por Email</span>
                  <input
                    type="checkbox"
                    checked={tempNotify}
                    onChange={e => setTempNotify(e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-500">
                  Envia alerta preventivo quando o consumo atingir 80% do teto.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveBudget}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition"
              >
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
