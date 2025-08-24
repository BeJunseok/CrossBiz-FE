import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Export from '@/assets/svg/analysis/Export.svg?react';

export default function OpenCloseAnalysis({ openCloseRate }) {
  if (!openCloseRate) {
    return <div>Loading...</div>;
  }

  const mainChartData = [
    { name: '폐업률', value: 100 - openCloseRate.openSharePct },
    { name: '개업률', value: openCloseRate.openSharePct },
  ];
  const COLORS = ['#FF4D4F', '#007BFF']; // 빨강(폐업), 파랑(개업)

  return (
    <section className="px-5 py-6 bg-white">
      <h2 className="text-base font-bold text-gray-900 mb-4">
        점포 개<span className="font-normal">·</span>폐업율 (3개년)
      </h2>

      <div className="relative flex justify-center items-center my-6">
        {/* 범례 - 왼쪽 */}
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: COLORS[0] }}
          ></div>
          <span className="text-xs text-gray-600">폐업률</span>
        </div>

        {/* 도넛 차트 */}
        <div className="w-48 h-48 mx-8 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mainChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {mainChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* 중앙 텍스트 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-gray-900">
              {openCloseRate.openSharePct}
            </span>
            <span className="text-lg font-bold text-gray-900">%</span>
          </div>
        </div>

        {/* 범례 - 오른쪽 */}
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: COLORS[1] }}
          ></div>
          <span className="text-xs text-gray-600">개업률</span>
        </div>
      </div>

      {/* 인근 동 비교 */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
          인근 동 비교
        </h3>
        <div className="flex justify-around">
          {openCloseRate.comparison?.map((area, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-800">
                  {area.name}
                </span>
                <Export className="w-3 h-3 text-gray-400" />
              </div>
              <div className="text-center text-sm space-y-1">
                <p>
                  <span className="text-red-500 mr-2">●</span>{' '}
                  {area.closeSharePct}%
                </p>
                <p>
                  <span className="text-blue-500 mr-2">●</span>{' '}
                  {area.openSharePct}%
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
