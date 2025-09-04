import Views from '@/assets/svg/community/Views.svg?react';
import Comments from '@/assets/svg/community/Comments.svg?react';
import Likes from '@/assets/svg/community/Likes.svg?react';
import { Link } from 'react-router-dom';

const Stat = ({ icon, value, width = 'w-8' }) => (
  <div className="flex items-center justify-end gap-1.5 text-[10px] text-gray-500">
    <div className="flex-shrink-0">{icon}</div>
    <span className={`inline-block ${width} text-center font-medium`}>
      {value.toLocaleString()}
    </span>
  </div>
);

const HotPostItem = ({ post }) => {
  const postId = post.articleId || post.id;
  const title = post.name || post.title;
  const views =
    post.view || post.views || (post.stats && post.stats.views) || 0;
  const likes =
    post.like || post.likes || (post.stats && post.stats.likes) || 0;
  const comments = post.comments || (post.stats && post.stats.comments) || 0;

  return (
    <Link
      to={`/community/post/${postId}`}
      className="block p-3 border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-center">
        <p className="flex-1 truncate pr-4 text-xs text-gray-600">{title}</p>

        <div className="flex gap-x-2">
          <Stat icon={<Views />} value={views} width="w-4" />
          <Stat icon={<Comments />} value={comments} width="w-3" />
          <Stat icon={<Likes className="mb-0.5" />} value={likes} width="w-3" />
        </div>
      </div>
    </Link>
  );
};

export default HotPostItem;
