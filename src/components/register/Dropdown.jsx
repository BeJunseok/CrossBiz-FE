import clsx from 'clsx';
import { useState, useEffect } from 'react';
import { useClickOutside } from '@/hooks/useClickOutside';
import TriangleDown from '@/assets/svg/register/TriangleDown.svg?react';

const Dropdown = ({ options, value, placeholder, onChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const dropdownRef = useClickOutside(() => {
    setIsOpen(false);
    if (!value) {
      setIsEditing(false);
    }
  });

  const handleSelect = (option) => {
    setIsOpen(false);
    if (option === '기타') {
      setIsEditing(true);
      onChange('');
    } else {
      setIsEditing(false);
      onChange(option);
    }
  };

  useEffect(() => {
    if (value && !options.includes(value)) {
      setIsEditing(true);
    }
  }, [value, options]);

  return (
    <div className="space-y-1.5" ref={dropdownRef}>
      <div className="relative">
        {isEditing ? (
          // 편집 모드일 때 input 렌더링
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="직접 입력해주세요"
            className={clsx(
              'w-full h-12 bg-[#f3f3f3] rounded-xl px-6 py-4 placeholder:text-sm text-black focus:outline-none focus:ring-2 transition-all',
              {
                'border border-red-300 focus:ring-red-300': error,
                'focus:border-blue-500': !error,
              }
            )}
            autoFocus
          />
        ) : (
          // 일반 모드일 때 button 렌더링
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              'w-full h-12 bg-[#f3f3f3] rounded-xl px-6 py-lg  flex items-center justify-between text-left transition-all focus:border-blue-500',
              {
                'border border-red-300': error,
                'border focus:border-blue-500': !error,
              }
            )}
          >
            <span
              className={`text-sm font-medium ${
                value ? 'text-black' : 'text-gray-400'
              }`}
            >
              {value || placeholder}
            </span>
            <TriangleDown
              className={`w-3 h-3 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full h-12 px-6 py-3 text-left text-base hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1 px-4">{error.message}</p>
      )}
    </div>
  );
};

export default Dropdown;
