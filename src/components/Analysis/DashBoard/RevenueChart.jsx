import React from 'react';

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';

const CustomBar = (props) => {
  const { x, y, width, height, payload } = props;
  const { category, salesAmount } = payload;
  const formattedAmount = `${Math.floor(salesAmount / 100000000)}억`;
  const radius = 12; // 모서리 둥글기 값

  if (width < radius * 2 || height < radius * 2) {
    return <rect x={x} y={y} width={width} height={height} fill="#4F46E5" />;
  }

  // SVG path 데이터: 왼쪽은 각지게, 오른쪽은 둥글게
  const pathData = `
    M ${x},${y}
    L ${x + width - radius},${y}
    A ${radius},${radius},0,0,1,${x + width},${y + radius}
    L ${x + width},${y + height - radius}
    A ${radius},${radius},0,0,1,${x + width - radius},${y + height}
    L ${x},${y + height}
    Z
  `;

  return (
    <g>
      <path d={pathData} fill="#4F46E5" />

      <foreignObject x={x} y={y} width={width} height={height}>
        <div
          xmlns="http://www.w3.org/1999/xhtml"
          className="w-full h-full flex items-center justify-between px-3 text-white"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium">{category}</span>
          </div>
          <span className="text-xs font-bold">{formattedAmount}</span>
        </div>
      </foreignObject>
    </g>
  );
};

export default function RevenueChart({ monthlyRevenue }) {
  const chartData = monthlyRevenue.map((item) => ({
    category: item.category,
    salesAmount: item.salesAmount,
  }));

  return (
    <section className="px-4 py-6 mx-4 my-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 text-center mb-6">
        업종별 한달 매출
      </h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 5, left: -60, bottom: 5 }}
          >
            <YAxis
              type="category"
              dataKey="category"
              tickLine={false}
              axisLine={true}
              tick={false}
            />
            <XAxis type="number" hide />

            <Bar dataKey="salesAmount" shape={<CustomBar />} barSize={32}></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
