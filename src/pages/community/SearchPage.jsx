import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import ChevronLeft from '@/assets/svg/community/ChevronLeft.svg?react';
import Search from '@/assets/svg/community/Search1.svg?react';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  // localStorage 키
  const RECENT_SEARCHES_KEY = 'recentSearches';

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsedSearches = JSON.parse(saved);
        setRecentSearches(parsedSearches);
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      setRecentSearches([]);
    }
  }, []);

  // localStorage에 최근 검색어 저장
  const saveToLocalStorage = (searches) => {
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleSearch = () => {
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);

      // 최근 검색어에 추가
      const newSearch = searchTerm.trim();
      const updatedSearches = [
        newSearch,
        ...recentSearches.filter((item) => item !== newSearch),
      ].slice(0, 10);

      setRecentSearches(updatedSearches);
      saveToLocalStorage(updatedSearches);
      setSearchTerm('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRemoveSearch = (indexToRemove) => {
    const updatedSearches = recentSearches.filter(
      (_, index) => index !== indexToRemove
    );
    setRecentSearches(updatedSearches);
    saveToLocalStorage(updatedSearches);
  };

  const handleClearAll = () => {
    setRecentSearches([]);
    saveToLocalStorage([]);
  };

  const handleRecentSearchClick = (searchItem) => {
    setSearchTerm(searchItem);
    console.log('Searching for:', searchItem);
  };

  return (
    <div className="min-h-screen w-full">
      <div className="flex items-center px-4 py-4 border-b border-gray-100">
        <button onClick={handleBack} className="mr-3">
          <ChevronLeft className="text-gray-600 w-5 h-5" />
        </button>

        <div className="flex-1">
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="글 제목, 내용"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-lg border-none outline-none text-sm placeholder-gray-400"
              autoFocus
            />
          </div>
        </div>
      </div>

      {/* 최근 검색어 섹션 */}
      {recentSearches.length > 0 && (
        <div className="px-4 py-6 bg-white">
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E8E8E8]">
            <h3 className="text-base font-medium text-gray-900">최근 검색어</h3>
            <button
              onClick={handleClearAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              전체삭제
            </button>
          </div>

          <div className="space-y-3">
            {recentSearches.map((searchItem, index) => (
              <div
                key={index}
                className="flex items-center justify-between py-2"
              >
                <button
                  onClick={() => handleRecentSearchClick(searchItem)}
                  className="flex-1 text-left text-gray-700 hover:text-gray-900"
                >
                  {searchItem}
                </button>
                <button
                  onClick={() => handleRemoveSearch(index)}
                  className="ml-3 p-1 hover:bg-gray-100 rounded"
                >
                  <X size={16} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 검색어가 없을 때 */}
      {recentSearches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Search className="mb-4 text-gray-300 w-12 h-12" />
          <p className="text-sm">최근 검색 기록이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
