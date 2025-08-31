import { useMemo } from 'react';
import Dropdown from '@/components/common/Dropdown';
import { dropdownOptions } from '@/constants/dropdownOptions';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const PersonalInfoForm = ({ formData, errors, onFieldChange }) => {
  const { t } = useTranslation();

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

  return (
    <div className="px-8 pb-14">
      <h3 className="text-base font-semibold text-black mb-5">
        {t('community.myPage.myInfo')}
      </h3>

      <div className="space-y-8">
        {/* 이름 */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-600 text-sm mb-6">
              {t('community.myPage.nameLabel')}
            </label>
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
          <label className="block text-gray-600 text-sm mb-3">
            {t('community.myPage.ageLabel')}
          </label>
          <Dropdown
            options={ageOptions}
            value={formData.age}
            onChange={(value) => onFieldChange('age', value)}
            error={errors.age}
          />
        </div>

        {/* 국적 */}
        <div>
          <label className="block text-gray-600 text-sm mb-3">
            {t('community.myPage.nationalityLabel')}
          </label>
          <Dropdown
            options={nationalityOptions}
            value={formData.nationality}
            onChange={(value) => onFieldChange('nationality', value)}
            error={errors.nationality}
          />
        </div>

        {/* 사업자 정보 */}
        <div>
          <label className="block text-gray-600 text-sm mb-3">
            {t('community.myPage.businessInfoLabel')}
          </label>
          <Dropdown
            options={businessInfoOptions}
            value={formData.businessInfo}
            onChange={(value) => onFieldChange('businessInfo', value)}
            error={errors.businessInfo}
          />
        </div>

        {/* 체류 자격과 예상 체류 기간 */}
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-3">
            <label className="block text-gray-600 text-sm mb-3">
              {t('community.myPage.residenceStatusLabel')}
            </label>
            <Dropdown
              options={residenceStatusOptions}
              value={formData.residenceStatus}
              onChange={(value) => onFieldChange('residenceStatus', value)}
              error={errors.residenceStatus}
            />
          </div>
          <div className="col-span-4">
            <label className="block text-gray-600 text-sm mb-3">
              {t('community.myPage.expectedStayPeriodLabel')}
            </label>
            <Dropdown
              options={expectedStayPeriodOptions}
              value={formData.expectedStayPeriod}
              onChange={(value) => onFieldChange('expectedStayPeriod', value)}
              error={errors.expectedStayPeriod}
            />
          </div>
        </div>

        {/* 근무 경력과 학위 */}
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-3">
            <label className="block text-gray-600 text-sm mb-3">
              {t('community.myPage.workExperienceLabel')}
            </label>
            <Dropdown
              options={workExperienceOptions}
              value={formData.workExperience}
              onChange={(value) => onFieldChange('workExperience', value)}
              error={errors.workExperience}
            />
          </div>
          <div className="col-span-4">
            <label className="block text-gray-600 text-sm mb-3">
              {t('community.myPage.degreeLabel')}
            </label>
            <Dropdown
              options={degreeOptions}
              value={formData.education}
              onChange={(value) => onFieldChange('education', value)}
              error={errors.education}
            />
          </div>
        </div>

        {/* 한국어 능력 */}
        <div>
          <label className="block text-gray-600 text-sm mb-3">
            {t('community.myPage.koreanProficiencyLabel')}
          </label>
          <Dropdown
            options={koreanProficiencyOptions}
            value={formData.koreanProficiency}
            onChange={(value) => onFieldChange('koreanProficiency', value)}
            error={errors.koreanProficiency}
          />
        </div>
      </div>

      {/* 더보기 텍스트 */}
      <div className="text-right mt-8">
        <Link to="/community/my/edit" className="text-gray-600 text-sm">
          {t('community.myPage.more')}
        </Link>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
