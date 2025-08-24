import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChevronLeft from '@/assets/svg/common/ChevronLeft.svg?react';
import Share from '@/assets/svg/analysis/Share.svg?react';
import Question from '@/assets/svg/analysis/Question.svg?react';

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

export default function DashboardHeader({ locationData }) {
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <header className="bg-gray-100 px-4 py-3 h-44">
        <div className="flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2">
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <button className="bg-white bg-opacity-70 px-3 py-2 rounded-xl flex items-center gap-2">
            <Share className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </header>

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
