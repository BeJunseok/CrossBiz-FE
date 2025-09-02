import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { getTextWidth } from '@/utils/textUtils';
import { useTranslation } from 'react-i18next';
import { getDistributionCategoryI18nKey } from '@/utils/industryNameMap';

const CustomTooltip = ({ active, payload }) => {
  const { t } = useTranslation();
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const amountInBillion = Math.floor(data.salesAmount / 100000000);
    const formattedAmount = t('analysis.revenueChart.amountUnit', {
      amount: amountInBillion,
    });

    return (
      <div className="p-2 bg-gray-800 text-white rounded-md shadow-lg text-xs border border-gray-700">
        <p className="font-bold">{data.category}</p>
        <p>{`${t('analysis.revenueChart.tooltipLabel')}: ${formattedAmount}`}</p>
      </div>
    );
  }
  return null;
};

const CustomBar = (props) => {
  const { t } = useTranslation();
  const { x, y, width, height, payload } = props;
  const { category, salesAmount } = payload;
  const amountInBillion = Math.floor(salesAmount / 100000000);
  const formattedAmount = t('analysis.revenueChart.amountUnit', {
    amount: amountInBillion,
  });
  const radius = 12; // 모서리 둥글기 값

  const PADDING = 20;
  const minWidthForFullLabel =
    getTextWidth(category, 12) + getTextWidth(formattedAmount, 12) + PADDING;
  const minWidthForAmountOnly = getTextWidth(formattedAmount, 12) + PADDING;

  // 막대의 실제 너비가 텍스트를 표시하기에 충분한지 확인
  const canFitFullLabel = width >= minWidthForFullLabel;
  const canFitAmountOnly = width >= minWidthForAmountOnly;

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
          className="w-full h-full flex items-center justify-end px-3 text-white"
        >
          {canFitFullLabel ? (
            // 너비가 충분하면: 업종 + 금액 모두 표시
            <>
              <span className="text-xs font-medium mr-auto">{category}</span>
              <span className="text-xs font-bold">{formattedAmount}</span>
            </>
          ) : canFitAmountOnly ? (
            // 너비가 금액만 표시할 수 있으면: 금액만 표시
            <span className="text-xs font-bold">{formattedAmount}</span>
          ) : // 너비가 너무 좁으면: 아무것도 표시하지 않음
          null}
        </div>
      </foreignObject>
    </g>
  );
};

export default function RevenueChart({ monthlyRevenue }) {
  const { t } = useTranslation();

  const chartData = useMemo(
    () =>
      monthlyRevenue.map((item) => {
        const categoryKey = getDistributionCategoryI18nKey(item.category);
        return {
          ...item,
          category: t(
            `analysis.businessDistribution.distributionCategories.${categoryKey}`
          ),
        };
      }),
    [monthlyRevenue, t]
  );

  return (
    <section className="px-4 py-6 mx-4 my-4 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h2 className="text-base font-semibold text-gray-800 text-center mb-6">
        {t('analysis.revenueChart.title')}
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

            <Tooltip
              cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
              content={<CustomTooltip />}
            />

            <Bar dataKey="salesAmount" shape={<CustomBar />} barSize={32}></Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
