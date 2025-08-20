import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import Dropdown from '@/components/common/Dropdown';
import { visaInfoSchema } from '@/utils/validation';
import { dropdownOptions } from '@/constants/dropdownOptions';
import { useRegisterStore } from '@/stores/registerStore';

const {
  RESIDENCE_STATUS_OPTIONS,
  EXPECTED_STAY_PERIOD_OPTIONS,
  WORK_EXPERIENCE_OPTIONS,
  DEGREE_OPTIONS,
  KOREAN_PROFICIENCY_OPTIONS,
} = dropdownOptions;

const VisaInfoPage = () => {
  const { formData, resetFormData } = useRegisterStore();
  const nav = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(visaInfoSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  const handleRegistrationSubmit = async (finalData) => {
    setIsSubmitting(true);

    setTimeout(() => {
      console.log('회원가입 완료! 최종 데이터:', finalData);
      resetFormData();

      alert('회원가입 완료!');
      nav('/login');

      setIsSubmitting(false);
    }, 2000);
  };

  const onSubmit = (data) => {
    const completeFormData = { ...formData, ...data };
    handleRegistrationSubmit(completeFormData);
  };

  const handleSkip = async () => {
    const completeFormData = {
      ...formData,
      visaStatus: '',
      expectedStayPeriod: '',
      workExperience: '',
      education: '',
      koreanProficiency: '',
    };

    handleRegistrationSubmit(completeFormData);
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
                name="visaStatus"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={RESIDENCE_STATUS_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="선택해주세요"
                    error={errors.visaStatus}
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
                name="expectedStayPeriod"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={EXPECTED_STAY_PERIOD_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="선택해주세요"
                    error={errors.expectedStayPeriod}
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
                name="education"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    options={DEGREE_OPTIONS}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="선택해주세요"
                    error={errors.education}
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
              name="koreanProficiency"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={KOREAN_PROFICIENCY_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="선택해주세요"
                  error={errors.koreanProficiency}
                />
              )}
            />
          </div>

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
