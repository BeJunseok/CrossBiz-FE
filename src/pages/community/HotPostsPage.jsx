import HotPostsHeader from '@/components/Community/HotPost/HotPostHeader';
import HotPostsList from '@/components/Community/HotPost/HotPostList';
import { useHotPosts } from '@/hooks/useHotPost';
import mockHotPosts from '@/mock/communityHotPost.json';

const HotPostsPage = () => {
  const { hotPosts, loading, error } = useHotPosts(mockHotPosts);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">오류가 발생했습니다: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <HotPostsHeader />
      <HotPostsList posts={hotPosts} maxItems={5} />
    </div>
  );
};

export default HotPostsPage;
