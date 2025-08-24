import { useState } from 'react';
import { createPost } from '@/api/community/postApi';

export const useNewPost = () => {
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
      alert('모든 필드를 입력해주세요.');
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
      alert('게시글이 성공적으로 등록되었습니다.');
      return true;
    } catch (error) {
      console.error('글 등록 실패:', error);
      alert(
        `글 등록에 실패했습니다: ${error.response?.data?.message || error.message}`
      );
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
