import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { boundaryData } from '@/data/boundary';
import Search from '@/assets/svg/common/Search0.svg?react';
import ChevronDown from '@/assets/svg/common/ChevronDown.svg?react';

const MapHeader = ({ selectedGrade, onGradeChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm === '') {
      alert('검색어를 입력해주세요.');
      return;
    }

    const foundDistrict = boundaryData.features.find(
      (feature) => feature.properties.adm_nm === trimmedSearchTerm
    );

    if (foundDistrict) {
      const districtId = foundDistrict.properties.adm_cd2;
      navigate(`/analysis/${districtId}`);
    } else {
      alert(`'${trimmedSearchTerm}'에 해당하는 지역을 찾을 수 없습니다.`);
    }
  };

  // 공통 기본 스타일 (
  const baseFilterButtonClass =
    'appearance-none text-xs rounded-full px-2 py-1.5 focus:outline-none whitespace-nowrap text-center ' +
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
        <option value="all">{label}</option>
        {options?.map((opt) => (
          <option key={opt} value={opt.replace('등급', '')}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 cursor-pointer text-gray-500" />
    </div>
  );

  return (
    <header className="bg-white p-4 shadow-md z-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        <h1 className="text-3xl font-bold text-gray-800">상권 리포트</h1>
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder="지역, 건물, 주소 검색"
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
            label="입지 등급"
            options={['1등급', '2등급', '3등급', '4등급', '5등급']}
            className="w-[85px]"
            value={selectedGrade}
            onChange={onGradeChange}
          />
          <Dropdown
            label="업종"
            options={[
              '외식업',
              '소매/유통',
              '서비스업',
              'IT/과학',
              '문화/예술',
              '교육',
              '보건/의료',
              '중개업',
              '기타',
            ]}
            className="w-16"
          />
          <Dropdown
            label="기간"
            options={['최근 1개월', '최근 3개월', '최근 6개월', '최근 1년']}
            className="w-16"
          />
          <button className={`${baseFilterButtonClass} px-3`}>
            주요시설만
          </button>
        </div>
      </div>
    </header>
  );
};

export default MapHeader;
