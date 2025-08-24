import axiosInstance from '@/lib/axiosInstance';

// 로그인
export const login = async (loginId, password) => {
  const response = await axiosInstance.post('/users/auth/login', {
    loginId,
    password,
  });
  return response.data;
};

// 회원가입
export const signupBasic = async (userData) => {
  const response = await axiosInstance.post('/users/signup/basic', userData);
  return response.data;
};

// 추가정보를 이용한 회원가입
export const signupDetail = async (userData) => {
  const response = await axiosInstance.patch(
    '/users/me/signup/detail',
    userData
  );
  return response.data;
};

// 회원정보 조회
export const getUserProfile = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};

// 회원정보 수정
export const updateUserProfile = async (userData) => {
  const response = await axiosInstance.patch('/users/me', userData);
  return response.data;
};
