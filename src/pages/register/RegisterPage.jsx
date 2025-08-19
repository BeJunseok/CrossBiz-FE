import clsx from 'clsx';
import Logo from '@/components/common/Logo';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { registerSchema } from '@/utils/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRegisterStore } from '@/stores/registerStore';

const RegisterPage = () => {
  const { formData, updateFormData } = useRegisterStore();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateFormData(data);
    console.log('로그인 정보: ', data);
    nav('/register/personal-info');
  };

  const handleLoginRedirect = () => {
    nav('/login');
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col items-center justify-center px-10">
      {/* 로고 영역 */}
      <Logo className="mb-16" />

      {/* 회원가입 폼 */}
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-80">
        <div className="space-y-5 mb-5">
          <div className="space-y-1.5">
            {/* 아이디 입력 */}
            <div className="relative">
              <input
                type="text"
                {...register('username')}
                placeholder="아이디"
                required
                autoComplete="username"
                className={clsx(
                  'w-full h-16 px-5 py-5 bg-[#f3f3f3] rounded-[40px] text-lg font-medium placeholder-[#d0d0d0] focus:outline-none transition-all',
                  {
                    'focus:ring-2 focus:ring-red-300 border-red-300':
                      errors.username,
                    'focus:ring-2 focus:ring-gray-300': !errors.username,
                  }
                )}
              />
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 px-4">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* 비밀번호 입력 */}
            <div className="relative">
              <input
                type="password"
                {...register('password')}
                placeholder="비밀번호"
                required
                autoComplete="new-password"
                className={clsx(
                  'w-full h-16 px-5 py-5 bg-[#f3f3f3] rounded-[40px] text-lg font-medium placeholder-[#d0d0d0] focus:outline-none transition-all',
                  {
                    'focus:ring-2 focus:ring-red-300 border-red-300':
                      errors.password,
                    'focus:ring-2 focus:ring-gray-300': !errors.password,
                  }
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 px-4">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* 비밀번호 확인 입력 */}
            <div className="relative">
              <input
                type="password"
                {...register('confirmPassword')}
                placeholder="비밀번호 확인"
                required
                autoComplete="new-password"
                className={clsx(
                  'w-full h-16 px-5 py-5 bg-[#f3f3f3] rounded-[40px] text-lg font-medium placeholder-[#d0d0d0] focus:outline-none transition-all',
                  {
                    'focus:ring-2 focus:ring-red-300 border-red-300':
                      errors.confirmPassword,
                    'focus:ring-2 focus:ring-gray-300': !errors.confirmPassword,
                  }
                )}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 px-4">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={!isValid}
            className="w-full h-16 bg-black text-white text-xl font-semibold rounded-[40px] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors mt-5"
          >
            회원가입
          </button>
        </div>
      </form>

      {/* 로그인 링크 */}
      <div className="text-center">
        <button
          type="button"
          onClick={handleLoginRedirect}
          className="text-[#898989] text-xs font-normal hover:text-gray-600 transition-colors"
        >
          이미 계정이 있습니다
        </button>
      </div>
    </div>
  );
};

export default RegisterPage;
