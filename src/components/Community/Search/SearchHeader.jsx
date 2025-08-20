import ChevronLeft from '@/assets/svg/community/ChevronLeft.svg?react';
import Search from '@/assets/svg/community/Search1.svg?react';

const SearchHeader = ({
  searchTerm,
  onSearchTermChange,
  onBack,
  onSearch,
  onKeyDown,
}) => {
  return (
    <div className="flex items-center p-2.5 h-18">
      <div className="flex items-center gap-2">
        <button onClick={onBack} className="p-2">
          <ChevronLeft className="text-gray-600 w-5 h-5" />
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 w-80 h-10 flex items-center">
          <div className="flex items-center justify-between w-full px-5 py-0">
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchTermChange}
              onKeyDown={onKeyDown}
              placeholder="글 제목, 내용"
              className="text-gray-800 text-sm font-medium flex-1 outline-none border-none bg-transparent leading-10"
              autoFocus
            />
            <button onClick={onSearch} className="rounded-lg">
              <Search className="text-gray-800 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
