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

// Enable more verbose debugging
const isDevMode = process.env.NODE_ENV === 'development';

// Import translations directly
import enAdmin from '../../public/locales/en/admin.json';
import amAdmin from '../../public/locales/am/admin.json';
import omAdmin from '../../public/locales/om/admin.json';

// Initialize with resources already loaded
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'am', 'om'],
    debug: isDevMode,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      // Pre-load all translations
      en: {
        admin: enAdmin
      },
      am: {
        admin: amAdmin
      },
      om: {
        admin: omAdmin
      }
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
    defaultNS: 'admin',
    ns: ['admin'],
  }).then(() => {
    if (isDevMode) {
      console.log('i18next initialized with language:', i18n.language);
      console.log('Available languages:', i18n.languages);
      console.log('Available namespaces:', i18n.options.ns);
      console.log('Loaded resources:', i18n.services.resourceStore.data);
    }
  }).catch(error => {
    console.error('Error initializing i18next:', error);
  });

export function I18nProvider({ children }: I18nProviderProps): JSX.Element {
  useEffect(() => {
    // Save the language preference to a cookie for SSR
    const handleLanguageChange = () => {
      if (isDevMode) {
        console.log('Language changed to:', i18n.language);
      }
      Cookies.set('NEXT_LOCALE', i18n.language);
    };

    // Log initial state
    if (isDevMode) {
      console.log('Initial language:', i18n.language);
      console.log('Initial resources:', i18n.services.resourceStore.data);
      
      // Check availability of translations for all languages
      console.log('English admin available:', i18n.hasResourceBundle('en', 'admin'));
      console.log('Amharic admin available:', i18n.hasResourceBundle('am', 'admin'));
      console.log('Oromo admin available:', i18n.hasResourceBundle('om', 'admin'));
    }

    i18n.on('languageChanged', handleLanguageChange);

    // Force a reload of the admin namespace for the current language
    i18n.loadNamespaces('admin').then(() => {
      if (isDevMode) {
        console.log('Admin namespace loaded');
        // Verify all translations are available
        console.log('Current language resources:', 
          i18n.getResourceBundle(i18n.language, 'admin')
        );
      }
    });

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
} 