import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mockPosts from '@/mock/communitySearch.json';

export const useMyPageData = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    name: 'Anna',
    age: '',
    nationality: '',
    businessInfo: '예비 창업자',
    residenceStatus: '',
    expectedStayPeriod: '',
    workExperience: '',
    education: '',
    koreanProficiency: '',
  });

  const [errors, setErrors] = useState({});
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // API 호출
    setMyPosts(mockPosts);
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log('프로필 저장:', formData);
      //  API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('프로필이 저장되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
      
      console.log('로그아웃');
      nav('/');
    }
  };

  return {
    formData,
    errors,
    myPosts,
    loading,
    handleFieldChange,
    handleSave,
    handleLogout,
  };
};
