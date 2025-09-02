import { useState } from 'react';
import { createPost } from '@/api/community/postApi';

export const useNewPost = (t) => {
  const [formData, setFormData] = useState({
    category: '',
    industry: '',
    title: '',
    content: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼의 모든 필드가 채워졌는지 간단히 확인합니다.
  const isFormValid =
    formData.category &&
    formData.industry &&
    formData.title.trim() &&
    formData.content.trim();

  const submitPost = async () => {
    if (!isFormValid) {
      alert(t('community.newPost.validationError'));
      return false;
    }

    setIsSubmitting(true);

    const apiData = {
      name: formData.title,
      content: formData.content,
      industry: formData.industry,
      businessType: formData.category,
    };

    try {
      await createPost(apiData);
      alert(t('community.newPost.submitSuccess'));
      return true;
    } catch (error) {
      console.error('글 등록 실패:', error);
      const message = error.response?.data?.message || error.message;
      alert(t('community.newPost.submitError', { message }));
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
