import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getPersonalInfoSchema } from '@/utils/validation';
import { dropdownOptions } from '@/constants/dropdownOptions';
import Dropdown from '@/components/common/Dropdown';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { signupBasic } from '@/api/auth/Auth';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';

const PersonalInfoPage = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { loginData } = location.state || {};

  const personalInfoSchema = useMemo(() => getPersonalInfoSchema(t), [t]);

  const ageOptions = useMemo(
    () =>
      dropdownOptions.AGE_OPTIONS.map((opt) => ({
        ...opt,
        label: t(`dropdown.age.${opt.key}`),
      })),
    [t]
  );

  const nationalityOptions = useMemo(
    () =>
      dropdownOptions.NATIONALITY_OPTIONS.map((opt) => ({
        ...opt,
        label: t(`dropdown.nationality.${opt.key}`),
      })),
    [t]
  );

  const businessInfoOptions = useMemo(
    () =>
      dropdownOptions.BUSINESS_INFO_OPTIONS.map((opt) => ({
        ...opt,
        label: t(`dropdown.businessInfo.${opt.key}`),
      })),
    [t]
  );

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
    if (!loginData) {
      alert(t('register.personalInfo.errorNoLoginData'));
      nav('/register');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const apiData = {
        loginId: loginData.loginId,
        password: loginData.password,
        name: data.name,
        nationality: data.nationality,
        age: data.age,
        status: data.status, // '사업자 정보'가 'status' 필드로 전송됨
      };

      const response = await signupBasic(apiData);
      console.log(response);

      const { accessToken, ...userData } = response;
      login(accessToken, userData);

      nav('/register/visa-info');
    } catch (error) {
      console.error('기본 회원가입 오류:', error);
      if (error.response?.status === 409) {
        setError(t('register.personalInfo.errorAlreadyExists'));
      } else if (error.response?.status === 400) {
        setError(t('register.personalInfo.errorBadRequest'));
      } else if (error.response?.status >= 500) {
        setError(t('register.personalInfo.errorServer'));
      } else {
        setError(t('register.personalInfo.errorGeneral'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!loginData) {
      alert(t('register.personalInfo.errorNoLoginData'));
      nav('/register');
    }
  }, [loginData]);

  return (
    <div className="min-h-screen w-full bg-white">
      <header className="bg-white border-b h-16" />
      <div className="px-9 pt-12">
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-black mb-5">
            {t('register.personalInfo.greeting')}
          </h1>
          <p className="text-2xl font-medium text-black leading-8">
            {t('register.personalInfo.promptLine1')}
            <br />
            {t('register.personalInfo.promptLine2')}
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <label className="block text-base font-normal text-[#5b5b5b] mb-5">
              {t('register.personalInfo.nameLabel')}
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
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-base font-normal text-[#5b5b5b] mb-5">
              {t('register.personalInfo.ageLabel')}
            </label>
            <Controller
              name="age"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={ageOptions}
                  {...field}
                  placeholder={t('register.personalInfo.selectPlaceholder')}
                  error={errors.age}
                  disabled={isLoading}
                />
              )}
            />
          </div>
          <div>
            <label className="block text-base font-normal text-[#5b5b5b] mb-5">
              {t('register.personalInfo.nationalityLabel')}
            </label>
            <Controller
              name="nationality"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={nationalityOptions}
                  {...field}
                  placeholder={t('register.personalInfo.selectPlaceholder')}
                  error={errors.nationality}
                  disabled={isLoading}
                />
              )}
            />
          </div>
          <div>
            <label className="block text-base font-normal text-[#5b5b5b] mb-5">
              {t('register.personalInfo.businessInfoLabel')}
            </label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={businessInfoOptions}
                  {...field}
                  placeholder={t('register.personalInfo.selectPlaceholder')}
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
          <div className="pt-20 pb-10">
            <button
              type="submit"
              disabled={!isValid || isLoading}
              className="w-80 h-16 bg-black text-white text-xl font-semibold rounded-[40px] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading
                ? t('register.personalInfo.processingButton')
                : t('register.personalInfo.nextButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
