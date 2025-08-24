import { useState, useEffect } from 'react';
import mockData from '@/mock/Community.json';
import Header from '@/components/Community/Header';
import NewsSection from '@/components/Community/NewsSection';
import HotPostsSection from '@/components/Community/HotPostsSection';
import RecentPostsSection from '@/components/Community/RecentPostsSection';
import Write from '@/assets/svg/community/Write.svg?react';
import { useNavigate } from 'react-router-dom';
import { getHotPosts, getLatestPosts } from '@/api/community/postApi';

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
  const [hotPosts, setHotPosts] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const transformPostData = (apiPost) => ({
    id: apiPost.articleId,
    title: apiPost.name,
    content: apiPost.content,
    author: apiPost.authorLoginId,
    views: apiPost.view,
    likes: apiPost.like,
    comments: apiPost.comments,
    date: apiPost.createdAt,
    createdAt: apiPost.createdAt,
    userId: apiPost.userId,
    stats: {
      views: apiPost.view,
      likes: apiPost.like,
      comments: apiPost.comments,
    },
    // 임시로 카테고리와 국적 정보 추가 (실제로는 API에서 제공되어야 함)
    category: apiPost.category,
    nationality: apiPost.nationality,
    industry: apiPost.businessType,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError('');

        // 인기 게시글 조회
        const hotPostsResponse = await getHotPosts({ page: 0, size: 3 });
        const transformedHotPosts =
          hotPostsResponse.content.map(transformPostData);
        setHotPosts(transformedHotPosts);

        // 최신 게시글 조회
        const recentPostsResponse = await getLatestPosts({ page: 0, size: 5 });
        const transformedRecentPosts =
          recentPostsResponse.content.map(transformPostData);
        setRecentPosts(transformedRecentPosts);
      } catch (error) {
        console.error('게시글 조회 실패:', error);
        setError('게시글을 불러오는 중 오류가 발생했습니다.');

        // 오류 발생 시 목데이터 사용
        setHotPosts(mockData.hotPosts);
        setRecentPosts(mockData.recentPosts);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-600">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen w-full relative">
      <Header />

      {error && (
        <div className="px-4 py-2 bg-yellow-50 border-l-4 border-yellow-400">
          <div className="text-sm text-yellow-700">{error}</div>
        </div>
      )}

      <NewsSection news={mockData.news} />
      <HotPostsSection hotPosts={hotPosts} />
      <RecentPostsSection recentPosts={recentPosts} />

      <WriteButton />
    </div>
  );
};

export default CommunityPage;
