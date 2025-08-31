import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';

const LogoutSection = ({ onLogout }) => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const { logout, isLoggedIn } = useAuthStore();

  const handleLogout = async () => {
    if (!confirm(t('community.myPage.logoutConfirm'))) {
      return;
    }

    try {
      logout();

      // 세션 스토리지 정리
      sessionStorage.removeItem('step1Data');
      sessionStorage.removeItem('step2Data');

      console.log('로그아웃 완료');

      if (onLogout) {
        onLogout();
      } else {
        nav('/login');
      }
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);

      // 오류가 발생해도 강제로 로그아웃 처리
      logout();

      if (onLogout) {
        onLogout();
      } else {
        nav('/login');
      }
    }
  };

  // 로그인하지 않은 상태면 버튼을 보여주지 않음
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="px-6 pb-8">
      <button
        onClick={handleLogout}
        className="w-full py-4 border border-gray-300 rounded-2xl text-gray-600 text-base font-semibold hover:bg-gray-50"
      >
        {t('community.myPage.logout')}
      </button>
    </div>
  );
};

export default LogoutSection;
