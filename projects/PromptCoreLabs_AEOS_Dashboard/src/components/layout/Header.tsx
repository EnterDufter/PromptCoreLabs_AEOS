import React, { useState } from 'react';
import { Shield, ShieldAlert, Cpu, Globe, Moon, Sun, User, Lock, LogOut, Key, Server, Users, Settings } from 'lucide-react';
import { Language, Theme, UserProfile } from '../../types';

interface HeaderProps {
  user: UserProfile;
  lang: Language;
  onLanguageChange: (l: Language) => void;
  theme: Theme;
  onThemeToggle: () => void;
  onOpenSettings: (tab?: string) => void;
  onToggleStatusPanel?: () => void;
  isStatusPanelOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  lang,
  onLanguageChange,
  theme,
  onThemeToggle,
  onOpenSettings,
  onToggleStatusPanel,
  isStatusPanelOpen = false
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  return (
    <header className="h-14 glass-panel border-b border-slate-200/60 dark:border-slate-800/80 px-4 flex items-center justify-between text-slate-800 dark:text-slate-100 select-none z-30 transition-colors">
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
            <span className="font-semibold text-sm tracking-tight">PCL AEOS</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              v3.0.4 PROD
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
        {/* Botão de Atalho no Header: Telemetria & Status em Tempo Real */}
        {onToggleStatusPanel && (
          <button
            onClick={onToggleStatusPanel}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition flex items-center space-x-1.5 ${
              isStatusPanelOpen
                ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-400 text-emerald-700 dark:text-emerald-300 shadow-xs'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-400 dark:hover:border-slate-700'
            }`}
            title="Alternar Painel Lateral de Status & Telemetria"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">Telemetria & Status</span>
          </button>
        )}

        {/* Clickable User Avatar & Dropdown */}
        <div className="relative">
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
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl py-2 z-50 text-xs">
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

              {/* Idioma integrado no Dropdown do Usuário */}
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Idioma</span>
                </span>
                <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded border border-slate-200 dark:border-slate-700">
                  {(['pt', 'en', 'es'] as Language[]).map(l => (
                    <button
                      key={l}
                      onClick={() => onLanguageChange(l)}
                      className={`px-1.5 py-0.5 rounded transition uppercase text-[10px] ${
                        lang === l
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-bold'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

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
                  onClick={() => setShowUserDropdown(false)}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center space-x-2 font-medium"
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
