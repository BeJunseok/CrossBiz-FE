import clsx from 'clsx';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema } from '@/utils/validation';
import { dropdownOptions } from '@/constants/dropdownOptions';
import Dropdown from '@/components/register/Dropdown';
import { useRegisterStore } from '@/stores/registerStore';
import { useNavigate } from 'react-router-dom';

const { AGE_OPTIONS, NATIONALITY_OPTIONS, BUSINESS_INFO_OPTIONS } =
  dropdownOptions;

const PersonalInfoPage = () => {
  const { formData, updateFormData } = useRegisterStore();
  const nav = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: formData,
  });

  const onSubmit = (data) => {
    updateFormData(data);
    console.log('Personal info:', data);
    nav('/register/visa-info');
  };

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
              className={clsx(
                'w-full h-10 border-b pb-2 text-lg font-medium text-black bg-transparent focus:outline-none transition-colors',
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
              name="businessInfo"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={BUSINESS_INFO_OPTIONS}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="선택해주세요"
                  error={errors.businessInfo}
                />
              )}
            />
          </div>

          {/* 확인 버튼 */}
          <div className="pt-20 pb-10">
            <button
              type="submit"
              disabled={!isValid}
              className="w-80 h-16 bg-black text-white text-xl font-semibold rounded-[40px] hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PersonalInfoPage;
