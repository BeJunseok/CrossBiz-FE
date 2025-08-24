import axiosInstance from '@/lib/axiosInstance';

const handleResponse = (response) => response.data;

export const login = (loginId, password) => {
  return axiosInstance
    .post('/users/auth/login', { loginId, password })
    .then(handleResponse);
};

export const signupBasic = (userData) => {
  return axiosInstance
    .post('/users/signup/basic', userData)
    .then(handleResponse);
};

export const signupDetail = (userData) => {
  return axiosInstance
    .patch('/users/me/signup/detail', userData)
    .then(handleResponse);
};

export const getUserProfile = () => {
  return axiosInstance.get('/users/me').then(handleResponse);
};
