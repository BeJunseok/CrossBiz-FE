import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/common/Logo';
import { login } from '@/api/auth/Auth';
import { useAuthStore } from '@/stores/authStore';

const LoginPage = () => {
  const nav = useNavigate();
  const { login: setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    loginId: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.loginId || !formData.password) {
      setError('아이디와 비밀번호를 모두 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await login(formData.loginId, formData.password);

      setAuth(response.accessToken, {
        userId: response.userId,
        loginId: response.loginId,
      });

      nav('/');
    } catch (error) {
      console.error('로그인 오류:', error);

      if (error.response?.status === 401) {
        setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      } else if (error.response?.status >= 500) {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterRedirect = () => {
    nav('/register');
  };

  const handleForgotPassword = () => {
    console.log('비밀번호 찾기 페이지로 이동');
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-10">
      {/* 로고 영역 */}
      <Logo className="mb-32" />

      {/* 로그인 폼 */}
      <form onSubmit={handleLogin} className="w-full max-w-80">
        <div className="space-y-5 mb-5">
          <div className="space-y-1.5">
            <input
              type="text"
              name="loginId"
              value={formData.loginId}
              onChange={handleInputChange}
              placeholder="아이디"
              required
              autoComplete="username"
              disabled={isLoading}
              className="w-full h-16 px-5 py-5 bg-[#f3f3f3] rounded-[40px] text-lg font-medium placeholder-[#d0d0d0] focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all disabled:opacity-50"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호"
              required
              autoComplete="current-password"
              disabled={isLoading}
              className="w-full h-16 px-5 py-5 bg-[#f3f3f3] rounded-[40px] text-lg font-medium placeholder-[#d0d0d0] focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          {/* 비밀번호 찾기 링크 */}
          <div className="flex justify-end px-2 pb-2.5 h-9">
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className="text-[#b1b1b1] text-xs font-normal hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              비밀번호를 잊었나요?
            </button>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!formData.loginId || !formData.password || isLoading}
            className="w-full h-16 bg-black text-white text-xl font-semibold rounded-[40px] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </div>
      </form>

      {/* 회원가입 링크 */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleRegisterRedirect}
          disabled={isLoading}
          className="text-[#898989] text-xs font-normal hover:text-gray-600 transition-colors disabled:opacity-50"
        >
          회원가입하기
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
