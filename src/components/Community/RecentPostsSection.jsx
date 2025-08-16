import RecentPostItem from './RecentPostItem';
import FilterButtons from './FilterButton';
import Star from '@/assets/icons/Star.svg?react';

const RecentPostsSection = ({ recentPosts }) => {
  const displayPosts = recentPosts.slice(0, 5);

  return (
    <div className="px-4 mb-20">
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-3">
          <Star />
          <h3 className="text-base font-semibold text-black">최신 글</h3>
        </div>

        <FilterButtons />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {displayPosts.map((post) => (
          <RecentPostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default RecentPostsSection;
