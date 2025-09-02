import { useState, useId } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
} from 'recharts';

const ActiveDot = (props) => {
  const { cx, cy } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="white"
      stroke="#3B82F6"
      strokeWidth={2}
    />
  );
};

export default function TrafficAnalysis({ footTraffic }) {
  const { t } = useTranslation();
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredLabel, setHoveredLabel] = useState(null);

  const uniqueId = useId();
  const gradientId = `colorUv_${uniqueId.replace(/:/g, '_')}`;

  const chartData =
    footTraffic?.trendLabels?.map((label, index) => ({
      label: label,
      value: footTraffic.trend[index],
    })) || [];

  return (
    <section className="px-4 py-6 mx-4 my-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 mb-6">
        {t('analysis.trafficAnalysis.title')}
      </h2>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} dy={10} />
            <YAxis hide />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  setHoveredValue(data.value);
                  setHoveredLabel(data.label);
                }
                return null;
              }}
              cursor={{ stroke: '#3B82F6', strokeWidth: 1 }}
            />

            <Area
              type="linear"
              dataKey="value"
              stroke="#3B82F6"
              strokeWidth={2}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={<ActiveDot />}
              onMouseEnter={(data, index) => {
                setHoveredValue(data.value);
                setHoveredLabel(data.label);
              }}
              onMouseLeave={() => {
                setHoveredValue(null);
                setHoveredLabel(null);
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-sm text-center text-gray-900 mt-4">
        {hoveredLabel && hoveredValue ? (
          <>
            <>
              <div>
                <span className="font-bold text-blue-600">{hoveredLabel}</span>
                <span className="text-gray-600">
                  {t('analysis.trafficAnalysis.tooltipTextPart1')}
                </span>
              </div>
              <span className="font-bold text-blue-600">
                {hoveredValue.toLocaleString()}
                {t('analysis.trafficAnalysis.unitPeople')}
              </span>
              <span className="text-gray-600">
                {t('analysis.trafficAnalysis.tooltipTextPart2')}
              </span>
            </>
          </>
        ) : (
          <>
            <div>
              <span className="text-gray-600">
                {t('analysis.trafficAnalysis.defaultTextPart1')}
              </span>
            </div>
            <span className="font-bold text-blue-600">
              000{t('analysis.trafficAnalysis.unitPeople')}
            </span>
            <span className="text-gray-600">
              {t('analysis.trafficAnalysis.defaultTextPart2')}
            </span>
          </>
        )}
      </div>
    </section>
  );
}
