import axiosInstance from '@/lib/axiosInstance';

// 업종 분포 (카테고리, 개수)
export const getBusinessDistribution = async (dong) => {
  const response = await axiosInstance.get(`/business/districts/${dong}`);
  return response.data;
};

// 입지 등급
export const getDistrictGrade = async (dong) => {
  const response = await axiosInstance.get(`/business/grade?dong=${dong}`);
  return response.data;
};

// 카테고리별 매출 순위
export const getCategorySalesRanking = async (dong) => {
  // 항상 limit=6으로 호출
  const response = await axiosInstance.get(`/business/dong/${dong}?limit=6`);
  return response.data;
};

// 개폐업률
export const getOpenCloseRatio = async (dong) => {
  const response = await axiosInstance.get(`/business/districts/${dong}/ratio`);
  return response.data;
};

// 상권 유형
export const getCommercialDistrictType = async (dong) => {
  const response = await axiosInstance.get(`/business/districts/${dong}/type`);
  return response.data;
};

// 요일별 유동인구
export const getDailyFootfall = async (dong) => {
  const response = await axiosInstance.get(`/business/people/day?dong=${dong}`);
  return response.data;
};

// 나이별 유동인구
export const getAgeGroupFootfall = async (dong) => {
  const response = await axiosInstance.get(`/business/people/age?dong=${dong}`);
  return response.data;
};

// 성별 유동인구
export const getGenderFootfall = async (dong) => {
  const response = await axiosInstance.get(
    `/business/people/gender?dong=${dong}`
  );
  return response.data;
};

// 시간대별 유동인구
export const getTimeBasedFootfall = async (dong) => {
  const response = await axiosInstance.get(
    `/business/people/time?dong=${dong}`
  );
  return response.data;
};

// 유동인구 많은 동 순서대로
export const getTopNDistrictsByFootfall = async () => {
  const response = await axiosInstance.get('/business/people/topn');
  return response.data;
};

// 분기별 유동인구
export const getQuarterlyFootfall = async (dong) => {
  const response = await axiosInstance.get(
    `/business/people/quarter?dong=${dong}`
  );
  return response.data;
};
