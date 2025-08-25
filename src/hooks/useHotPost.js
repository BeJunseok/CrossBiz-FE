import { useState, useEffect } from 'react';
import { getHotPosts } from '@/api/community/postApi';

export const useHotPosts = () => {
  const [hotPosts, setHotPosts] = useState(null); // 초기값을 null로 변경
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getHotPosts({ page: 0, size: 5 }); 
      setHotPosts(response);
    } catch (err) {
      console.error('HOT 게시글 로딩 실패:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotPosts();
  }, []);

  return {
    hotPosts,
    loading,
    error,
    refetch: fetchHotPosts,
  };
};
