import axiosInstance from "@/lib/axiosInstance";

export const fetchVisaRecommendWith = async (payload)=> {
  const response = await axiosInstance.post('/visa/recommend/with',payload);
  return response.data;
};
