import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svg/common/ChevronLeft.svg?react';
import Share from '@/assets/svg/analysis/Share.svg?react';
import Question from '@/assets/svg/analysis/Question.svg?react';
import { StaticMap, useKakaoLoader } from 'react-kakao-maps-sdk';

const GradeIndicator = ({ grade }) => {
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
        입지 등급: {grade}
      </span>
    </div>
  );
};

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

export default function DashboardHeader({ locationData, districtCenter }) {
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
            <p className="text-gray-500">지도 로딩 중...</p>
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
            서울시 마포구 {locationData.dong}
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
              <div className="absolute left-0 top-8 bg-white p-3 rounded-lg shadow-lg w-64 text-xs z-10">
                <p className="mb-2">
                  [가중치*매출액 + 가중치*유동인구 + 가중치*폐업 안정성 +
                  가중치*개업률]
                </p>
                <p className="mb-2">
                  최종 입지점수를 5등급으로 나눠 등급을 설정했습니다.
                </p>
                <ul className="space-y-1">
                  <li>-1등급 (매우 우수): 80점 이상</li>
                  <li>-2등급 (우수): 65 ~ 79점</li>
                  <li>-3등급 (보통): 50 ~ 64점</li>
                  <li>-4등급 (미흡): 35 ~ 49점</li>
                  <li>-5등급 (열악): 34점 이하</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
