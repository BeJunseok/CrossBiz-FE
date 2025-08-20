import { InputField } from '@/components/common/InputField';
import { RadioGroup } from '@/components/common/RadioGroup';

// 예정 사업장 형태
export const BusinessTypeSection = ({ value, onChange }) => {
  return (
    <InputField label="예정 사업장 형태" value={value} onChange={onChange} />
  );
};

// 특허/지식재사권 보유 여부
export const PatentSection = ({ value, onChange }) => {
  const patentOptions = [
    { value: 'yes', label: '예' },
    { value: 'no', label: '아니오' },
  ];

  return (
    <RadioGroup
      label="특허/지식재산권 보유 여부"
      name="hasPatent"
      value={value}
      onChange={onChange}
      options={patentOptions}
    />
  );
};

// 영업준비금
export const OperatingFundSection = ({ value, onChange }) => {
  return <InputField label="영업준비금" value={value} onChange={onChange} />;
};

// 오아시스 점수
export const OasisScoreSection = ({ value, onChange }) => {
  return (
    <InputField
      label="오아시스 점수 (선택)"
      value={value}
      onChange={onChange}
    />
  );
};
