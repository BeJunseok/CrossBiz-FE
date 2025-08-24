import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Dropdown from '@/components/common/Dropdown';
import { visaInfoSchema } from '@/utils/validation';
import { dropdownOptions } from '@/constants/dropdownOptions';
import { signupDetail } from '@/api/auth/Auth';

const {
  RESIDENCE_STATUS_OPTIONS,
  EXPECTED_STAY_PERIOD_OPTIONS,
  WORK_EXPERIENCE_OPTIONS,
  DEGREE_OPTIONS,
  KOREAN_PROFICIENCY_OPTIONS,
} = dropdownOptions;

const VisaInfoPage = () => {
  const nav = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [registerData, setRegisterData] = useState(null);

  useEffect(() => {
    const savedData = sessionStorage.getItem('step2Data');
    if (!savedData) {
      alert('회원가입 정보가 없습니다. 처음부터 다시 시작해주세요.');
      nav('/register');
      return;
    }
    setRegisterData(JSON.parse(savedData));
  }, [nav]);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(visaInfoSchema),
    mode: 'onChange',
  });

  const handleRegistrationSubmit = async (finalData, isSkip = false) => {
    setIsSubmitting(true);
    setError('');

    try {
      if (!isSkip) {
        const apiData = {
          degree: finalData.degree || '',
          bizCategory: finalData.bizCategory || '',
          koreanLevel: finalData.koreanLevel || '',
          estimatePeriod: finalData.estimatedPeriod || '',
          workExperience: finalData.workExperience || '',
        };

        // 빈 값들은 제거해서 전송
        const filteredData = Object.keys(apiData).reduce((acc, key) => {
          if (apiData[key]) {
            acc[key] = apiData[key];
          }
          return acc;
        }, {});

        console.log('추가 정보 API 데이터:', filteredData);

        if (Object.keys(filteredData).length > 0) {
          const response = await signupDetail(filteredData);
          console.log('추가 정보 등록 성공:', response);
        }
      }

      console.log('회원가입 완료! 최종 데이터:', finalData);

      // 세션 스토리지 정리
      sessionStorage.removeItem('step1Data');
      sessionStorage.removeItem('step2Data');

      alert('회원가입 완료!');
      nav('/login');
    } catch (error) {
      console.error('추가 정보 등록 오류:', error);

      if (error.response?.status === 401) {
        setError('인증이 만료되었습니다. 다시 시도해주세요.');
        // 세션 정리 후 처음부터 다시
        sessionStorage.removeItem('step1Data');
        sessionStorage.removeItem('step2Data');
        setTimeout(() => nav('/register'), 2000);
      } else if (error.response?.status >= 500) {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('정보 등록 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data) => {
    const completeFormData = { ...registerData, ...data };
    handleRegistrationSubmit(completeFormData, false);
  };

  const handleSkip = async () => {
    const completeFormData = {
      ...registerData,
      bizCategory: '',
      estimatedPeriod: '',
      workExperience: '',
      degree: '',
      koreanLevel: '',
    };

    handleRegistrationSubmit(completeFormData, true);
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
      <header className="bg-white border-b border-gray-300 h-16" />

      <div className="px-9 pt-6">
        <div className="mb-8 text-center">
          <p className="text-2xl font-medium text-black leading-8">
            고객님에게 맞춤화된 자료를
            <br />
            제공하기 위해 더 자세한 정보가
            <br />
            필요해요.
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-5 gap-3">
            {/* 체류 자격 */}
            <div className="col-span-2">
              <label className="block text-sm font-normal text-[#5b5b5b] mb-5">
                체류 자격
              </label>
              <Controller
                name="bizCategory"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={RESIDENCE_STATUS_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="선택해주세요"
                    error={errors.bizCategory}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>

            {/* 예상 체류 기간  */}
            <div className="col-span-3">
              <label className="block text-sm font-normal text-[#5b5b5b] mb-5">
                예상 체류 기간
              </label>
              <Controller
                name="estimatedPeriod"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={EXPECTED_STAY_PERIOD_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="선택해주세요"
                    error={errors.estimatedPeriod}
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
                근무 경력
              </label>
              <Controller
                name="workExperience"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={WORK_EXPERIENCE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="선택해주세요"
                    error={errors.workExperience}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>

            {/* 학위 */}
            <div className="col-span-3">
              <label className="block text-sm font-normal text-[#5b5b5b] mb-5">
                학위
              </label>
              <Controller
                name="degree"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={DEGREE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="선택해주세요"
                    error={errors.degree}
                    disabled={isSubmitting}
                  />
                )}
              />
            </div>
          </div>

          {/* 한국어 능력 */}
          <div>
            <label className="block text-sm font-normal text-[#5b5b5b] mb-5">
              한국어 능력
            </label>
            <Controller
              name="koreanLevel"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={KOREAN_PROFICIENCY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="선택해주세요"
                  error={errors.koreanLevel}
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
            {/* 확인 버튼 */}
            <button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="w-80 h-16 bg-black text-white text-xl font-semibold rounded-[40px] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '처리중...' : '확인'}
            </button>

            {/* 건너뛰기 버튼 */}
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="w-80 h-16 bg-white text-black text-xl font-semibold rounded-[40px] border border-[#d0d0d0] hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? '처리중...' : '건너뛰기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisaInfoPage;
