import Search from '@/assets/svg/community/Search1.svg?react';
import SearchResultItem from '@/components/Community/Search/SearchResultItem';
import Loading from '@/components/common/Loading';
import { useTranslation } from 'react-i18next';

const SearchResults = ({ searchResults, searchTerm, isSearching }) => {
  const { t } = useTranslation();
  const posts = searchResults?.content || [];
  const totalElements = searchResults?.totalElements || 0;

  const renderContent = () => {
    // 1. isSearching이 true이면 Loading 컴포넌트를 보여줌
    if (isSearching) {
      return (
        <div className="flex justify-center py-20">
          <Loading message={t('community.search.searching')} />
        </div>
      );
    }

    // 2. 검색이 끝났고, 결과가 없으면 "검색 결과 없음" 메시지를 보여줌
    if (posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Search className="mb-4 text-gray-300 w-12 h-12" />
          <p className="text-sm">{t('community.search.noResults')}</p>
          <p className="text-xs mt-2">
            {t('community.search.tryDifferentKeyword')}
          </p>
        </div>
      );
    }

    // 3. 검색이 끝났고, 결과가 있으면 목록을 보여줌
    return (
      <div className="flex flex-col">
        {posts.map((result, index) => (
          <SearchResultItem
            key={result.articleId}
            result={result}
            searchTerm={searchTerm}
            isHighlighted={index % 2 === 1}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-gray-50">
      {/* 검색 결과 개수 */}
      <div className="h-8 overflow-hidden px-6 pt-3 pb-1">
        <div className="text-gray-500 text-xs font-medium">
          {t('community.search.resultsCount', { count: totalElements })}
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default SearchResults;
