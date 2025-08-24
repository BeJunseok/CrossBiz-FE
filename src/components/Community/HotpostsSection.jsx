import { Link } from 'react-router-dom';
import HotPostItem from '@/components/Community/HotpostItem';
import Fire from '@/assets/svg/community/Fire.svg?react';

const HotPostsSection = ({ hotPosts }) => {
  const posts = Array.isArray(hotPosts) ? hotPosts : [];
  const displayPosts = posts.slice(0, 3);

  return (
    <div className="px-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          <Fire />
          <h3 className="text-base font-semibold text-black">HOT 글</h3>
        </div>
        <Link
          to={`/community/hotpost`}
          className="text-xs text-gray-400 cursor-pointer"
        >
          더보기
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {displayPosts.length > 0 ? (
          displayPosts.map((post) => (
            <HotPostItem key={post.articleId || post.id} post={post} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            인기 게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default HotPostsSection;
