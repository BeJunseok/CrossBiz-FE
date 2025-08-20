import { useState, useEffect } from 'react';

export const useHotPosts = (initialPosts = []) => {
  const [hotPosts, setHotPosts] = useState(initialPosts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHotPosts = async () => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setHotPosts(initialPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPosts.length === 0) {
      fetchHotPosts();
    }
  }, []);

  return {
    hotPosts,
    loading,
    error,
    refetch: fetchHotPosts,
  };
};
