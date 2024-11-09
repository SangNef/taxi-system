// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from './locales/en.json';
import vi from './locales/vi.json';

const defaultLng = localStorage.getItem('language') || 'en';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: "en",
    lng: defaultLng,
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
