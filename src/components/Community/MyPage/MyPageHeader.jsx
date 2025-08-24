import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svg/common/ChevronLeft.svg?react';

const MyPageHeader = ({ onSave }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white flex items-center justify-between px-5 py-5">
      <button onClick={handleBack} className="p-1">
        <ChevronLeft className="text-gray-600 w-5 h-5" />
      </button>
      <button
        onClick={onSave}
        className="text-base font-medium text-black hover:text-gray-700"
      >
        저장
      </button>
    </div>
  );
};

export default MyPageHeader;
