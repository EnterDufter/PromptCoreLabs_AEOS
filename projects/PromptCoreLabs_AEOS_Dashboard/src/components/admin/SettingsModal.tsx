import React, { useState } from 'react';
import { 
  X, Lock, Server, DollarSign, Users, Cpu, Shield, Sparkles, 
  Globe, Check, Save, RotateCcw, ShieldCheck 
} from 'lucide-react';
import { UserProfile, Language, Theme } from '../../types';
import { UserManagementSecurity } from './UserManagementSecurity';
import { IntegrationsLibrary } from './IntegrationsLibrary';
import { CostsTokenDashboard } from './CostsTokenDashboard';
import { AgentSquadOrgChart } from './AgentSquadOrgChart';
import { SkillsManager } from './SkillsManager';
import { AuditComplianceBoard } from './AuditComplianceBoard';
import { NoCodeAgentBuilder } from './NoCodeAgentBuilder';
import { GeneralPreferencesSettings } from './GeneralPreferencesSettings';
import { useI18n } from '../../i18n/I18nContext';

interface SettingsModalProps {
  user: UserProfile;
  defaultTab?: string;
  lang?: Language;
  onLanguageChange?: (lang: Language) => void;
  theme?: Theme;
  onThemeToggle?: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ 
  user, 
  defaultTab = 'general', 
  lang: initialLang = 'pt',
  onLanguageChange,
  theme: initialTheme = 'light',
  onThemeToggle,
  onClose 
}) => {
  const { lang: contextLang, setLang, t } = useI18n();
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  // Rascunho temporário de configurações para permitir Cancelar ou Salvar
  const [selectedLang, setSelectedLang] = useState<Language>(initialLang || contextLang);
  const [selectedTheme, setSelectedTheme] = useState<Theme>(initialTheme);
  const [isSaving, setIsSaving] = useState(false);
  const [showSavedToast, setShowSavedToast] = useState(false);

  const tabs = [
    { id: 'general', label: t.settings.general, icon: Globe },
    { id: 'security', label: t.settings.security, icon: Lock },
    { id: 'integrations', label: t.settings.integrations, icon: Server },
    { id: 'costs', label: t.settings.costs, icon: DollarSign },
    { id: 'squads', label: t.settings.squads, icon: Users },
    { id: 'skills', label: t.settings.skills, icon: Cpu },
    { id: 'audit', label: t.settings.audit, icon: Shield },
    { id: 'nocode', label: t.settings.nocode, icon: Sparkles }
  ];

  const handleSave = () => {
    setIsSaving(true);
    
    // Aplica idioma se alterado
    if (selectedLang) {
      setLang(selectedLang);
      if (onLanguageChange) onLanguageChange(selectedLang);
    }

    // Aplica tema se alterado
    if (selectedTheme !== initialTheme && onThemeToggle) {
      onThemeToggle();
    }

    setTimeout(() => {
      setIsSaving(false);
      setShowSavedToast(true);
      setTimeout(() => {
        setShowSavedToast(false);
        onClose();
      }, 700);
    }, 300);
  };

  const handleCancel = () => {
    // Reverte e fecha imediatamente
    setSelectedLang(initialLang || contextLang);
    setSelectedTheme(initialTheme);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 dark:bg-slate-950 flex flex-col w-screen h-screen overflow-hidden select-none animate-in fade-in duration-150">
      {/* Barra Superior de Cabeçalho Corporativo Fullscreen */}
      <header className="h-16 px-6 md:px-10 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-500/20">
            PCL
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                {t.settings.subtitle}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-[10px] text-slate-500 font-medium">
                ISO 27001 / ISO 42001
              </span>
            </div>
            <h1 className="font-bold text-sm md:text-base text-slate-900 dark:text-slate-100">
              {t.settings.title}
            </h1>
          </div>
        </div>

        {/* Botão X para Fechar e Regressar à Tela Principal */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCancel}
            className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition flex items-center space-x-1.5 group shadow-xs"
            title="Fechar e retornar à tela principal (Esc)"
          >
            <span>{t.settings.close}</span>
            <X className="w-4 h-4 text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition" />
          </button>
        </div>
      </header>

      {/* Barra de Navegação Horizontal por Módulos */}
      <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-6 md:px-10 flex-shrink-0 z-10 overflow-x-auto custom-scrollbar">
        <div className="flex space-x-1 text-xs font-medium min-w-max">
          {tabs.map(tTab => {
            const Icon = tTab.icon;
            const isActive = activeTab === tTab.id;
            return (
              <button
                key={tTab.id}
                onClick={() => setActiveTab(tTab.id)}
                className={`px-4 py-3.5 border-b-2 transition flex items-center space-x-2 ${
                  isActive
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400'}`} />
                <span>{tTab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Corpo Central da Configuração (Ocupa Toda a Janela com Scroll Interno Limpo) */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 max-w-7xl mx-auto w-full custom-scrollbar">
        {activeTab === 'general' && (
          <GeneralPreferencesSettings
            currentLang={selectedLang}
            onSelectLang={setSelectedLang}
            currentTheme={selectedTheme}
            onSelectTheme={setSelectedTheme}
          />
        )}
        {activeTab === 'security' && <UserManagementSecurity user={user} />}
        {activeTab === 'integrations' && <IntegrationsLibrary />}
        {activeTab === 'costs' && <CostsTokenDashboard />}
        {activeTab === 'squads' && <AgentSquadOrgChart />}
        {activeTab === 'skills' && <SkillsManager />}
        {activeTab === 'audit' && <AuditComplianceBoard />}
        {activeTab === 'nocode' && <NoCodeAgentBuilder />}
      </main>

      {/* Barra Inferior Fixa com Botões de Ação: Cancelar e Salvar */}
      <footer className="h-16 px-6 md:px-12 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center space-x-2 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="hidden sm:inline">
            {t.settings.enclaveActive}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Botão Cancelar */}
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs transition shadow-xs disabled:opacity-50"
          >
            {t.settings.cancel}
          </button>

          {/* Botão Salvar Alterações */}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-emerald-600/25 flex items-center space-x-2 transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Gravando...</span>
              </>
            ) : showSavedToast ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Salvo!</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>{t.settings.save}</span>
              </>
            )}
          </button>
        </div>
      </footer>
    </div>
  );
};
