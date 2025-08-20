import { useAdditionalInfoData } from '@/hooks/useAdditionalInfoData';
import MyPageHeader from '@/components/community/MyPage/MyPageHeader';
// 공통 섹션들
import {
  BusinessTypeSection,
  PatentSection,
  OperatingFundSection,
  OasisScoreSection,
} from '@/components/common/FormSections';
// 추가정보 전용 섹션들
import {
  VisaSection,
  BusinessInfoSection,
} from '@/components/community/MyPage/AdditionalInfo/AdditionalInfoSections';

const AdditionalInfoPage = () => {
  const { formData, loading, handleFieldChange, handleSave } =
    useAdditionalInfoData();

  const handleRadioChange = (e) => {
    handleFieldChange('hasPatent', e.target.value);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* 헤더 */}
      <MyPageHeader onSave={handleSave} />

      {/* 폼 컨텐츠 */}
      <div className="px-8 py-16">
        <div className="max-w-72 mx-auto space-y-8">
          {/* 예정 사업장 형태 */}
          <BusinessTypeSection
            value={formData.businessType}
            onChange={(e) => handleFieldChange('businessType', e.target.value)}
          />

          {/* 특허/지식재산권 보유 여부 */}
          <PatentSection
            value={formData.hasPatent}
            onChange={handleRadioChange}
          />

          {/* 영업준비금 */}
          <OperatingFundSection
            value={formData.operatingFund}
            onChange={(e) => handleFieldChange('operatingFund', e.target.value)}
          />

          {/* 오아시스 점수 */}
          <OasisScoreSection
            value={formData.oasisScore}
            onChange={(e) => handleFieldChange('oasisScore', e.target.value)}
          />

          {/* 비자 정보 */}
          <VisaSection
            visaType={formData.visaType}
            issueDate={formData.issueDate}
            expiryDate={formData.expiryDate}
            onVisaTypeChange={(e) =>
              handleFieldChange('visaType', e.target.value)
            }
            onIssueDateChange={(e) =>
              handleFieldChange('issueDate', e.target.value)
            }
            onExpiryDateChange={(e) =>
              handleFieldChange('expiryDate', e.target.value)
            }
          />

          {/* 사업 정보 */}
          <BusinessInfoSection
            businessRegistrationNumber={formData.businessRegistrationNumber}
            annualRevenue={formData.annualRevenue}
            employeeCount={formData.employeeCount}
            onBusinessRegistrationNumberChange={(e) =>
              handleFieldChange('businessRegistrationNumber', e.target.value)
            }
            onAnnualRevenueChange={(e) =>
              handleFieldChange('annualRevenue', e.target.value)
            }
            onEmployeeCountChange={(e) =>
              handleFieldChange('employeeCount', e.target.value)
            }
          />
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">저장하는 중...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdditionalInfoPage;
