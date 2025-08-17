import NewsCard from './NewsCard';
import Megaphone from '@/assets/svg/community/Megaphone.svg?react';

const NewsSection = ({ news }) => {
  return (
    <div className="px-4 mb-6">
      <div className="flex items-center gap-1.5 mb-3">
        <Megaphone />
        <h3 className="text-base font-semibold text-black">최신 소식</h3>
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {news.map((newsItem) => (
          <NewsCard key={newsItem.id} news={newsItem} />
        ))}
      </div>
    </div>
  );
};

export default NewsSection;
