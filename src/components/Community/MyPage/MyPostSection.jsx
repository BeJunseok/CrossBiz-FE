import PostItem from '@/components/Community/PostItem';
import { useTranslation } from 'react-i18next';

const MyPostSection = ({ posts = [] }) => {
  const { t } = useTranslation();
  return (
    <div className="px-8 pb-6">
      <h3 className="text-base font-semibold text-black mb-4">
        {t('community.myPage.myPosts')}
      </h3>

      {/* 게시글 목록 */}
      <div className="flex flex-col mb-10">
        {posts.length > 0 ? (
          posts.map((post) => <PostItem key={post.articleId} post={post} />)
        ) : (
          <div className="bg-white p-8 text-center">
            <p className="text-gray-500 text-sm">
              {t('community.myPage.noPosts')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostSection;
