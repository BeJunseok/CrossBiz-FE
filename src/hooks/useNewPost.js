import { useState } from 'react';

export const useNewPost = () => {
  const [formData, setFormData] = useState({
    category: '',
    industry: '',
    title: '',
    content: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const errors = [];

    if (!formData.category) {
      errors.push('카테고리를 선택해주세요.');
    }
    if (!formData.industry) {
      errors.push('업종을 선택해주세요.');
    }
    if (!formData.title.trim()) {
      errors.push('제목을 입력해주세요.');
    }
    if (!formData.content.trim()) {
      errors.push('내용을 입력해주세요.');
    }

    return errors;
  };

  const isFormValid =
    formData.category &&
    formData.industry &&
    formData.title.trim() &&
    formData.content.trim();

  const submitPost = async () => {
    const errors = validateForm();

    if (errors.length > 0) {
      alert(errors[0]);
      return false;
    }

    setIsSubmitting(true);

    try {
      // 추후 API 연동
      console.log('글 등록:', formData);

      // 임시 지연
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('글 등록 실패:', error);
      alert('글 등록에 실패했습니다.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isFormValid,
    isSubmitting,
    submitPost,
  };
};
