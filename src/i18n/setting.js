import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import TranslationEn from '@/i18n/resource/en.json';
import TranslationKo from '@/i18n/resource/ko.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: TranslationEn },
      ko: { translation: TranslationKo },
    },
    fallbackLng: 'ko',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'], // localStorage -> 브라우저 언어 순으로 감지
      caches: ['localStorage'], // 언어 선택을 localStorage에 저장
    },
  });

export default i18n;
