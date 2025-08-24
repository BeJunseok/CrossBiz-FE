import React, { useEffect, useRef } from 'react';
import ChartJS from 'chart.js/auto';
import Export from '@/assets/svg/analysis/Export.svg?react';


const DoughnutChart = ({ data, colors, cutout = '70%' }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new ChartJS(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderWidth: 0,
            cutout: cutout,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, colors, cutout]);

  return <canvas ref={chartRef}></canvas>;
};


export default function OpenCloseAnalysis({ openCloseRate }) {
  const mainChartData = [
    openCloseRate.closeSharePct, // 빨간색 (폐업률)
    openCloseRate.openSharePct, // 파란색 (개업률)
  ];
  const mainChartColors = ['#FF4D4F', '#007BFF']; // 빨강, 파랑

  return (
    <section className="px-5 py-6 bg-white">
      <h2 className="text-sm font-bold text-gray-900 mb-4">
        점포 개<span className="font-normal">·</span>폐업율 (3개년)
      </h2>

      <div className="relative flex justify-center items-center my-6">
        {/* 범례 - 왼쪽 */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-xs text-gray-600">개업률</span>
        </div>

        {/* 도넛 차트 */}
        <div className="w-48 h-48 mx-6">
          <DoughnutChart
            data={mainChartData}
            colors={mainChartColors}
            cutout="60%"
          />
          {/* 중앙 텍스트 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-2xl font-semibold text-gray-900">
              {openCloseRate.openSharePct}
            </span>
            <span className="text-lg font-bold text-gray-900">%</span>
          </div>
        </div>

        {/* 범례 - 오른쪽 */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-xs text-gray-600">폐업률</span>
        </div>
      </div>

      {/* 인근 동 비교 */}
      <div className="border border-gray-200 rounded-lg p-6 py-2">
        <h3 className="text-sm font-bold text-gray-900 text-center mb-6">
          인근 동 비교
        </h3>
        <div className="flex justify-around mb">
          {openCloseRate.comparison?.map((area, index) => (
            <div key={index} className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-800">
                  {area.name}
                </span>
                <Export className="w-3 h-3 text-gray-400 cursor-pointer" />
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
