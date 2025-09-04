import HotPostsHeader from '@/components/Community/HotPost/HotPostHeader';
import HotPostsList from '@/components/Community/HotPost/HotPostList';
import { useHotPosts } from '@/hooks/useHotPost';
import { useTranslation } from 'react-i18next';

const HotPostsPage = () => {
  const { t } = useTranslation();
  const { hotPosts, loading, error } = useHotPosts();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">{t('community.hotPost.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">
          {t('community.hotPost.error')} {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <HotPostsHeader />
      {/* hotPosts 객체 전체를 props로 전달합니다. */}
      <HotPostsList posts={hotPosts} />
    </div>
  );
};

export default HotPostsPage;
