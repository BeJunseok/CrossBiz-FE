import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svg/common/ChevronLeft.svg?react';
import Share from '@/assets/svg/analysis/Share.svg?react';
import Question from '@/assets/svg/analysis/Question.svg?react';
import { StaticMap, useKakaoLoader } from 'react-kakao-maps-sdk';
import { useTranslation } from 'react-i18next';

const GradeIndicator = ({ grade }) => {
  const { t } = useTranslation();
  const getGradeColor = (grade) => {
    switch (grade) {
      case 1:
        return '#00C58A';
      case 2:
        return '#5AB61C';
      case 3:
        return '#D4AF1C';
      case 4:
        return '#FF6600';
      case 5:
        return '#9C1010';
      default:
        return '#6B7280';
    }
  };

  return (
    <div
      className="px-3 py-1.5 rounded-full"
      style={{ backgroundColor: getGradeColor(grade) }}
    >
      <span className="text-white text-sm font-semibold">
        {t('analysis.dashboardHeader.locationGrade', { grade })}
      </span>
    </div>
  );
};

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

export default function DashboardHeader({ locationData, districtCenter }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  const [scriptLoading, scriptError] = useKakaoLoader({
    appkey: KAKAO_API_KEY,
  });

  return (
    <>
      <div className="relative h-44 w-full">
        {scriptLoading || !districtCenter ? (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">
              {t('analysis.dashboardHeader.mapLoading')}
            </p>
          </div>
        ) : (
          <StaticMap
            center={districtCenter}
            level={4}
            mapTypeId={window.kakao.maps.MapTypeId.SKYVIEW}
            style={{ width: '100%', height: '100%' }}
          />
        )}
        <div className="absolute top-0 left-0 w-full p-4 flex items-center justify-between z-10">
          <button
            onClick={() => navigate(-1)}
            className="bg-white bg-opacity-70 p-2 rounded-2xl flex items-center gap-2 shadow-md"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button className="bg-white bg-opacity-70 p-2 rounded-2xl flex items-center gap-2">
            <Share className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* 위치 정보 */}
      <div className="px-5 py-6 bg-white">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-gray-900 mt-1">
            {t('analysis.dashboardHeader.locationPrefix')}{' '}
            {t(`analysis.districts.${locationData.dongI18nKey}`)}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <GradeIndicator grade={locationData.rank} />
          <div className="relative">
            <button
              onClick={() => setShowTooltip(!showTooltip)}
              className="p-1"
            >
              <Question className="w-4 h-4 text-gray-400" />
            </button>
            {showTooltip && (
              <div className="absolute -left-10 top-8 bg-white p-3 rounded-lg shadow-lg w-64 text-xs z-10">
                <p className="mb-2">
                  {t('analysis.dashboardHeader.tooltipTitle')}
                </p>
                <p className="mb-2">
                  {t('analysis.dashboardHeader.tooltipBody')}
                </p>
                <ul className="space-y-1">
                  <li>{t('analysis.dashboardHeader.grade1')}</li>
                  <li>{t('analysis.dashboardHeader.grade2')}</li>
                  <li>{t('analysis.dashboardHeader.grade3')}</li>
                  <li>{t('analysis.dashboardHeader.grade4')}</li>
                  <li>{t('analysis.dashboardHeader.grade5')}</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
