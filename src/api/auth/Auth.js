import axiosInstance from '@/lib/axiosInstance';

export const login = async (loginId, password) => {
  const response = await axiosInstance.post('/users/auth/login', {
    loginId,
    password,
  });
  return response.data;
};

export const signupBasic = async (userData) => {
  const response = await axiosInstance.post('/users/signup/basic', userData);
  return response.data;
};

export const signupDetail = async (userData) => {
  const response = await axiosInstance.patch(
    '/users/me/signup/detail',
    userData
  );
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/users/me');
  return response.data;
};
