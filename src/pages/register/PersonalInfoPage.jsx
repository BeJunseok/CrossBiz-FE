import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '@/utils/validation';
import { dropdownOptions } from '@/constants/dropdownOptions';
import Dropdown from '@/components/common/Dropdown';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { signupBasic } from '@/api/auth/Auth';

const { AGE_OPTIONS, NATIONALITY_OPTIONS, BUSINESS_INFO_OPTIONS } =
  dropdownOptions;

const PersonalInfoPage = () => {
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [registerData, setRegisterData] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem('step1Data');
    if (!savedData) {
      alert('회원가입 정보가 없습니다. 처음부터 다시 시작해주세요');
      nav('/register');
      return;
    }

    setRegisterData(JSON.parse(savedData));
  }, [nav]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    if (!registerData) {
      alert('회원가입 정보가 없습니다.');
      nav('/register');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiData = {
        loginId: registerData.loginId,
        password: registerData.password,
        name: data.name,
        nationality: data.nationality,
        age: data.age,
        status: data.status,
      };
      console.log('기본 회원가입 데이터: ', apiData);

      const response = await signupBasic(apiData);
      console.log('회원가입 성공: ', response);

      sessionStorage.setItem(
        'step2Data',
        JSON.stringify({
          ...data,
          userId: response.userId,
          apiResponse: response,
        })
      );

      // 이전 register 데이터 삭제
      sessionStorage.removeItem('step1Data');

      nav('/register/visa-info');
    } catch (error) {
      console.error('기본 회원가입 오류:', error);

      if (error.response?.status === 409) {
        setError('이미 존재하는 아이디입니다.');
      } else if (error.response?.status === 400) {
        setError('입력 정보를 확인해주세요.');
      } else if (error.response?.status >= 500) {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('회원가입 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!registerData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      {/* 헤더 */}
      <header className="bg-white border-b h-16" />

      <div className="px-9 pt-12">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-black mb-5">
            안녕하세요 !
          </h1>
          <p className="text-2xl font-medium text-black leading-8">
            고객님의 맞춤형 정보 제공을 위해
            <br />
            정보를 입력해주세요.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* 이름 입력 */}
          <div>
            <label className="block text-base font-normal text-[#5b5b5b] mb-5">
              이름
            </label>
            <input
              type="text"
              {...register('name')}
              disabled={isLoading}
              className={clsx(
                'w-full h-10 border-b pb-2 text-lg font-medium text-black bg-transparent focus:outline-none transition-colors disabled:opacity-50',
                {
                  'border-red-500 focus:border-red-500': errors.name,
                  'border-gray-300 focus:border-blue-500': !errors.name,
                }
              )}
              placeholder=""
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* 나이 드롭다운 */}
          <div>
            <label className="block text-base font-normal text-[#5b5b5b] mb-5">
              나이
            </label>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={AGE_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="선택해주세요"
                  error={errors.age}
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {/* 국적 드롭다운 */}
          <div>
            <label className="block text-base font-normal text-[#5b5b5b] mb-5">
              국적
            </label>
            <Controller
              name="nationality"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={NATIONALITY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="선택해주세요"
                  error={errors.nationality}
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {/* 사업자 정보 드롭다운 */}
          <div>
            <label className="block text-base font-normal text-[#5b5b5b] mb-5">
              사업자 정보
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={BUSINESS_INFO_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="선택해주세요"
                  error={errors.status}
                  disabled={isLoading}
                />
              )}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          {/* 확인 버튼 */}
          <div className="pt-20 pb-10">
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-80 h-16 bg-black text-white text-xl font-semibold rounded-[40px] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? '처리 중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
