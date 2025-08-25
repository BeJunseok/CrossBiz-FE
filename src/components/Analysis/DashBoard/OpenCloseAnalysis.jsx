import { useState, useEffect } from 'react'; // React Hooks import
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Export from '@/assets/svg/analysis/Export.svg?react';
import { getNearbyOpenCloseRatio } from '@/api/analysis/AnalysisApi';

export default function OpenCloseAnalysis({ openCloseRate, dong }) {
  const [nearbyData, setNearbyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNearbyData = async () => {
      if (!dong) return;

      setIsLoading(true);
      try {
        const data = await getNearbyOpenCloseRatio(dong);

        const formattedData = Object.entries(data).map(([name, values]) => ({
          name,
          ...values,
        }));

        const newArray = formattedData.splice(1);

        setNearbyData(newArray);
      } catch (error) {
        console.error('Failed to fetch nearby open/close ratio:', error);
        setNearbyData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNearbyData();
  }, [dong]);

  if (!openCloseRate) {
    return <div>Loading...</div>;
  }

  const mainChartData = [
    { name: '폐업률', value: 100 - openCloseRate.openSharePct },
    { name: '개업률', value: openCloseRate.openSharePct },
  ];
  const COLORS = ['#FF4D4F', '#007BFF'];

  return (
    <section className="px-5 py-6 bg-white">
      <h2 className="text-base font-bold text-gray-900 mb-4">
        점포 개<span className="font-normal">·</span>폐업율 (3개년)
      </h2>

      {/* This part for the main chart remains unchanged */}
      <div className="relative flex justify-center items-center my-6">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: COLORS[0] }}
          ></div>
          <span className="text-xs text-gray-600">폐업률</span>
        </div>
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-3xl font-bold text-gray-900">
              {openCloseRate.openSharePct}
            </span>
            <span className="text-lg font-bold text-gray-900">%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: COLORS[1] }}
          ></div>
          <span className="text-xs text-gray-600">개업률</span>
        </div>
      </div>

      {/* --- MODIFIED SECTION --- */}
      {/* This section now uses the state populated by the API call */}
      <div className="border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 text-center mb-6">
          인근 동 비교
        </h3>
        {isLoading ? (
          <div className="text-center text-sm text-gray-500">
            데이터를 불러오는 중입니다...
          </div>
        ) : (
          <div className="flex justify-around">
            {/* Map over the 'nearbyData' state variable */}
            {nearbyData.map((area, index) => (
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
        )}
      </div>
    </section>
  );
}
