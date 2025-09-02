import SimpleDropdown from '@/components/Community/NewPost/SimpleDropdown';
import { dropdownOptions } from '@/constants/dropdownOptions';
import { useEffect, useMemo } from 'react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

const NewPostForm = ({ formData, onChange }) => {
  const { t } = useTranslation();
  const textareaRef = useRef();
  const handleFieldChange = (field, value) => {
    onChange({
      ...formData,
      [field]: value,
    });
  };

  const categoryOptions = useMemo(
    () =>
      dropdownOptions.CATEGORY_OPTIONS.map((opt) =>
        t(`dropdown.category.${opt.key}`)
      ),
    [t]
  );

  const industryOptions = useMemo(
    () =>
      dropdownOptions.INDUSTRY_OPTIONS.map((opt) =>
        t(`dropdown.industry.${opt.key}`)
      ),
    [t]
  );

  // content의 길이에 따라 textarea 높이 변경
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.content]);

  return (
    <div className="px-5 py-5 space-y-6">
      {/* 카테고리 선택 */}
      <div className="space-y-2">
        <SimpleDropdown
          options={categoryOptions}
          value={formData.category}
          onChange={(value) => handleFieldChange('category', value)}
          placeholder={t('community.newPost.categoryPlaceholder')}
        />
      </div>

      {/* 업종 선택 */}
      <div className="space-y-2">
        <SimpleDropdown
          options={industryOptions}
          value={formData.industry}
          onChange={(value) => handleFieldChange('industry', value)}
          placeholder={t('community.newPost.industryPlaceholder')}
        />
      </div>

      {/* 제목 입력 */}
      <div className="space-y-2">
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder={t('community.newPost.titlePlaceholder')}
          className="w-full py-3 text-lg font-semibold border-b border-gray-300 focus:outline-none focus:border-b-blue-500 placeholder-gray-400"
        />
      </div>

      {/* 내용 입력 */}
      <div className="space-y-2">
        <textarea
          ref={textareaRef}
          value={formData.content}
          onChange={(e) => handleFieldChange('content', e.target.value)}
          placeholder={t('community.newPost.contentPlaceholder')}
          rows={12}
          className="w-full py-3 rounded-lg focus:outline-none focus:border-blue-500 placeholder-gray-400 resize-none"
        />
      </div>
    </div>
  );
};

export default NewPostForm;
