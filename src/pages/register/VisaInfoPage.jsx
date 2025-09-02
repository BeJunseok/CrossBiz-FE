import { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Dropdown from '@/components/common/Dropdown';
import { visaInfoSchema } from '@/utils/validation';
import { dropdownOptions } from '@/constants/dropdownOptions';
import { signupDetail } from '@/api/auth/Auth';
import { useTranslation } from 'react-i18next';

const VisaInfoPage = () => {
  const { t } = useTranslation();
  const nav = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(visaInfoSchema),
    mode: 'onChange',
  });

  const residenceStatusOptions = useMemo(
    () =>
      dropdownOptions.RESIDENCE_STATUS_OPTIONS.map((opt) => ({
        ...opt,
        label: t(`dropdown.residenceStatus.${opt.key}`),
      })),
    [t]
  );

  const expectedStayPeriodOptions = useMemo(
    () =>
      dropdownOptions.EXPECTED_STAY_PERIOD_OPTIONS.map((opt) => ({
        ...opt,
        label: t(`dropdown.expectedStay.${opt.key}`),
      })),
    [t]
  );

  const workExperienceOptions = useMemo(
    () =>
      dropdownOptions.WORK_EXPERIENCE_OPTIONS.map((opt) => ({
        ...opt,
        label: t(`dropdown.workExperience.${opt.key}`),
      })),
    [t]
  );

  const degreeOptions = useMemo(
    () =>
      dropdownOptions.DEGREE_OPTIONS.map((opt) => ({
        ...opt,
        label: t(`dropdown.degree.${opt.key}`),
      })),
    [t]
  );

  const koreanProficiencyOptions = useMemo(
    () =>
      dropdownOptions.KOREAN_PROFICIENCY_OPTIONS.map((opt) => ({
        ...opt,
        label: t(`dropdown.koreanProficiency.${opt.key}`),
      })),
    [t]
  );

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      // API 명세에 맞게 필드명 변경
      const apiData = {
        degree: data.degree,
        bizCategory: data.bizCategory, // '체류 자격'이 'bizCategory' 필드로 전송됨
        koreanLevel: data.koreanLevel,
        estimatePeriod: data.estimatePeriod,
        workExperience: data.workExperience,
      };

      // 값이 있는 필드만 추출하여 전송할 객체를 만듭니다.
      const filteredData = Object.fromEntries(
        Object.entries(apiData).filter(([_, value]) => value)
      );

      //console.log('추가 정보 API 데이터:', filteredData);

      // 전송할 추가 정보가 있을 경우에만 API를 호출합니다.
      if (Object.keys(filteredData).length > 0) {
        await signupDetail(filteredData);
      }

      alert(t('register.visaInfo.successMessage'));
      nav('/login');
    } catch (error) {
      console.error('추가 정보 등록 오류:', error);
      if (error.response?.status >= 500) {
        setError(t('register.visaInfo.errorServer'));
      } else {
        setError(
          error.response?.data?.message || t('register.visaInfo.errorGeneral')
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // '건너뛰기' 버튼을 누르면 바로 로그인 페이지로 이동합니다.
  const handleSkip = () => {
    alert(t('register.visaInfo.successMessage'));
    nav('/login');
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-300 h-16" />

      <div className="px-9 pt-6">
        <div className="mb-8 text-center">
          <p className="text-2xl font-medium text-black leading-8">
            {t('register.visaInfo.titleLine1')}
            <br />
            {t('register.visaInfo.titleLine2')}
            <br />
            {t('register.visaInfo.titleLine3')}
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-7 gap-3">
            {/* 체류 자격 */}
            <div className="col-span-3">
              <label className="block text-sm font-normal text-[#5b5b5b] mb-5">
                {t('register.visaInfo.residenceStatusLabel')}
              </label>
              <Controller
                name="bizCategory"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={residenceStatusOptions}
                    {...field}
                    placeholder={t('register.visaInfo.selectPlaceholder')}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>

            {/* 예상 체류 기간  */}
            <div className="col-span-4">
              <label className="block text-sm font-normal text-[#5b5b5b] mb-5">
                {t('register.visaInfo.expectedStayPeriodLabel')}
              </label>
              <Controller
                name="estimatePeriod"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={expectedStayPeriodOptions}
                    {...field}
                    placeholder={t('register.visaInfo.selectPlaceholder')}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-5 gap-4">
            {/* 근무 경력 */}
            <div className="col-span-2">
              <label className="block text-sm font-normal text-[#5b5b5b] mb-5">
                {t('register.visaInfo.workExperienceLabel')}
              </label>
              <Controller
                name="workExperience"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={workExperienceOptions}
                    {...field}
                    placeholder={t('register.visaInfo.selectPlaceholder')}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>

            {/* 학위 */}
            <div className="col-span-3">
              <label className="block text-sm font-normal text-[#5b5b5b] mb-5">
                {t('register.visaInfo.degreeLabel')}
              </label>
              <Controller
                name="degree"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={degreeOptions}
                    {...field}
                    placeholder={t('register.visaInfo.selectPlaceholder')}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>

          {/* 한국어 능력 */}
          <div>
            <label className="block text-sm font-normal text-[#5b5b5b] mb-5">
              {t('register.visaInfo.koreanProficiencyLabel')}
            </label>
            <Controller
              name="koreanLevel"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={koreanProficiencyOptions}
                  {...field}
                  placeholder={t('register.visaInfo.selectPlaceholder')}
                  disabled={isSubmitting}
                />
              )}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}

          <div className="pt-16 pb-10 space-y-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-80 h-16 bg-black text-white text-xl font-semibold rounded-[40px] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting
                ? t('register.visaInfo.processingButton')
                : t('register.visaInfo.confirmButton')}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="w-80 h-16 bg-white text-black text-xl font-semibold rounded-[40px] border border-[#d0d0d0] hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              {t('register.visaInfo.skipButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisaInfoPage;
