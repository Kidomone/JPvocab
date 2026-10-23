import { useState, type ReactNode } from 'react';
import type { Language, Translations } from './types';
import { translations } from './translations';
import { I18nContext } from './context';

const STORAGE_KEY = 'jpvocab_lang';

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ru' || saved === 'en') return saved;
    } catch {
      // ignore
    }
    return 'ru';
  });

  const setLang = (nextLang: Language) => {
    setLangState(nextLang);
    try {
      localStorage.setItem(STORAGE_KEY, nextLang);
    } catch {
      // ignore
    }
  };

  const toggleLang = () => {
    setLang(lang === 'ru' ? 'en' : 'ru');
  };

  const t = (key: keyof Translations): string => {
    return translations[lang][key] ?? translations.ru[key] ?? String(key);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
};
