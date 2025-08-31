import X from '@/assets/svg/community/X.svg?react';
import Search from '@/assets/svg/community/Search1.svg?react';
import { useTranslation } from 'react-i18next';

const RecentSearches = ({
  recentSearches,
  onRecentSearchClick,
  onRemoveSearch,
  onClearAll,
}) => {
  const { t } = useTranslation();

  if (recentSearches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <Search className="mb-4 text-gray-300 w-12 h-12" />
        <p className="text-sm">{t('community.search.noRecentSearches')}</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 bg-white">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#E8E8E8]">
        <h3 className="text-base font-medium text-gray-900">
          {t('community.search.recentSearches')}
        </h3>
        <button
          onClick={onClearAll}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          {t('community.search.clearAll')}
        </button>
      </div>

      <div className="space-y-3">
        {recentSearches.map((searchItem, index) => (
          <div key={index} className="flex items-center justify-between py-2">
            <button
              onClick={() => onRecentSearchClick(searchItem)}
              className="flex-1 text-left text-gray-700 hover:text-gray-900"
            >
              {searchItem}
            </button>
            <button
              onClick={() => onRemoveSearch(index)}
              className="ml-3 p-1 hover:bg-gray-100 rounded"
            >
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentSearches;
