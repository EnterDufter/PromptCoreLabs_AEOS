import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';
import { translations, Translations } from './translations';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'pt',
  setLang: () => {},
  t: translations.pt
});

export const I18nProvider: React.FC<{
  initialLang?: Language;
  children: React.ReactNode;
}> = ({ initialLang = 'pt', children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('pcl_cockpit_lang') as Language;
    return saved && ['pt', 'en', 'es'].includes(saved) ? saved : initialLang;
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    try {
      localStorage.setItem('pcl_cockpit_lang', newLang);
    } catch {
      // Ignora falhas de localStorage se restrito
    }
  };

  const t = translations[lang] || translations.pt;

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => useContext(I18nContext);
