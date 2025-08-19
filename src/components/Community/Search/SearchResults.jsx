import Search from '@/assets/svg/community/Search1.svg?react';
import SearchResultItem from '@/components/Community/Search/SearchResultItem';

const SearchResults = ({ searchResults, searchTerm, isSearching }) => {
  return (
    <div className="bg-gray-50">
      {/* 검색 결과 개수 */}
      <div className="h-8 overflow-hidden px-6 pt-3 pb-1">
        <div className="text-gray-500 text-xs font-medium">
          {isSearching ? '검색 중...' : `${searchResults.length} 건`}
        </div>
      </div>

      {/* 검색 결과 목록 */}
      {!isSearching && (
        <div className="flex flex-col">
          {searchResults.length > 0 ? (
            searchResults.map((result, index) => (
              <SearchResultItem
                key={result.id}
                result={result}
                searchTerm={searchTerm}
                isHighlighted={index % 2 === 1}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
              <Search className="mb-4 text-gray-300 w-12 h-12" />
              <p className="text-sm">검색 결과가 없습니다.</p>
              <p className="text-xs mt-2">다른 검색어를 입력해보세요!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
