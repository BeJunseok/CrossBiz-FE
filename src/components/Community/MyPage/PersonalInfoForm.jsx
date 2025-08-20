import Dropdown from '@/components/common/Dropdown';
import { dropdownOptions } from '@/constants/dropdownOptions';
import { Link } from 'react-router-dom';

const {
  AGE_OPTIONS,
  NATIONALITY_OPTIONS,
  BUSINESS_INFO_OPTIONS,
  RESIDENCE_STATUS_OPTIONS,
  EXPECTED_STAY_PERIOD_OPTIONS,
  WORK_EXPERIENCE_OPTIONS,
  DEGREE_OPTIONS,
  KOREAN_PROFICIENCY_OPTIONS,
} = dropdownOptions;

const PersonalInfoForm = ({ formData, errors, onFieldChange }) => {
  return (
    <div className="px-8 pb-14">
      <h3 className="text-base font-semibold text-black mb-5">내 정보</h3>

      <div className="space-y-8">
        {/* 이름 */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 text-sm mb-6">이름</label>
            <div className="border-b border-gray-200 pb-2">
              <input
                type="text"
                value={formData.name}
                className="w-full bg-transparent text-black text-sm focus:outline-none cursor-default"
                readOnly
              />
            </div>
          </div>
        </div>

        {/* 나이 */}
        <div>
          <label className="block text-gray-600 text-sm mb-3">나이</label>
          <Dropdown
            options={AGE_OPTIONS}
            value={formData.age}
            onChange={(value) => onFieldChange('age', value)}
            error={errors.age}
          />
        </div>

        {/* 국적 */}
        <div>
          <label className="block text-gray-600 text-sm mb-3">국적</label>
          <Dropdown
            options={NATIONALITY_OPTIONS}
            value={formData.nationality}
            onChange={(value) => onFieldChange('nationality', value)}
            error={errors.nationality}
          />
        </div>

        {/* 사업자 정보 */}
        <div>
          <label className="block text-gray-600 text-sm mb-3">
            사업자 정보
          </label>
          <Dropdown
            options={BUSINESS_INFO_OPTIONS}
            value={formData.businessInfo}
            onChange={(value) => onFieldChange('businessInfo', value)}
            error={errors.businessInfo}
          />
        </div>

        {/* 체류 자격과 예상 체류 기간 */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-3">
              체류 자격
            </label>
            <Dropdown
              options={RESIDENCE_STATUS_OPTIONS}
              value={formData.residenceStatus}
              onChange={(value) => onFieldChange('residenceStatus', value)}
              error={errors.residenceStatus}
            />
          </div>
          <div className="col-span-3">
            <label className="block text-gray-600 text-sm mb-3">
              예상 체류 기간
            </label>
            <Dropdown
              options={EXPECTED_STAY_PERIOD_OPTIONS}
              value={formData.expectedStayPeriod}
              onChange={(value) => onFieldChange('expectedStayPeriod', value)}
              error={errors.expectedStayPeriod}
            />
          </div>
        </div>

        {/* 근무 경력과 학위 */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-2">
            <label className="block text-gray-600 text-sm mb-3">
              근무 경력
            </label>
            <Dropdown
              options={WORK_EXPERIENCE_OPTIONS}
              value={formData.workExperience}
              onChange={(value) => onFieldChange('workExperience', value)}
              error={errors.workExperience}
            />
          </div>
          <div className="col-span-3">
            <label className="block text-gray-600 text-sm mb-3">학위</label>
            <Dropdown
              options={DEGREE_OPTIONS}
              value={formData.education}
              onChange={(value) => onFieldChange('education', value)}
              error={errors.education}
            />
          </div>
        </div>

        {/* 한국어 능력 */}
        <div>
          <label className="block text-gray-600 text-sm mb-3">
            한국어 능력
          </label>
          <Dropdown
            options={KOREAN_PROFICIENCY_OPTIONS}
            value={formData.koreanProficiency}
            onChange={(value) => onFieldChange('koreanProficiency', value)}
            error={errors.koreanProficiency}
          />
        </div>
      </div>

      {/* 더보기 텍스트 */}
      <div className="text-right mt-8">
        <Link to="/community/my/edit" className="text-gray-600 text-sm">
          더보기
        </Link>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
