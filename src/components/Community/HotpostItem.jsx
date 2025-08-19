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
  return (
    <Link
      to={`/community/post/${post.id}`}
      className="block p-3 border-b border-gray-100 last:border-b-0"
    >
      <div className="flex items-center">
        <p className="flex-1 truncate pr-4 text-xs text-gray-600">
          {post.title}
        </p>

        <div className="flex gap-x-1">
          <Stat icon={<Views />} value={post.stats.views} width="w-7" />
          <Stat icon={<Comments />} value={post.stats.comments} width="w-3" />
          <Stat
            icon={<Likes className="mb-0.5" />}
            value={post.stats.likes}
            width="w-3"
          />
        </div>
      </div>
    </Link>
  );
};

export default HotPostItem;
