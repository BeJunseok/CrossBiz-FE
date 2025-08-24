import axiosInstance from '@/lib/axiosInstance';

// 게시글 작성
export const createPost = async (postData) => {
  const response = await axiosInstance.post('/articles', postData);
  return response.data;
};

// 게시글 목록 조회
export const getPosts = async (params = {}) => {
  const { page = 0, size = 10, hot = false } = params;

  const response = await axiosInstance.get(
    `/articles?page=${page}&size=${size}&hot=${hot}`
  );

  return response.data;
};

// 게시글 단건 조회
export const getPost = async (articleId) => {
  const response = await axiosInstance.get(`/api/articles/${articleId}`);
  return response.data;
};

// 인기 게시글 조회 (좋아요 순)
export const getHotPosts = async (params = {}) => {
  const { page = 0, size = 10 } = params;

  const response = await axiosInstance.get(
    `/articles?page=${page}&size=${size}&hot=true`
  );
  return response.data;
};

// 최신 게시글 조회
export const getLatestPosts = async (params = {}) => {
  const { page = 0, size = 10 } = params;

  const response = await axiosInstance.get(
    `/articles?page=${page}&size=${size}&hot=false`
  );
  return response.data;
};

// 게시글 작성자 확인 헬퍼 함수
export const isPostAuthor = (post, currentUserId) => {
  return post.userId === currentUserId;
};

// 좋아요
export const toggleLike = async (articleId) => {
  const response = await axiosInstance.post(`/api/articles/${articleId}/like`);
  return response.data;
};

// 좋아요 취소
export const toggleUnlike = async (articleId) => {
  const response = await axiosInstance.post(
    `/api/articles/${articleId}/unlike`
  );
  return response.data;
};

// 댓글 작성
export const createComment = async (
  articleId,
  content,
  parentCommentId = null
) => {
  const payload = {
    parentCommentId,
    content,
  };
  const response = await axiosInstance.post(
    `/api/articles/${articleId}/comments`,
    payload
  );
  return response.data;
};

// 댓글 목록 조회
export const getComments = async (articleId) => {
  const response = await axiosInstance.get(
    `/api/articles/${articleId}/comments`
  );
  return response.data;
};

// 검색 결과
export const searchPosts = async (keyword) => {
  const response = await axiosInstance.get(
    `/articles/search?keyword=${keyword}`
  );
  return response.data;
};

// 내가 쓴 글
export const getMyPosts = async (params = {}) => {
  const response = await axiosInstance.get('/articles/me', { params });
  return response.data;
};
