import React from 'react';
import Views from '@/assets/icons/Views.svg?react';
import Comments from '@/assets/icons/Comments.svg?react';
import Saves from '@/assets/icons/Saves.svg?react';
import { getTimeAgo } from '@/lib/dateUtils';

const getCategoryColor = (category) => {
  const colorMap = {
    'Q&A': '#FF6F00',
    Discussion: '#8A38F5',
    Help: '#E06161',
    Tips: '#00C725',
  };
  return colorMap[category] || '#d1d5db';
};

const RecentPostItem = ({ post }) => {
  return (
    <div className="p-4 border-b border-gray-100 last:border-b-0">
      <div className="mb-1.5">
        <span
          style={{ backgroundColor: getCategoryColor(post.category) }}
          className="text-white text-xs px-2 py-0.5 rounded"
        >
          {post.category}
        </span>
      </div>
      <div className="flex gap-2.5 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="min-w-0 max-w-52">
              <p className="text-xs text-black font-medium">{post.author}</p>
              <p className="text-xs text-gray-600 font-semibold truncate">
                {post.title}
              </p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0 ml-2 whitespace-nowrap">
              {getTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-600 leading-relaxed mb-2 line-clamp-3">
        {post.content
          ? post.content.split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < post.content.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))
          : '내용이 없습니다'}
      </p>

      <div className="flex justify-end gap-2 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 flex items-center justify-center">
            <Views />
          </div>
          <span>{post.stats?.views || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 flex items-center justify-center">
            <Comments />
          </div>
          <span>{post.stats?.comments || 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 flex items-center justify-center">
            <Saves />
          </div>
          <span>{post.stats?.shares || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default RecentPostItem;
