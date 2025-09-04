import { languages } from '@/constants/language';

// 초기 언어 설정 함수
export const getInitialLanguage = () => {
  // localStorage에서 확인
  const stored = localStorage.getItem('i18nextLng');
  if (stored && languages.some((l) => l.code === stored)) {
    return stored;
  }

  // 브라우저 언어 감지
  const browserLang = navigator.language.substring(0, 2);
  const foundLanguage = languages.find((l) => l.code === browserLang);

  return foundLanguage ? foundLanguage.code : 'ko'; // 기본값으로 'ko' 코드 반환
};
