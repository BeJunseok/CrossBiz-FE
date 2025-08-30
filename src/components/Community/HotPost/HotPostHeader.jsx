import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svg/common/ChevronLeft.svg?react';
import { useTranslation } from 'react-i18next';

const HotPostsHeader = () => {
  const { t } = useTranslation();
  const nav = useNavigate();

  const handleBack = () => {
    nav(-1);
  };

  return (
    <div className="bg-white border-b border-gray-300">
      <div className="flex items-center px-6 py-6">
        <button onClick={handleBack} className="p-1">
          <ChevronLeft className="text-gray-600 w-5 h-5" />
        </button>
        <h1 className="text-black text-xl font-semibold flex flex-1 justify-center mr-8">
          {t('community.hotPost.title')}
        </h1>
      </div>
    </div>
  );
};

export default HotPostsHeader;
