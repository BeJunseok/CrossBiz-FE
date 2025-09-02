import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { boundaryData } from '@/data/boundary';
import Search from '@/assets/svg/common/Search0.svg?react';
import ChevronDown from '@/assets/svg/common/ChevronDown.svg?react';
import { useTranslation } from 'react-i18next';

const MapHeader = ({ selectedGrade, onGradeChange }) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm === '') {
      alert(t('analysis.mapHeader.searchError'));
      return;
    }

    const foundDistrict = boundaryData.features.find(
      (feature) => feature.properties.adm_nm === trimmedSearchTerm
    );

    if (foundDistrict) {
      const districtId = foundDistrict.properties.adm_cd;
      navigate(`/analysis/${districtId}`);
    } else {
      alert(t('analysis.mapHeader.noResult', { term: trimmedSearchTerm }));
    }
  };

  const gradeOptions = ['all', '1', '2', '3', '4', '5'].map((grade) => ({
    value: grade,
    label:
      grade === 'all'
        ? t('analysis.mapHeader.allGrades')
        : t('analysis.mapHeader.gradeN', { grade }),
  }));

  const industryOptions = useMemo(
    () => [
      { value: 'all', label: t('analysis.mapHeader.allIndustries') },
      ...[
        'restaurant',
        'retail',
        'service',
        'it',
        'culture',
        'education',
        'health',
        'realEstate',
        'other',
      ].map((key) => ({
        value: key,
        label: t(`analysis.mapHeader.industryOptions.${key}`),
      })),
    ],
    [t]
  );

  const periodOptions = useMemo(
    () => [
      { value: 'all', label: t('analysis.mapHeader.allPeriods') },
      ...['1m', '3m', '6m', '1y'].map((key) => ({
        value: key,
        label: t(`analysis.mapHeader.periodOptions.${key}`),
      })),
    ],
    [t]
  );

  // 공통 기본 스타일 (
  const baseFilterButtonClass =
    'appearance-none text-xs rounded-full px-3 py-1.5 focus:outline-none whitespace-nowrap text-left ' +
    'bg-gray-100 text-gray-700 ' +
    'focus:border-2 focus:border-blue-500 focus:font-semibold ';

  // 드롭다운 컴포넌트
  const Dropdown = ({ label, options, value, onChange, className = '' }) => (
    <div className="relative">
      <select
        className={`${baseFilterButtonClass} ${className}`}
        value={value}
        onChange={onChange}
      >
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 cursor-pointer text-gray-500" />
    </div>
  );

  return (
    <header className="bg-white p-4 shadow-md z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-gray-800">
          {t('analysis.mapHeader.title')}
        </h1>
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder={t('analysis.mapHeader.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-4 pr-12 py-3 focus:outline-none bg-gray-100 rounded-lg"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-gray-800"
          >
            <Search className="w-5 h-5" />
          </button>
        </form>

        <div className="flex items-center justify-center space-x-2">
          <Dropdown
            options={gradeOptions}
            className="w-20"
            value={selectedGrade}
            onChange={onGradeChange}
          />
          <Dropdown options={industryOptions} className="w-24" />
          <Dropdown options={periodOptions} className="w-20" />
          <button className={`${baseFilterButtonClass} px-3`}>
            {t('analysis.mapHeader.facilities')}
          </button>
        </div>
      </div>
    </header>
  );
};

export default MapHeader;
