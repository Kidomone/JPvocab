import { createContext, useContext } from 'react';
import type { Language, Translations } from './types';

export interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: keyof Translations) => string;
}

export const I18nContext = createContext<I18nContextValue | null>(null);

export const useTranslation = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return ctx;
};
