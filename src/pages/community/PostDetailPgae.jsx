import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import communityPostData from '@/mock/communityPost.json';
import { formatDateTime } from '@/utils/dateUtils';
import ChevronLeft from '@/assets/svg/community/ChevronLeft.svg?react';
import Likes from '@/assets/svg/community/LikesFill.svg?react';
import LikesActive from '@/assets/svg/community/LikesFill-active.svg?react';
import Comments from '@/assets/svg/community/CommentsFill.svg?react';
import { getCategoryColor } from '@/utils/categoryColor';
import { useRef } from 'react';

const PostDetailPage = () => {
  const { id } = useParams();
  const textareaRef = useRef();
  const nav = useNavigate();

  const [postData, setPostData] = useState(null);
  const [newComment, setNewComment] = useState('');

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPostData = () => {
      try {
        // const post = await fetchPost(id);
        // setPostData(posts

        const posts = communityPostData.post; // 배열
        const post = posts.find((p) => p.id === parseInt(id));

        if (post) {
          setPostData(post);
          setLikeCount(post.likeCount);
          // API 호출시: setIsLiked(post.userHasLiked)
        } else {
          setError('글을 찾을 수 없습니다.');
        }
      } catch (err) {
        console.error('Failed to load post data:', err);
        setError('글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPostData();
    } else {
      setError('잘못된 접근입니다.');
      setLoading(false);
    }
  }, [id]);

  const handleBack = () => {
    nav('/community');
  };

  const handleComment = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handlePostComment = () => {
    if (!newComment.trim()) {
      alert('댓글을 입력해주세요.');
      return;
    }

    const newCommentObj = {
      id: postData.comments.length + 1,
      author: {
        name: '현재 사용자',
        profileImage: '/api/placeholder/40/40',
      },
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
    };

    const updatedPostData = {
      ...postData,
      comments: [...postData.comments, newCommentObj],
      commentCount: postData.commentCount + 1,
    };

    setPostData(updatedPostData);
    setNewComment('');

    // API 호출시: addComment(postData.id, newComment);

    console.log('새 댓글 추가: ', newCommentObj);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-gray-500">로딩중...</div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-red-500">{error || '글을 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full ">
      {/* 헤더 */}
      <header className="bg-white border-gray-200 px-5 py-4">
        <button onClick={handleBack}>
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="px-5 py-4 bg-white rounded-b-3xl">
        {/* 카테고리 */}
        <div className="mb-4">
          <span
            style={{ backgroundColor: getCategoryColor(postData.category) }}
            className="text-white text-xs font-semibold px-2 py-1 rounded"
          >
            {postData.category}
          </span>
        </div>

        {/* 작성자 정보 */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full border border-gray-200 overflow-hidden">
            <img
              src={postData.author.profileImage}
              alt={postData.author.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-black">
              {postData.author.name}
            </h3>
            <div className="flex items-center gap-8 text-sm text-gray-400">
              <span>{formatDateTime(postData.createdAt)}</span>
              <span>조회 {postData.views}</span>
            </div>
          </div>
        </div>

        {/* 글 내용 */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-black mb-4 leading-normal">
            {postData.title}
          </h1>
          <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {postData.content}
          </div>
        </div>

        {/* 액션 버튼들 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex items-center justify-center gap-16">
            <button
              onClick={handleComment}
              className="flex items-center gap-2 text-gray-600 "
            >
              <Comments className="w-5 h-5" />
              <span className="text-xs font-semibold">
                댓글 {postData.commentCount}
              </span>
            </button>
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-[#E06161]' : 'text-gray-600 '}`}
            >
              {isLiked ? (
                <LikesActive className="w-5 h-5 mb-0.5" />
              ) : (
                <Likes className="w-5 h-5 mb-0.5" />
              )}
              <span className="text-xs font-semibold">좋아요 {likeCount}</span>
            </button>
          </div>
        </div>
      </main>

      {/* 댓글 섹션 */}
      <section className=" px-4 py-6 min-h-[300px]">
        <div className="space-y-4">
          {postData.comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-white rounded-2xl shadow-sm p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full border border-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src={comment.author.profileImage}
                    alt={comment.author.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-black">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {formatDateTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 댓글 입력 영역 */}
        <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200">
          <textarea
            ref={textareaRef}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 작성해주세요..."
            className="w-full h-20 p-3 border border-gray-200 rounded-lg resize-none text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handlePostComment}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              댓글 작성
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostDetailPage;
