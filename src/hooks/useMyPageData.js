import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyPosts } from '@/api/community/postApi';
import { getUserProfile } from '@/api/auth/Auth';
import { useAuthStore } from '@/stores/authStore';

export const useMyPageData = () => {
  const nav = useNavigate();
  const { logout } = useAuthStore();
  const [formData, setFormData] = useState(null); 
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        setLoading(true);
        const [userProfile, postsData] = await Promise.all([
          getUserProfile(),
          getMyPosts({ page: 0, size: 5 }),
        ]);

        setFormData({
          name: userProfile.name || '',
          age: userProfile.age || '',
          nationality: userProfile.nationality || '',
          businessInfo: userProfile.status || '',
          residenceStatus: userProfile.bizCategory || '',
          expectedStayPeriod: userProfile.estimatePeriod || '',
          workExperience: userProfile.workExperience || '',
          education: userProfile.degree || '',
          koreanProficiency: userProfile.koreanLevel || '',
        });

        setMyPosts(postsData.content || []);
      } catch (err) {
        console.error('마이페이지 데이터 로딩 실패:', err);
        setError('데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyPageData();
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // ... (저장 로직)
  };

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return {
    formData,
    myPosts,
    loading,
    error,
    errors, // errors 반환
    handleFieldChange,
    handleSave,
    handleLogout,
  };
};
