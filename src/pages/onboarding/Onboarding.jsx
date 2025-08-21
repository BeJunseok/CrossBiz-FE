import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import ChevronDown from '@/assets/svg/common/ChevronDown.svg?react';
import Globe from '@/assets/svg/onboarding/globe.svg?react';
import { getInitialLanguage } from '@/utils/initialLanguage';
import { languages } from '@/constants/language';

const OnboardingPage = () => {
  const [selectedLangCode, setSelectedLangCode] =
    useState(getInitialLanguage());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const nav = useNavigate();

  const selectedLanguageName = useMemo(() => {
    return languages.find((l) => l.code === selectedLangCode)?.name || 'Korean';
  }, [selectedLangCode]);

  const handleLanguageSelect = (language) => {
    setSelectedLangCode(language.code);
    localStorage.setItem('selectedLanguage', language.code);
    setIsDropdownOpen(false);
  };

  const handleRegister = () => {
    nav('/register');
  };

  const handleLogin = () => {
    nav('/login');
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-10">
      {/* 로고 영역 */}
      <Logo className="mb-3" />
      <h1 className="font-bold text-3xl mb-2">CrossBiz</h1>
      <div className="font-semibold text-sm text-center leading-tight mb-[73px] text-gray-500">
        <p>비자 · 세금부터 상권 트래킹까지.</p>
        <p>나만의 비즈니스 도우미</p>
      </div>

      {/* 언어 선택 드롭다운 */}
      <div className="relative mb-16">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <Globe className="w-5 h-5" />
          <span className="text-lg font-normal">{selectedLanguageName}</span>
          <ChevronDown
            className={`w-2.5 h-2.5 transition-transform ${
              isDropdownOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* 드롭다운 메뉴 */}
        {isDropdownOpen && (
          <div className="absolute top-full left-3/4 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
            {languages.map((language, index) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className={`w-32 h-12 px-7 py-3.5 text-center text-[#323232] text-base  hover:bg-gray-50 transition-colors ${
                  index !== languages.length - 1
                    ? 'border-b border-gray-200'
                    : ''
                }`}
              >
                {language.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-80 space-y-4">
        {/* 회원가입 버튼 */}
        <button
          onClick={handleRegister}
          className="w-full h-16 bg-black text-white text-xl font-semibold rounded-[40px] hover:bg-gray-800 transition-colors"
        >
          회원가입
        </button>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-full h-16 bg-white text-black text-xl font-semibold rounded-[40px] border border-black hover:bg-gray-50 transition-colors"
        >
          로그인
        </button>
      </div>

      {/* 드롭다운이 열려있을 때 배경 클릭으로 닫기 */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default OnboardingPage;
