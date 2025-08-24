import React from 'react';

const Loading = ({ message = '로딩 중...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className="relative">
        <div
          className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}
        />
      </div>
      <p className="text-gray-600 text-center">{message}</p>
    </div>
  );
};

export default Loading;
