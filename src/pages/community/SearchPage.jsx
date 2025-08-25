import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchPosts } from '@/api/community/postApi';
import SearchHeader from '@/components/Community/Search/SearchHeader';
import SearchResults from '@/components/Community/Search/SearchResults';
import RecentSearches from '@/components/Community/Search/RecentSearches';
import { useSearchHistory } from '@/hooks/useSearchHistory';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const nav = useNavigate();

  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearAllSearches,
  } = useSearchHistory();

  const performSearch = useCallback(async (term) => {
    if (!term.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    setSearchResults([]); // 검색 시작 시 이전 결과 초기화

    try {
      const response = await searchPosts(term);

      setSearchResults(response);
    } catch (error) {
      console.error('검색 실패:', error);
      setSearchResults([]); // 에러 발생 시 결과 없음 처리
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const queryParams = searchParams.get('q');
    if (queryParams) {
      setSearchTerm(queryParams);
      performSearch(queryParams);
    } else {
      setSearchTerm('');
      setHasSearched(false);
      setSearchResults([]);
      setIsSearching(false);
    }
  }, [searchParams, performSearch]);

  const handleBack = () => {
    if (hasSearched) {
      setSearchParams({});
    } else {
      nav('/community', { replace: true });
    }
  };

  const handleSearch = () => {
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      addRecentSearch(trimmedTerm);
      setSearchParams({ q: trimmedTerm });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleRecentSearchClick = (searchItem) => {
    setSearchParams({ q: searchItem });
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <SearchHeader
        searchTerm={searchTerm}
        onSearchTermChange={(e) => setSearchTerm(e.target.value)}
        onBack={handleBack}
        onSearch={handleSearch}
        onKeyDown={handleKeyDown}
      />

      {hasSearched ? (
        <SearchResults
          searchResults={searchResults}
          searchTerm={searchParams.get('q') || ''}
          isSearching={isSearching}
        />
      ) : (
        <RecentSearches
          recentSearches={recentSearches}
          onRecentSearchClick={handleRecentSearchClick}
          onRemoveSearch={removeRecentSearch}
          onClearAll={clearAllSearches}
        />
      )}
    </div>
  );
};

export default SearchPage;
