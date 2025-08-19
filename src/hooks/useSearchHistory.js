import { useState, useEffect } from 'react';

export const useSearchHistory = () => {
  const [recentSearches, setRecentSearches] = useState([]);
  const RECENT_SEARCHES_KEY = 'recentSearches';

  useEffect(() => {
    try {
      const saved = localStorage?.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        const parsedSearches = JSON.parse(saved);
        setRecentSearches(parsedSearches);
      }
    } catch (error) {
      console.error('Failed to load recent searches:', error);
      setRecentSearches([]);
    }
  }, []);

  const saveToLocalStorage = (searches) => {
    try {
      localStorage?.setItem(RECENT_SEARCHES_KEY, JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save recent searches:', error);
    }
  };

  const addRecentSearch = (searchTerm) => {
    const newSearch = searchTerm.trim();
    const updatedSearches = [
      newSearch,
      ...recentSearches.filter((item) => item !== newSearch),
    ].slice(0, 10);

    setRecentSearches(updatedSearches);
    saveToLocalStorage(updatedSearches);
  };

  const removeRecentSearch = (indexToRemove) => {
    const updatedSearches = recentSearches.filter(
      (_, index) => index !== indexToRemove
    );
    setRecentSearches(updatedSearches);
    saveToLocalStorage(updatedSearches);
  };

  const clearAllSearches = () => {
    setRecentSearches([]);
    saveToLocalStorage([]);
  };

  return {
    recentSearches,
    addRecentSearch,
    removeRecentSearch,
    clearAllSearches,
  };
};
