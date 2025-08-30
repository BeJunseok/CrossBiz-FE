import { Link } from 'react-router-dom';
import HotPostItem from '@/components/Community/HotpostItem';
import Fire from '@/assets/svg/community/Fire.svg?react';
import { useTranslation } from 'react-i18next';

const HotPostsSection = ({ hotPosts }) => {
  const { t } = useTranslation();
  const posts = Array.isArray(hotPosts) ? hotPosts : [];
  const displayPosts = posts.slice(0, 3);

  return (
    <div className="px-4 mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5">
          <Fire />
          <h3 className="text-base font-semibold text-black">
            {t('community.main.hotPosts')}
          </h3>
        </div>
        <Link
          to={`/community/hotpost`}
          className="text-xs text-gray-400 cursor-pointer"
        >
          {t('community.main.more')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        {displayPosts.length > 0 ? (
          displayPosts.map((post) => (
            <HotPostItem key={post.articleId || post.id} post={post} />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500 text-sm">
            {t('community.main.noHotPosts')}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotPostsSection;
