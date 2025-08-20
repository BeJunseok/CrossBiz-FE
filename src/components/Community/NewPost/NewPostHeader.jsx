import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svg/community/ChevronLeft.svg?react';

const NewPostHeader = ({ onSubmit, isFormValid }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-white h-16">
      <div className="flex items-center justify-between px-5 py-5">
        <button onClick={handleBack} className="p-1">
          <ChevronLeft className="text-gray-600 w-5 h-5" />
        </button>
        <button
          onClick={onSubmit}
          disabled={!isFormValid}
          className={`text-base font-medium px-1 py-1 ${
            isFormValid
              ? 'text-black hover:text-gray-700'
              : 'text-gray-400 cursor-not-allowed'
          }`}
        >
          등록
        </button>
      </div>
    </div>
  );
};

export default NewPostHeader;
