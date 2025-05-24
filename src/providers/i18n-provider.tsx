'use client';

import { ReactNode, useEffect } from 'react';
import i18n from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import Cookies from 'js-cookie';

export interface I18nProviderProps {
  children: ReactNode;
}

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'am', 'om'],
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator'],
      lookupCookie: 'NEXT_LOCALE',
      caches: ['cookie'],
    },
    react: {
      useSuspense: false,
    },
  });

export function I18nProvider({ children }: I18nProviderProps): JSX.Element {
  useEffect(() => {
    // Save the language preference to a cookie for SSR
    const handleLanguageChange = () => {
      Cookies.set('NEXT_LOCALE', i18n.language);
    };

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 