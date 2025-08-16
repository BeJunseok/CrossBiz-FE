import HotPostItem from './HotPostItem';
import Fire from '@/assets/icons/Fire.svg?react';

const HotPostsSection = ({ hotPosts }) => {
  const displayPosts = hotPosts.slice(0, 3);

  return (
    <div className="px-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          <Fire />
          <h3 className="text-base font-semibold text-black">HOT 글</h3>
        </div>
        <span className="text-xs text-gray-400">더보기</span>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {displayPosts.map((post) => (
          <HotPostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

export default HotPostsSection;
