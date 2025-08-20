import { useState } from 'react';

export const useAdditionalInfoData = () => {
  const [formData, setFormData] = useState({
    businessType: '',
    hasPatent: '',
    operatingFund: '',
    oasisScore: '',
    visaType: '',
    issueDate: '',
    expiryDate: '',
    businessRegistrationNumber: '',
    annualRevenue: '',
    employeeCount: '',
  });

  const [loading, setLoading] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log('추가 정보 저장:', formData);
      // API 호출
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert('추가 정보가 저장되었습니다.');
    } catch (error) {
      console.error('저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleFieldChange,
    handleSave,
  };
};
