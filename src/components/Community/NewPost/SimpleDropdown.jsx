import { useState } from 'react';
import ChevronDown from '@/assets/svg/common/ChevronDown.svg?react';

const SimpleDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`w-full px-0 py-2 bg-white border-b border-gray-300 text-left flex items-center justify-between focus:outline-none ${
          disabled
            ? 'text-gray-400 cursor-not-allowed'
            : 'hover:border-gray-400'
        }`}
      >
        <span
          className={value ? 'text-black text-base' : 'text-gray-400 text-base'}
        >
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && !disabled && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none first:rounded-t-lg last:rounded-b-lg"
              >
                {option}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SimpleDropdown;
