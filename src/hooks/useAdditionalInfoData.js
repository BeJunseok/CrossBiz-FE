import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useAdditionalInfoData = () => {
  const { t } = useTranslation();
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
      alert(t('community.additionalInfo.saveSuccess'));
    } catch (error) {
      console.error('저장 실패:', error);
      alert(t('community.additionalInfo.saveError'));
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
