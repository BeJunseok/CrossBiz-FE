import Export from '@/assets/icons/Export.svg?react';

const handleClick = (url) => {
  window.location.href = `${url}`;
};

const NewsCard = ({ news }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 w-56 flex-shrink-0">
      <div className="mb-3">
        <p className="text-sm text-black leading-relaxed font-medium mb-3 line-clamp-2">
          {news.title}
        </p>
        <p className="text-xs text-gray-500">{news.date}</p>
        <div className='border-b border-gray-200 mt-2 mb-2'></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="text-xs text-gray-600">{news.source}</div>
        <div
          className="w-6 h-6 bg-black rounded-full flex items-center justify-center"
          onClick={() => {
            handleClick(news.url);
          }}
        >
          <Export />
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
