import { useState, useEffect } from 'react';
import RecentPostItem from './RecentPostItem';
import FilterButtons from './FilterButton';
import Star from '@/assets/icons/Star.svg?react';

const RecentPostsSection = ({ recentPosts }) => {
  const [filteredPosts, setFilteredPosts] = useState(recentPosts.slice(0, 5));

  // recentPosts가 변경될 때마다 초기값 다시 설정
  useEffect(() => {
    setFilteredPosts(recentPosts.slice(0, 5));
  }, [recentPosts]);

  const handleFilterChange = (filters) => {
    let filtered = recentPosts;

    // 필터가 하나라도 선택되어 있는지 확인
    const hasActiveFilters =
      filters.industry || filters.nationality || filters.category;

    if (hasActiveFilters) {
      // 업종 필터
      if (filters.industry) {
        filtered = filtered.filter(
          (post) => post.industry === filters.industry
        );
      }

      // 국적 필터
      if (filters.nationality) {
        filtered = filtered.filter(
          (post) => post.nationality === filters.nationality
        );
      }

      // 카테고리 필터
      if (filters.category) {
        filtered = filtered.filter(
          (post) => post.category === filters.category
        );
      }
    }

    setFilteredPosts(filtered);
  };

  return (
    <div className="px-4 mb-20">
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-3">
          <Star />
          <h3 className="text-base font-semibold text-black">최신 글</h3>
        </div>

        <FilterButtons onFilterChange={handleFilterChange} />
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <RecentPostItem key={`post-${post.id}`} post={post} />
          ))
        ) : (
          <div
            key="no-results"
            className="p-8 text-center text-gray-500 text-sm"
          >
            선택한 조건에 맞는 게시글이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentPostsSection;
