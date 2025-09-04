import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyPosts } from '@/api/community/postApi';
import { getUserProfile, updateUserProfile } from '@/api/auth/Auth';
import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';

export const useMyPageData = () => {
  const { t } = useTranslation();
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
        setError(t('community.myPage.dataFetchError'));
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
    if (!formData) return;

    setLoading(true);
    try {
      const apiData = {
        name: formData.name,
        age: formData.age,
        nationality: formData.nationality,
        status: formData.businessInfo,
        bizCategory: formData.residenceStatus,
        estimatePeriod: formData.expectedStayPeriod,
        workExperience: formData.workExperience,
        degree: formData.education,
        koreanLevel: formData.koreanProficiency,
      };

      // 빈 값은 보내지 않도록 필터링합니다 (PATCH 요청이므로).
      const filteredData = Object.fromEntries(
        Object.entries(apiData).filter(([_, v]) => v)
      );

      await updateUserProfile(filteredData);

      alert(t('community.myPage.profileSaveSuccess'));
    } catch (err) {
      console.error('저장 실패:', err);
      const message = err.response?.data?.message || err.message;
      alert(t('community.myPage.profileSaveError', { message }));
    } finally {
      setLoading(false);
    }
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
    errors,
    handleFieldChange,
    handleSave,
    handleLogout,
  };
};
