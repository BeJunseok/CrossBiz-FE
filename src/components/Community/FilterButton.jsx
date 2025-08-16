import { useState } from 'react';
import ChevronDown from '@/assets/icons/ChevronDown.svg?react';
import ChevronUp from '@/assets/icons/ChevronUp.svg?react';

const FilterButtons = ({ onFilterChange }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState({
    industry: '',
    nationality: '',
    category: '',
  });

  const filterOptions = {
    industry: ['외식업', '소매·유통', '서비스업', 'IT', '문화·예술', '기타'],
    nationality: ['중국', '미국', '터키', '태국', '기타'],
    category: ['Q&A', 'Discussion', 'Help', 'Tips'],
  };

  const filterLabels = {
    industry: '업종',
    nationality: '국적',
    category: '카테고리',
  };

  const handleDropdownToggle = (filterType) => {
    setOpenDropdown(openDropdown === filterType ? null : filterType);
  };

  const handleOptionSelect = (filterType, option) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: selectedFilters[filterType] === option ? '' : option,
    };
    setSelectedFilters(newFilters);
    setOpenDropdown(null);
    onFilterChange(newFilters);
  };

  const FilterButton = ({ filterType }) => (
    <div className="relative">
      <button
        className={`bg-white px-3.5 py-1.5 rounded-full shadow-sm text-xs flex items-center gap-1 transition-colors ${
          openDropdown === filterType
            ? 'border border-blue-500'
            : 'border border-gray-200'
        } ${selectedFilters[filterType] ? 'bg-blue-50' : 'text-gray-600'}`}
        onClick={() => handleDropdownToggle(filterType)}
      >
        {selectedFilters[filterType] || filterLabels[filterType]}
        {openDropdown === filterType ? (
          <ChevronUp size={8} />
        ) : (
          <ChevronDown size={8} />
        )}
      </button>

      {openDropdown === filterType && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]">
          {filterOptions[filterType].map((option) => (
            <button
              key={option}
              className={`w-full px-3 py-2 text-left text-xs hover:bg-gray-50 first:rounded-t-md last:rounded-b-md ${
                selectedFilters[filterType] === option
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700'
              }`}
              onClick={() => handleOptionSelect(filterType, option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex gap-1 mb-4">
      <FilterButton filterType="industry" />
      <FilterButton filterType="nationality" />
      <FilterButton filterType="category" />
    </div>
  );
};

export default FilterButtons;
