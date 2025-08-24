import Map from '@/assets/svg/analysis/Map.svg?react';
import Export from '@/assets/svg/analysis/Export.svg?react';

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
      className="mt-1.5 inline-flex items-center px-2.5 py-1 rounded-full"
      style={{ backgroundColor: getGradeColor(grade) }}
    >
      <span className="text-white text-[10px] font-bold ">
        입지 등급: {grade}
      </span>
    </div>
  );
};

export default function NearbyAreas({ topDongByPpl }) {
  if (!topDongByPpl || topDongByPpl.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-6 my-4 bg-white">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        동 자치구 내 유동인구 Top 3
      </h2>
      <div className="space-y-3">
        {topDongByPpl.map((area, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-md shadow-gray-200/50"
          >
            {/* 아이콘, 주소, 등급 */}
            <div className="flex items-center gap-3">
              <Map className="w-10 h-10 text-gray-400" />

              <div>
                <p className="text-xs">서울특별시 마포구 {area.dong}</p>

                <GradeIndicator grade={area.rank} />
              </div>
            </div>

            {/* 유동인구, 링크 */}
            <div className="flex items-center gap-2">
              <div className="text-right">
                <span className="text-lg font-semibold text-blue-600">
                  {area.totalPpl.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">명/일</span>
              </div>
              <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                <Export className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
