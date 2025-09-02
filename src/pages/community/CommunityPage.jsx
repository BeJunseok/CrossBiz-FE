import { useState, useEffect } from 'react';
import Header from '@/components/Community/Header';
import NewsSection from '@/components/Community/NewsSection';
import HotPostsSection from '@/components/Community/HotPostsSection';
import RecentPostsSection from '@/components/Community/RecentPostsSection';
import Write from '@/assets/svg/community/Write.svg?react';
import { useNavigate } from 'react-router-dom';
import { getHotPosts, getLatestPosts } from '@/api/community/postApi';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
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
    comments: apiPost.commentCount,
    date: apiPost.createdAt,
    createdAt: apiPost.createdAt,
    userId: apiPost.userId,
    stats: {
      views: apiPost.view,
      likes: apiPost.like,
      comments: apiPost.commentCount,
    },
    category: apiPost.businessType,
    nationality: apiPost.authorNationality,
    industry: apiPost.businessType,
  });

  const newsData = t('community.main.news', { returnObjects: true });

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
        setError(t('community.main.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [t]);

  if (loading) {
    return (
      <div className="bg-gray-100 min-h-screen w-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-600">
            {t('community.main.loading')}
          </div>
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

      <NewsSection news={newsData} />
      <HotPostsSection hotPosts={hotPosts} />
      <RecentPostsSection recentPosts={recentPosts} />

      <WriteButton />
    </div>
  );
};

export default CommunityPage;
