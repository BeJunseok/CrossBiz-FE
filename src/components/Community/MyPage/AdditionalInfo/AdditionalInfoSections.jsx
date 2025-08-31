import { InputField } from '@/components/common/InputField';
import { useTranslation } from 'react-i18next';

// 비자 정보
export const VisaSection = ({
  visaType,
  issueDate,
  expiryDate,
  onVisaTypeChange,
  onIssueDateChange,
  onExpiryDateChange,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <InputField
        label={t('community.additionalInfo.visaTypeLabel')}
        value={visaType}
        onChange={onVisaTypeChange}
      />

      <div className="grid grid-cols-2 gap-8">
        <InputField
          label={t('community.additionalInfo.issueDateLabel')}
          value={issueDate}
          onChange={onIssueDateChange}
          type="date"
        />
        <InputField
          label={t('community.additionalInfo.expiryDateLabel')}
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
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <InputField
        label={t('community.additionalInfo.regNumberLabel')}
        value={businessRegistrationNumber}
        onChange={onBusinessRegistrationNumberChange}
      />
      <InputField
        label={t('community.additionalInfo.annualRevenueLabel')}
        value={annualRevenue}
        onChange={onAnnualRevenueChange}
      />
      <InputField
        label={t('community.additionalInfo.employeeCountLabel')}
        value={employeeCount}
        onChange={onEmployeeCountChange}
      />
    </div>
  );
};
