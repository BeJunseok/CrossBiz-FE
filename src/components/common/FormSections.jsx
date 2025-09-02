import { InputField } from '@/components/common/InputField';
import { RadioGroup } from '@/components/common/RadioGroup';
import { useTranslation } from 'react-i18next';

// 예정 사업장 형태
export const BusinessTypeSection = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <InputField
      label={t('community.additionalInfo.businessTypeLabel')}
      value={value}
      onChange={onChange}
    />
  );
};

// 특허/지식재사권 보유 여부
export const PatentSection = ({ value, onChange }) => {
  const { t } = useTranslation();
  const patentOptions = [
    { value: 'yes', label: t('community.additionalInfo.patentYes') },
    { value: 'no', label: t('community.additionalInfo.patentNo') },
  ];

  return (
    <RadioGroup
      label={t('community.additionalInfo.patentLabel')}
      name="hasPatent"
      value={value}
      onChange={onChange}
      options={patentOptions}
    />
  );
};

// 영업준비금
export const OperatingFundSection = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <InputField
      label={t('community.additionalInfo.operatingFundLabel')}
      value={value}
      onChange={onChange}
    />
  );
};

// 오아시스 점수
export const OasisScoreSection = ({ value, onChange }) => {
  const {t} = useTranslation();
  return (
    <InputField
      label={t('community.additionalInfo.oasisScoreLabel')}
      value={value}
      onChange={onChange}
    />
  );
};
