import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPosts } from '@/api/community/postApi';
import { getUserProfile } from '@/api/auth/Auth';
import { useAuthStore } from '@/stores/authStore';

export const useMyPageData = () => {
  const nav = useNavigate();
  const { logout } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    nationality: '',
    businessInfo: '', // API의 bizCategory
    residenceStatus: '', // API의 status
    expectedStayPeriod: '', // API의 estimatePeriod
    workExperience: '',
    education: '', // API의 degree
    koreanProficiency: '', // API의 koreanLevel
  });

  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyPageData = async () => {
      try {
        setLoading(true);
        // 사용자 프로필 정보 API 호출
        const userProfile = await getUserProfile();

        // API 응답을 formData 상태에 매핑
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

        // 전체 게시글을 가져오는 API를 임시로 사용
        const postsData = await getPosts({ page: 0, size: 5 });
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
    setLoading(true);
    try {
      // 추후 백엔드 구현 후 저장 API 호출
      console.log('프로필 저장:', formData);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 임시 지연
      alert('프로필이 저장되었습니다.');
    } catch (err) {
      console.error('저장 실패:', err);
      alert('저장에 실패했습니다.');
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
    handleFieldChange,
    handleSave,
    handleLogout,
  };
};
