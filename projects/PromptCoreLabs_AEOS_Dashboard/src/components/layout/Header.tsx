import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Cpu, Globe, Moon, Sun, User, Lock, LogOut, Key, Server, Users, Settings, HelpCircle, BookOpen, Activity, Sparkles, TrendingUp } from 'lucide-react';
import { Language, Theme, UserProfile } from '../../types';
import { useI18n } from '../../i18n/I18nContext';

interface HeaderProps {
  user: UserProfile;
  lang: Language;
  onLanguageChange: (l: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  onOpenSettings: (tab?: string) => void;
  onToggleStatusPanel?: () => void;
  isStatusPanelOpen?: boolean;
  onOpenHelpCenter?: () => void;
  rightPanelMode?: 'telemetry' | 'governance';
  onRightPanelModeChange?: (mode: 'telemetry' | 'governance') => void;
  onLogout?: () => void;
  trialPillText?: string;
  onOpenGrowthStore?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  lang,
  onLanguageChange,
  theme,
  onThemeToggle,
  onOpenSettings,
  onToggleStatusPanel,
  isStatusPanelOpen = false,
  onOpenHelpCenter,
  rightPanelMode = 'telemetry',
  onRightPanelModeChange,
  onLogout,
  trialPillText,
  onOpenGrowthStore
}) => {
  const { t } = useI18n();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [localTrialMode, setLocalTrialMode] = useState<'trial' | 'bundle'>('trial');
  const [tokenTaxUsd, setTokenTaxUsd] = useState<number>(148.75);
  const [tokenTaxTokens, setTokenTaxTokens] = useState<number>(9916600);

  useEffect(() => {
    fetch('/api/aeos/finops/token-tax?tenantId=tnt_promptcore_default')
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data && data.ok && data.metrics && typeof data.metrics.monetarySavingsUsd === 'number' && data.metrics.monetarySavingsUsd > 0) {
          setTokenTaxUsd(data.metrics.monetarySavingsUsd);
          setTokenTaxTokens(data.metrics.estimatedTokensSaved || 9916600);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="h-14 glass-panel border-b border-slate-200/60 dark:border-slate-800/80 px-4 flex items-center justify-between text-slate-800 dark:text-slate-100 select-none relative z-50 transition-colors">
      {/* Brand / Logo */}
      <div className="flex items-center space-x-3">
        <div className="relative flex items-center justify-center">
          <img 
            src="/assets/PCL_Logo_Transparente.png" 
            alt="PromptCore Labs Logo" 
            className="h-8 w-auto object-contain drop-shadow-sm filter dark:brightness-110"
            onError={(e) => {
              // Fallback gracioso se a imagem ainda não carregou
              e.currentTarget.style.display = 'none';
              const nextEl = e.currentTarget.nextElementSibling as HTMLElement;
              if (nextEl) nextEl.style.display = 'flex';
            }}
          />
          <div className="hidden w-8 h-8 rounded-lg bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-950 items-center justify-center font-black text-sm tracking-widest shadow-sm">
            PCL
          </div>
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm tracking-tight">PCL Cockpit</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-700 font-semibold">
              v3.9.0 PROD
            </span>
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5 font-sans">
            Cognitive Engineering Platform
          </span>
        </div>
      </div>

      {/* Center Space: Limpo e Desimpedido (Hierarquia Nobre) */}
      <div className="hidden md:flex flex-1" />

      {/* Right User & Controls */}
      <div className="flex items-center space-x-2">
        {/* Pílula do Trial 14 dias ("14d Trial • Todos os Módulos" -> "Núcleo Laya + X Módulos") */}
        <button
          type="button"
          data-testid="growthos-trial-pill"
          onClick={() => {
            setLocalTrialMode(prev => (prev === 'trial' ? 'bundle' : 'trial'));
            if (onOpenGrowthStore) onOpenGrowthStore();
          }}
          className="hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-50/90 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 hover:border-indigo-400 transition shadow-2xs cursor-pointer"
          title="PCL GrowthOS™ — Alternar/Inspecionar Trial 14d e Pacote Modular Pós-Dia 14 no Dual-Plex"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>
            {trialPillText ||
              (localTrialMode === 'trial'
                ? '14d Trial • Todos os Módulos'
                : 'Núcleo Laya + 4 Módulos')}
          </span>
        </button>

        {/* Resumo Clicável Token Tax Saved (PROAA-17 / PROAA-22) */}
        <button
          type="button"
          data-testid="header-token-tax-pill"
          onClick={() => onOpenSettings('costs')}
          className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-semibold bg-emerald-50/90 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:border-emerald-400 transition shadow-2xs cursor-pointer"
          title="Token Tax Saved (PROAA-17): Economia acumulada por decisões locais do Laya System One em CPU (0 MB VRAM)"
        >
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span>Token Tax Saved: ${tokenTaxUsd.toFixed(2)}</span>
          <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400/80">
            ({(tokenTaxTokens / 1000000).toFixed(1)}M tok)
          </span>
        </button>

        {/* Botão de Atalho no Header: Velocímetro Turbo + Raio ⚡ (Telemetria & Status) */}
        {onToggleStatusPanel && (
          <div className="relative group">
            <button
              onClick={onToggleStatusPanel}
              className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer ${
                isStatusPanelOpen
                  ? 'bg-emerald-500 text-slate-950 border-emerald-500 shadow-md shadow-emerald-500/25'
                  : 'bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30'
              }`}
              title="Telemetria & Status em Tempo Real"
              aria-label="Telemetria & Status em Tempo Real"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Arco do medidor / tacômetro */}
                <path d="M 3.5 13.5 A 7 7 0 1 1 15 13.5" strokeWidth="1.75" />
                {/* Escala interna discreta */}
                <path d="M 5.5 12 A 5 5 0 1 1 13 12" strokeWidth="1" opacity={isStatusPanelOpen ? "0.6" : "0.35"} strokeDasharray="1 1.5" />
                {/* Ponteiro calibrado a 45° na faixa de atividade */}
                <path d="M 9.5 10.5 L 13.5 6.5" strokeWidth="1.6" />
                <circle cx="9.5" cy="10.5" r="1.5" fill="currentColor" stroke="none" />
                {/* Raio elétrico de pulso instantâneo */}
                <path d="M 14.5 11.5 L 12 15 L 14.5 15 L 13 19 L 18 13.5 L 15.5 13.5 Z" fill="currentColor" stroke="none" />
              </svg>

              {/* Micro-dot indicador de saúde (visível quando a aba estiver fechada) */}
              {!isStatusPanelOpen && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              )}
            </button>

            {/* Tooltip flutuante discreto */}
            <div className="absolute -bottom-8 right-0 px-2 py-0.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-[10px] font-medium rounded shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              {t.header.telemetry || 'Telemetria & Status'}
            </div>
          </div>
        )}

        {/* Botão de Atalho no Header: Central de Ajuda (Help Center) */}
        {onOpenHelpCenter && (
          <div className="relative group">
            <button
              onClick={onOpenHelpCenter}
              className="w-9 h-9 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer bg-white dark:bg-slate-900 border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-500/50 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 shadow-sm"
              title="Central de Ajuda & Guia Operacional"
              aria-label="Central de Ajuda"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
            <div className="absolute -bottom-8 right-0 px-2 py-0.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 text-[10px] font-medium rounded shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
              Central de Ajuda
            </div>
          </div>
        )}

        {/* Clickable User Avatar & Dropdown */}
        <div className="relative z-50">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center space-x-2 focus:outline-none group p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center border-2 border-emerald-500 shadow-sm">
              {user.avatar || user.name.slice(0, 2).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-medium text-xs text-slate-700 dark:text-slate-200 group-hover:text-slate-900">
              {user.name.split(' ')[0]}
            </span>
          </button>

          {/* User Popover Menu */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-2 z-[60] text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{user.name}</p>
                <p className="text-slate-500 text-[11px] truncate">{user.email}</p>
                <div className="mt-1.5 flex items-center space-x-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium">
                    {user.role}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Squad: {user.squad}</span>
                </div>
              </div>

              {/* Alternador Canônico da Coluna Lateral: Telemetria vs. Governança */}
              {onRightPanelModeChange && (
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Coluna Lateral
                    </span>
                    <span className="text-[9px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {rightPanelMode === 'telemetry' ? 'Telemetria' : 'Governança'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => {
                        onRightPanelModeChange('telemetry');
                        if (!isStatusPanelOpen && onToggleStatusPanel) onToggleStatusPanel();
                      }}
                      className={`py-1 px-1.5 rounded-md text-[11px] font-semibold flex items-center justify-center space-x-1 transition cursor-pointer ${
                        rightPanelMode === 'telemetry'
                          ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs border border-slate-200/60 dark:border-slate-700'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Activity className="w-3 h-3 text-emerald-500" />
                      <span>Telemetria</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onRightPanelModeChange('governance');
                        if (!isStatusPanelOpen && onToggleStatusPanel) onToggleStatusPanel();
                      }}
                      className={`py-1 px-1.5 rounded-md text-[11px] font-semibold flex items-center justify-center space-x-1 transition cursor-pointer ${
                        rightPanelMode === 'governance'
                          ? 'bg-white dark:bg-slate-900 text-sky-600 dark:text-sky-400 shadow-xs border border-slate-200/60 dark:border-slate-700'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      <Shield className="w-3 h-3 text-sky-500" />
                      <span>Governança</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Idioma integrado no Dropdown do Usuário (Redireciona para o Painel Geral de Configurações) */}
              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  onOpenSettings('general');
                }}
                className="w-full px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 transition text-left"
              >
                <span className="text-slate-600 dark:text-slate-300 text-[11px] flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{t.settings.general}</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {lang.toUpperCase()}
                </span>
              </button>

              {/* Tema Light/Dark integrado no Dropdown do Usuário */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                  <span>Aparência</span>
                </span>
                <button
                  onClick={onThemeToggle}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center space-x-1"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3 h-3 text-amber-400" />
                      <span>Modo Claro</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3 h-3 text-indigo-500" />
                      <span>Modo Escuro</span>
                    </>
                  )}
                </button>
              </div>

              <div className="py-1">
                {onOpenHelpCenter && (
                  <button
                    onClick={() => { setShowUserDropdown(false); onOpenHelpCenter(); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                    <span className="font-medium">Central de Ajuda (Help Center)</span>
                  </button>
                )}

                <button
                  onClick={() => { setShowUserDropdown(false); onOpenSettings(); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-500" />
                  <span>Configurações do Sistema</span>
                </button>

                <button
                  onClick={() => { setShowUserDropdown(false); onOpenSettings('security'); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300"
                >
                  <Lock className="w-3.5 h-3.5 text-blue-500" />
                  <span>Segurança & Sessões (2 Dispositivos)</span>
                </button>

                <button
                  onClick={() => { setShowUserDropdown(false); onOpenSettings('squads'); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300"
                >
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Árvore de Squads & Agentes</span>
                </button>

                <button
                  onClick={() => { setShowUserDropdown(false); onOpenSettings('audit'); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center space-x-2 text-slate-700 dark:text-slate-300"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Audit Trail ISO 27001/42001 & Board</span>
                </button>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1 mt-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    if (onLogout) onLogout();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center space-x-2 font-medium cursor-pointer transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Encerrar Sessão Segura</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
