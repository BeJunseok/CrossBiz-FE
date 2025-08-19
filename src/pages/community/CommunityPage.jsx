import mockData from '@/mock/Community.json';
import Header from '@/components/Community/Header';
import NewsSection from '@/components/Community/NewsSection';
import HotPostsSection from '@/components/Community/HotPostsSection';
import RecentPostsSection from '@/components/Community/RecentPostsSection';
import Write from '@/assets/svg/community/Write.svg?react';
import { useNavigate } from 'react-router-dom';

const WriteButton = () => {
  const nav = useNavigate();

  const handleWriteClick = () => {
    nav('/community/post/new');
  };

  return (
    <button
      onClick={handleWriteClick}
      className="fixed bottom-24 right-10 z-30 flex h-16 w-16 items-center justify-center rounded-full bg-[#654EFF] text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
      style={{
        right: `max(16px, calc(50vw - 393px/2 + 16px))`,
      }}
    >
      <Write />
    </button>
  );
};

const CommunityPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen w-full relative">
      <Header />

      <NewsSection news={mockData.news} />
      <HotPostsSection hotPosts={mockData.hotPosts} />
      <RecentPostsSection recentPosts={mockData.recentPosts} />

      <WriteButton />
    </div>
  );
};

export default CommunityPage;
