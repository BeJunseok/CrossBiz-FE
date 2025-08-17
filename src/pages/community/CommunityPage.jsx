import mockData from '@/mock/Community.json';
import Header from '@/components/Community/Header';
import NewsSection from '@/components/Community/NewsSection';
import HotPostsSection from '@/components/Community/HotPostsSection';
import RecentPostsSection from '@/components/Community/RecentPostsSection';

const CommunityPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen w-full">
      <Header />

      <NewsSection news={mockData.news} />
      <HotPostsSection hotPosts={mockData.hotPosts} />
      <RecentPostsSection recentPosts={mockData.recentPosts} />
    </div>
  );
};

export default CommunityPage;
