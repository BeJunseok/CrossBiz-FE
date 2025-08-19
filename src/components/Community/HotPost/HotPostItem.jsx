import { getTimeAgo } from '@/utils/dateUtils';
import Views from '@/assets/svg/community/Views.svg?react';
import Comments from '@/assets/svg/community/Comments.svg?react';
import Likes from '@/assets/svg/community/Likes.svg?react';
import { Link } from 'react-router-dom';

const HotPostItem = ({ post }) => {
  return (
    <Link
      to={`/community/post/${post.id}`}
      className="bg-white border-b border-gray-200 relative w-full cursor-pointer hover:opacity-80 transition-opacity"
    >
      <div className="px-6 py-4">
        <div className="flex flex-col gap-3">
          {/* 작성자 */}
          <div className="text-black text-xs font-medium">{post.author}</div>

          {/* 제목 */}
          <div className="text-black text-sm font-medium">{post.title}</div>

          {/* 내용 */}
          <div className="text-gray-600 text-xs leading-relaxed">
            {post.content}
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Views className="text-gray-500" />
                <span className="text-gray-500 text-xs font-medium">
                  {post.views.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Comments className="text-gray-500" />
                <span className="text-gray-500 text-xs font-medium">
                  {post.comments}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Likes className="text-gray-500 pb-0.5" />
                <span className="text-gray-500 text-xs font-medium">
                  {post.likes}
                </span>
              </div>
            </div>

            {/* 구분선과 날짜 */}
            <div className="flex items-center gap-3">
              <div className="w-px h-2.5 bg-gray-300"></div>
              <span className="text-gray-500 text-xs font-medium">
                {getTimeAgo(post.date)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HotPostItem;
