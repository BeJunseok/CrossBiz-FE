import ChevronDown from '@/assets/icons/ChevronDown.svg?react';

const FilterButton = ({ label }) => (
  <button className="bg-white px-3.5 py-1.5 rounded-full shadow-sm text-xs text-gray-600 border border-gray-200 flex items-center gap-1">
    {label} <ChevronDown size={8} />
  </button>
);

const FilterButtons = () => {
  const filters = ['업종', '국적', '카테고리'];

  return (
    <div className="flex gap-1 mb-4">
      {filters.map((filter) => (
        <FilterButton key={filter} label={filter} />
      ))}
    </div>
  );
};

export default FilterButtons;
