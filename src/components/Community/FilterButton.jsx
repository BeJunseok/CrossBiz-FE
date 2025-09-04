import { useState, useMemo } from 'react';
import { dropdownOptions } from '@/constants/dropdownOptions';
import ChevronDown from '@/assets/svg/common/ChevronDown.svg?react';
import ChevronUp from '@/assets/svg/community/ChevronUp.svg?react';
import { useTranslation } from 'react-i18next';

const FilterButtons = ({ onFilterChange }) => {
  const { t } = useTranslation();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    industry: '',
    nationality: '',
    category: '',
  });

  const filterData = useMemo(
    () => ({
      industry: {
        label: t('community.main.filters.industry'),
        options: dropdownOptions.INDUSTRY_OPTIONS.map((opt) => ({
          ...opt,
          label: t(`dropdown.industry.${opt.key}`),
        })),
      },
      nationality: {
        label: t('community.main.filters.nationality'),
        options: dropdownOptions.NATIONALITY_OPTIONS.map((opt) => ({
          ...opt,
          label: t(`dropdown.nationality.${opt.key}`),
        })),
      },
      category: {
        label: t('community.main.filters.category'),
        options: dropdownOptions.CATEGORY_OPTIONS.map((opt) => ({
          ...opt,
          label: t(`dropdown.category.${opt.key}`),
        })),
      },
    }),
    [t]
  );

  const handleDropdownToggle = (filterType) => {
    setOpenDropdown(openDropdown === filterType ? null : filterType);
  };

  const handleOptionSelect = (filterType, option) => {
    const selectedLabel = option.label;
    const newFilters = {
      ...selectedFilters,
      [filterType]:
        selectedFilters[filterType] === selectedLabel ? '' : selectedLabel,
    };
    setSelectedFilters(newFilters);
    setOpenDropdown(null);
    onFilterChange(newFilters); // 번역된 텍스트 전달
  };

  const FilterButton = ({ filterType }) => {
    const currentFilterData = filterData[filterType];
    const selectedLabel = selectedFilters[filterType];
    const displayLabel = selectedLabel || currentFilterData.label;

    return (
      <div className="relative">
        <button
          className={`bg-white px-3.5 py-1.5 rounded-full shadow-sm text-xs flex items-center gap-1 transition-colors ${
            openDropdown === filterType
              ? 'border border-blue-500'
              : 'border border-gray-200'
          } ${selectedLabel ? 'bg-blue-50' : 'text-gray-600'}`}
          onClick={() => handleDropdownToggle(filterType)}
        >
          {displayLabel}
          {openDropdown === filterType ? (
            <ChevronUp size={8} />
          ) : (
            <ChevronDown size={8} />
          )}
        </button>

        {openDropdown === filterType && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
            {currentFilterData.options.map((option) => (
              <button
                key={option.key}
                className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                  selectedLabel === option.label
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700'
                }`}
                onClick={() => handleOptionSelect(filterType, option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex gap-1 mb-4">
      <FilterButton filterType="industry" />
      <FilterButton filterType="nationality" />
      <FilterButton filterType="category" />
    </div>
  );
};

export default FilterButtons;
