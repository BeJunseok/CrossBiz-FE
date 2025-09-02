import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { formatDateTime } from '@/utils/dateUtils';
import ChevronLeft from '@/assets/svg/common/ChevronLeft.svg?react';
import Likes from '@/assets/svg/community/LikesFill.svg?react';
import LikesActive from '@/assets/svg/community/LikesFill-active.svg?react';
import Comments from '@/assets/svg/community/CommentsFill.svg?react';
import Menu from '@/assets/svg/community/Menu.svg?react';
import { getCategoryColor } from '@/utils/categoryColor';
import { useClickOutside } from '@/hooks/useClickOutside';
import {
  getPost,
  toggleLike,
  toggleUnlike,
  createComment,
  getComments,
} from '@/api/community/postApi';
import { useAuthStore } from '@/stores/authStore';
import userProfileImage from '@/assets/svg/common/ProfileImage.svg';

const PostDetailPage = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const textareaRef = useRef();
  const nav = useNavigate();
  const { userId, isLoggedIn } = useAuthStore();

  const [postData, setPostData] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useClickOutside(() => setIsDropdownOpen(false));

  // 게시글 데이터 불러오기
  useEffect(() => {
    const loadPostData = async () => {
      if (!id) {
        setError(t('community.postDetail.invalidAccess'));
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);

        // API 호출
        const response = await getPost(parseInt(id));

        const transformedPost = {
          id: response.articleId,
          title: response.name,
          content: response.content,
          author: {
            name: response.authorLoginId,
            profileImage: userProfileImage,
          },
          category: response.businessType,
          createdAt: response.createdAt,
          views: response.view,
          likeCount: response.like,
          commentCount: response.commentCount,
          userId: response.userId,
        };

        setPostData(transformedPost);
        setLikeCount(transformedPost.likeCount);
      } catch (err) {
        console.error('게시글 조회 실패:', err);
        if (err.response?.status === 404) {
          setError(t('community.postDetail.postNotFound'));
        } else if (err.response?.status >= 500) {
          setError(t('community.postDetail.serverError'));
        } else {
          setError(t('community.postDetail.loadFailed'));
        }
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [id, t]);

  // 댓글 데이터 불러오기
  useEffect(() => {
    const loadComments = async () => {
      if (!id) return;
      try {
        const commentsResponse = await getComments(parseInt(id));
        const transformedComments = commentsResponse.map((comment) => ({
          ...comment,
          author: {
            name: comment.authorLoginId,
            profileImage: userProfileImage,
          },
        }));
        setComments(transformedComments);
        setPostData((prev) =>
          prev ? { ...prev, commentCount: transformedComments.length } : prev
        );
      } catch (err) {
        console.error('댓글 조회 실패:', err);
      }
    };
    loadComments();
  }, [id]);

  const handleBack = () => {
    nav('/community');
  };

  const handleComment = () => {
    if (!isLoggedIn) {
      alert(t('community.postDetail.loginRequired'));
      nav('/login');
      return;
    }

    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  const handlePostComment = async () => {
    if (!isLoggedIn) {
      alert(t('community.postDetail.loginRequired'));
      nav('/login');
      return;
    }

    if (!newComment.trim()) {
      alert(t('community.postDetail.enterComment'));
      return;
    }

    try {
      // 댓글 작성 API 호출
      await createComment(postData.id, newComment.trim());

      // 댓글 작성 후 최신 목록 다시 불러오기
      const commentsResponse = await getComments(postData.id);
      const transformedComments = commentsResponse.map((comment) => ({
        ...comment,
        author: {
          name: comment.authorLoginId,
          profileImage: userProfileImage,
        },
      }));

      setComments(transformedComments);
      setPostData((prev) => ({
        ...prev,
        commentCount: transformedComments.length,
      }));
      setNewComment('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert(t('community.postDetail.commentFailed'));
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) {
      alert(t('community.postDetail.loginRequired'));
      nav('/login');
      return;
    }

    try {
      if (isLiked) {
        // 좋아요 취소 API 호출
        await toggleUnlike(postData.id);
        setLikeCount((prev) => prev - 1);
      } else {
        // 좋아요 API 호출
        await toggleLike(postData.id);
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked((prev) => !prev);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert(t('community.postDetail.likeFailed'));
    }
  };

  const handleReport = () => {
    setIsDropdownOpen(false);
    if (!isLoggedIn) {
      alert(t('community.postDetail.loginRequired'));
      nav('/login');
      return;
    }
    alert(t('community.postDetail.reportPreparing'));
  };

  const handleShare = () => {
    setIsDropdownOpen(false);
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        alert(t('community.postDetail.urlCopied'));
      })
      .catch(() => {
        alert(t('community.postDetail.urlCopyFailed'));
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-gray-500">{t('community.postDetail.loading')}</div>
      </div>
    );
  }

  if (error || !postData) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-red-500">
          {error || t('community.postDetail.postNotFound')}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full ">
      {/* 헤더 */}
      <header className="bg-white border-gray-200 px-5 py-4 relative">
        <div className="flex items-center justify-between h-6">
          <button onClick={handleBack}>
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          {/* 더보기 버튼 */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1"
            >
              <Menu className="w-4 h-4 text-gray-600" />
            </button>

            {/* 드롭다운 메뉴 */}
            {isDropdownOpen && (
              <>
                <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 w-52">
                  <button
                    onClick={handleReport}
                    className="w-full px-6 py-3 text-center text-sm font-medium text-[#323232] hover:bg-gray-50 border-b border-gray-200"
                  >
                    {t('community.postDetail.report')}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-full px-6 py-3 text-center text-sm font-medium text-[#323232] hover:bg-gray-50"
                  >
                    {t('community.postDetail.shareUrl')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
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
              <span>
                {t('community.postDetail.views')} {postData.views}
              </span>
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
                {t('community.postDetail.comments')} {postData.commentCount}
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
              <span className="text-xs font-semibold">
                {t('community.postDetail.likes')} {likeCount}
              </span>
            </button>
          </div>
        </div>
      </main>

      {/* 댓글 섹션 */}
      <section className=" px-4 py-6 min-h-[300px]">
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.commentId}
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
            placeholder={
              isLoggedIn
                ? t('community.postDetail.writeCommentPlaceholder')
                : t('community.postDetail.loginToWriteComment')
            }
            className="w-full h-20 p-3 border border-gray-200 rounded-lg resize-none text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
            disabled={!isLoggedIn}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handlePostComment}
              disabled={!isLoggedIn}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {t('community.postDetail.submitComment')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostDetailPage;
