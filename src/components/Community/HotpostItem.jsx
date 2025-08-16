import Views from '@/assets/icons/Views.svg?react';
import Comments from '@/assets/icons/Comments.svg?react';
import Saves from '@/assets/icons/Saves.svg?react';

const HotPostItem = ({ post }) => {
  return (
    <div className="p-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center">
        <p className="text-xs text-gray-600 w-3/4 truncate pr-10">
          {post.title}
        </p>
        <div className="w-1/4 flex justify-end">
          <div className="flex gap-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 flex items-center justify-center">
                <Views />
              </div>
              <span>{post.stats.views.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 flex items-center justify-center">
                <Comments />
              </div>
              <span>{post.stats.comments}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 flex items-center justify-center">
                <Saves />
              </div>
              <span>{post.stats.shares}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotPostItem;
