import { InputField } from '@/components/common/InputField';

// 비자 정보
export const VisaSection = ({
  visaType,
  issueDate,
  expiryDate,
  onVisaTypeChange,
  onIssueDateChange,
  onExpiryDateChange,
}) => {
  return (
    <div className="space-y-8">
      <InputField
        label="발급받은 비자 종류"
        value={visaType}
        onChange={onVisaTypeChange}
      />

      <div className="grid grid-cols-2 gap-8">
        <InputField
          label="발급일"
          value={issueDate}
          onChange={onIssueDateChange}
          type="date"
        />
        <InputField
          label="만료일"
          value={expiryDate}
          onChange={onExpiryDateChange}
          type="date"
        />
      </div>
    </div>
  );
};

// 사업자 정보
export const BusinessInfoSection = ({
  businessRegistrationNumber,
  annualRevenue,
  employeeCount,
  onBusinessRegistrationNumberChange,
  onAnnualRevenueChange,
  onEmployeeCountChange,
}) => {
  return (
    <div className="space-y-8">
      <InputField
        label="사업자등록번호"
        value={businessRegistrationNumber}
        onChange={onBusinessRegistrationNumberChange}
      />
      <InputField
        label="연매출"
        value={annualRevenue}
        onChange={onAnnualRevenueChange}
      />
      <InputField
        label="고용 인원"
        value={employeeCount}
        onChange={onEmployeeCountChange}
      />
    </div>
  );
};
