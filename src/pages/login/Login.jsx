import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const LoginPage = () => {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (formData.username === 'test' && formData.password === '1234') {
      alert('로그인 성공!');
      nav('/');
    } else {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
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
      <Logo className="mb-16" />

      {/* 로그인 폼 */}
      <form onSubmit={handleLogin} className="w-full max-w-80">
        <div className="space-y-5 mb-5">
          <div className="space-y-1.5">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="아이디"
              required
              autoComplete="username"
              className="w-full h-16 px-5 py-5 bg-[#f3f3f3] rounded-[40px] text-lg font-medium placeholder-[#d0d0d0] focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="비밀번호"
              required
              autoComplete="current-password"
              className="w-full h-16 px-5 py-5 bg-[#f3f3f3] rounded-[40px] text-lg font-medium placeholder-[#d0d0d0] focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
            />
          </div>

          {/* 비밀번호 찾기 링크 */}
          <div className="flex justify-end px-2 pb-2.5 h-9">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-[#b1b1b1] text-xs font-normal hover:text-gray-600 transition-colors"
            >
              비밀번호를 잊었나요?
            </button>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={!formData.username || !formData.password}
            className="w-full h-16 bg-black text-white text-xl font-semibold rounded-[40px] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            로그인
          </button>
        </div>
      </form>

      {/* 회원가입 링크 */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleRegisterRedirect}
          className="text-[#898989] text-xs font-normal hover:text-gray-600 transition-colors"
        >
          회원가입하기
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
