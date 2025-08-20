import PostItem from '@/components/Community/PostItem';

const MyPostSection = ({ posts = [] }) => {
  return (
    <div className="px-8 pb-6">
      <h3 className="text-base font-semibold text-black mb-4">내가 쓴 글</h3>

      {/* 게시글 목록 */}
      <div className="flex flex-col mb-10">
        {posts.length > 0 ? (
          posts.map((post) => <PostItem key={post.id} post={post} />)
        ) : (
          <div className="bg-white p-8 text-center">
            <p className="text-gray-500 text-sm">작성한 글이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostSection;
