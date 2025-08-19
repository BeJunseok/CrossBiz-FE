import { useState, useEffect, useCallback } from 'react'; // useCallback 추가
import { useSearchParams, useNavigate } from 'react-router-dom';
import mockSearchResults from '@/mock/communitySearch.json';
import SearchHeader from '@/components/Community/Search/SearchHeader';
import SearchResults from '@/components/Community/Search/SearchResults';
import RecentSearches from '@/components/Community/Search/RecentSearches';
import { useSearchHistory } from '@/hooks/useSearchHistory';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const nav = useNavigate();

  const {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearAllSearches,
  } = useSearchHistory();

  const performSearch = useCallback(
    (term) => {
      if (!term.trim()) return;

      setIsSearching(true);
      setHasSearched(true);

      setTimeout(() => {
        const currentTerm = searchParams.get('q');
        if (term !== currentTerm) {
          return; // 검색어가 변경되었으면 이전 결과를 무시
        }

        const filteredResults = mockSearchResults.filter(
          (result) =>
            result.title.toLowerCase().includes(term.toLowerCase()) ||
            result.content.toLowerCase().includes(term.toLowerCase())
        );
        setSearchResults(filteredResults);
        setIsSearching(false);
      }, 500);
    },
    [searchParams]
  );

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
