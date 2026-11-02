import React from 'react';
import { Globe, Moon, Sun, Check, Sparkles, Bell, Volume2, ShieldCheck } from 'lucide-react';
import { Language, Theme } from '../../types';
import { useI18n } from '../../i18n/I18nContext';

interface GeneralPreferencesSettingsProps {
  currentLang: Language;
  onSelectLang: (lang: Language) => void;
  currentTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
}

export const GeneralPreferencesSettings: React.FC<GeneralPreferencesSettingsProps> = ({
  currentLang,
  onSelectLang,
  currentTheme,
  onSelectTheme
}) => {
  const { t } = useI18n();

  const languages: { id: Language; label: string; nativeName: string; flag: string; desc: string; region: string }[] = [
    {
      id: 'pt',
      label: 'Português (Brasil)',
      nativeName: 'Português',
      flag: '🇧🇷',
      desc: 'Localização canônica completa, termos da legislação brasileira (LGPD) e moeda em BRL (R$).',
      region: 'pt-BR (UTC-3)'
    },
    {
      id: 'en',
      label: 'English (United States)',
      nativeName: 'English',
      flag: '🇺🇸',
      desc: 'International executive standard, global terminology, ISO 42001 compliance and USD ($) currency.',
      region: 'en-US (UTC-5/UTC-8)'
    },
    {
      id: 'es',
      label: 'Español (Latinoamérica)',
      nativeName: 'Español',
      flag: '🇪🇸',
      desc: 'Localización completa para operaciones corporativas hispanohablantes y soporte multidivisa.',
      region: 'es-ES / es-LATAM'
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl select-none">
      {/* Seção 1: Idioma da Interface */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {t.settings.languageTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.settings.languageSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {languages.map(l => {
            const isSelected = currentLang === l.id;
            return (
              <div
                key={l.id}
                onClick={() => onSelectLang(l.id)}
                className={`cursor-pointer rounded-2xl p-4.5 border transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-md shadow-emerald-500/5 ring-1 ring-emerald-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-400 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{l.flag}</span>
                    {isSelected ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center space-x-1">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>{t.settings.active}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {l.region}
                      </span>
                    )}
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    {l.label}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                    {l.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Código: {l.id.toUpperCase()}</span>
                  <span>100% Traduzido</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção 2: Aparência e Estilo Visual */}
      <div className="space-y-4">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {t.settings.themeTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t.settings.themeSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Modo Claro */}
          <div
            onClick={() => onSelectTheme('light')}
            className={`cursor-pointer rounded-2xl p-4.5 border transition-all flex items-center space-x-4 ${
              currentTheme === 'light'
                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md ring-1 ring-indigo-500'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-400'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-xs">
              <Sun className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {t.settings.themeLight}
                </h4>
                {currentTheme === 'light' && (
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[3]" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Fundo puro #FFFFFF com sombras orgânicas e contraste WCAG AAA.
              </p>
            </div>
          </div>

          {/* Modo Escuro */}
          <div
            onClick={() => onSelectTheme('dark')}
            className={`cursor-pointer rounded-2xl p-4.5 border transition-all flex items-center space-x-4 ${
              currentTheme === 'dark'
                ? 'border-indigo-500 bg-indigo-50/40 dark:bg-indigo-950/20 shadow-md ring-1 ring-indigo-500'
                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-400'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-xs border border-slate-800">
              <Moon className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">
                  {t.settings.themeDark}
                </h4>
                {currentTheme === 'dark' && (
                  <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 stroke-[3]" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Fundo ardósia profunda (Slate-950) com destaques em esmeralda.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Seção 3: Blindagem & Conformidade de Armazenamento */}
      <div className="p-4.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start space-x-3.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs">
          <span className="font-bold text-slate-900 dark:text-slate-100 block">
            Segredo Corporativo Blindado (BYOS & Resíduo Zero)
          </span>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-1 leading-relaxed">
            Todas as preferências de usuário, idiomas e chaves de integração são persistidas localmente no navegador e no banco de dados corporativo seguro (PostgreSQL 17 Enclave), sem rastreamento por servidores analíticos de terceiros.
          </p>
        </div>
      </div>
    </div>
  );
};
