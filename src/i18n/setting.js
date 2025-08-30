import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import TranslationEn from '@/i18n/resource/en.json';
import TranslationKo from '@/i18n/resource/ko.json';

const resources = {
  en: {
    translation: TranslationEn,
  },
  ko: {
    translation: TranslationKo,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('selectedLanguage') || 'ko',
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
