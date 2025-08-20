import { getTimeAgo } from '@/utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const SearchResultItem = ({ result, searchTerm, isHighlighted = false }) => {
  const nav = useNavigate();

  const handleClick = () => {
    nav(`/community/post/${result.id}`);
  };

  const highlightText = (text, term) => {
    if (!term) return text;

    const regex = new RegExp(`(${term})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="font-bold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className={`relative w-full cursor-pointer hover:opacity-80 transition-opacity ${isHighlighted ? 'bg-[#f3f3f3]' : 'bg-white'}`}
      onClick={handleClick}
    >
      <div className="px-6 py-4">
        <div className="flex flex-col">
          <div className="text-black text-xs font-medium mb-1">
            {result.author}
          </div>
          <div className="text-black text-base font-medium mb-2">
            {highlightText(result.title, searchTerm)}
          </div>
          <div className="text-gray-600 text-xs leading-relaxed mb-4">
            {highlightText(result.content, searchTerm)}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
            <span>{getTimeAgo(result.date)}</span>
            <span>조회 {result.views}</span>
            <span>댓글 {result.comments}</span>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
    </div>
  );
};

export default SearchResultItem;
