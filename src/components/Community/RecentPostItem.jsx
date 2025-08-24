import React from 'react';
import Views from '@/assets/svg/community/Views.svg?react';
import Comments from '@/assets/svg/community/Comments.svg?react';
import Likes from '@/assets/svg/community/Likes.svg?react';
import { getTimeAgo } from '@/utils/dateUtils';
import { getCategoryColor } from '@/utils/categoryColor';
import { useNavigate } from 'react-router-dom';

const RecentPostItem = ({ post }) => {
  const nav = useNavigate();

  const postId = post.articleId || post.id;
  const title = post.name || post.title;
  const content = post.content;
  const author = post.authorLoginId || post.author;
  const views =
    post.view || post.views || (post.stats && post.stats.views) || 0;
  const likes =
    post.like || post.likes || (post.stats && post.stats.likes) || 0;
  const comments = post.comments || (post.stats && post.stats.comments) || 0;
  const createdAt = post.createdAt || post.date;
  const category = post.category || '일반';

  const handlePostClick = () => {
    nav(`/community/post/${postId}`);
  };

  return (
    <div
      onClick={handlePostClick}
      className="p-4 border-b border-gray-100 last:border-b-0 cursor-pointer"
    >
      <div className="mb-1.5">
        <span
          style={{ backgroundColor: getCategoryColor(category) }}
          className="text-white text-xs px-2 py-0.5 rounded"
        >
          {category}
        </span>
      </div>
      <div className="flex gap-2.5 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="min-w-0 max-w-52">
              <p className="text-xs text-black font-medium">{author}</p>
              <p className="text-xs text-gray-600 font-semibold truncate">
                {title}
              </p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2 whitespace-nowrap">
              {getTimeAgo(createdAt)}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-3">
        {content
          ? content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))
          : '내용이 없습니다'}
      </p>

      <div className="flex justify-end gap-2 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 flex items-center justify-center">
            <Views />
          </div>
          <span>{views}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 flex items-center justify-center">
            <Comments />
          </div>
          <span>{comments}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 flex items-center justify-center">
            <Likes className="mb-0.5" />
          </div>
          <span>{likes}</span>
        </div>
      </div>
    </div>
  );
};

export default RecentPostItem;
