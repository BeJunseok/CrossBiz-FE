import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Dropdown from '@/components/common/Dropdown';
import { visaInfoSchema } from '@/utils/validation';
import { dropdownOptions } from '@/constants/dropdownOptions';
import { signupDetail } from '@/api/auth/Auth'; // API 함수 경로 확인 필요

const {
  DEGREE_OPTIONS,
  RESIDENCE_STATUS_OPTIONS, // API의 bizCategory 필드에 해당
  KOREAN_PROFICIENCY_OPTIONS,
  EXPECTED_STAY_PERIOD_OPTIONS,
  WORK_EXPERIENCE_OPTIONS,
} = dropdownOptions;

const VisaInfoPage = () => {
  const nav = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const { handleSubmit, control } = useForm({
    resolver: zodResolver(visaInfoSchema),
    mode: 'onChange',
  });

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

      console.log('추가 정보 API 데이터:', filteredData);

      // 전송할 추가 정보가 있을 경우에만 API를 호출합니다.
      if (Object.keys(filteredData).length > 0) {
        await signupDetail(filteredData);
      }

      alert('회원가입이 성공적으로 완료되었습니다.');
      nav('/login');
    } catch (error) {
      console.error('추가 정보 등록 오류:', error);
      if (error.response?.status >= 500) {
        setError('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError(
          error.response?.data?.message || '정보 등록 중 오류가 발생했습니다.'
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // '건너뛰기' 버튼을 누르면 바로 로그인 페이지로 이동합니다.
  const handleSkip = () => {
    alert('회원가입이 성공적으로 완료되었습니다.');
    nav('/login');
  };

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
            필요해요. (선택)
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
                    {...field}
                    placeholder="선택해주세요"
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
                name="estimatePeriod"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={EXPECTED_STAY_PERIOD_OPTIONS}
                    {...field}
                    placeholder="선택해주세요"
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
                    {...field}
                    placeholder="선택해주세요"
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
                    {...field}
                    placeholder="선택해주세요"
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
                  {...field}
                  placeholder="선택해주세요"
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
              {isSubmitting ? '처리 중...' : '확인'}
            </button>
            <button
              type="button"
              onClick={handleSkip}
              disabled={isSubmitting}
              className="w-80 h-16 bg-white text-black text-xl font-semibold rounded-[40px] border border-[#d0d0d0] hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
            >
              건너뛰기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisaInfoPage;
