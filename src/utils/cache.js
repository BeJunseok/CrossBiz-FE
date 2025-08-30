const CENTERS_CACHE_KEY = 'district_centers';

export const getAllCentersFromCache = () => {
  try {
    const cachedData = localStorage.getItem(CENTERS_CACHE_KEY);
    return cachedData ? JSON.parse(cachedData) : {};
  } catch (e) {
    console.error('캐시를 불러오는 데 실패했습니다:', e);
    return {};
  }
};

export const saveAllCentersToCache = (centers) => {
  try {
    localStorage.setItem(CENTERS_CACHE_KEY, JSON.stringify(centers));
  } catch (e) {
    console.error('캐시 저장에 실패했습니다:', e);
  }
};
