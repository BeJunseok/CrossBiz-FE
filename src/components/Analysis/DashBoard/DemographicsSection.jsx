import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';


const CustomBarChart = ({ data, dataKey, xAxisKey, tooltipUnit }) => {
  const RoundedBar = (props) => {
    const { fill, x, y, width, height } = props;
    const radius = 8;
    if (width < radius * 2)
      return <rect x={x} y={y} width={width} height={height} fill={fill} />;
    return (
      <path
        d={`M${x},${y + height} L${x},${y + radius} A${radius},${radius},0,0,1,${x + radius},${y} L${x + width - radius},${y} A${radius},${radius},0,0,1,${x + width},${y + radius} L${x + width},${y + height} Z`}
        fill={fill}
      />
    );
  };

  const yAxisFormatter = (value) => {
    if (value === 0) return '0';
    if (value >= 1000) return `${Math.round(value / 1000)}k`;
    return value;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2 bg-white text-gray-700 rounded-md shadow-lg text-xs border">
          <p className="font-bold">{`${label}${tooltipUnit}`}</p>
          <p>{`유동인구: ${payload[0].value.toLocaleString()}명`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
      >
        <XAxis
          dataKey={xAxisKey}
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          dy={5}
        />
        <YAxis
          tickFormatter={yAxisFormatter}
          tick={{ fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: 'rgba(239, 246, 255, 0.5)' }}
          content={<CustomBarTooltip />}
        />
        <Bar dataKey={dataKey} fill="#3B82F6" shape={<RoundedBar />} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const CustomAgeTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-2 w-24 h-12 bg-white text-gray-700 rounded-md shadow-lg text-xs border text-center">
        <p>{payload[0].name}</p>
        <p className="font-bold">{`${payload[0].value}%`}</p>
      </div>
    );
  }
  return null;
};


export default function DemographicsSection({
  demographics,
  timeTraffic,
  weeklyTraffic,
  peak,
}) {
 
  if (!demographics || !timeTraffic || !weeklyTraffic || !peak) {
    return <div>Loading charts...</div>;
  }

  // Pie/Doughnut Chart 데이터 가공
  const ageData = [
    { name: '10대', value: demographics.age.pplAge10 },
    { name: '20대', value: demographics.age.pplAge20 },
    { name: '30대', value: demographics.age.pplAge30 },
    { name: '40대', value: demographics.age.pplAge40 },
    {
      name: '50대 이상',
      value: demographics.age.pplAge50 + demographics.age.pplAge60,
    },
  ];

  const AGE_COLORS = ['#3B82F6', '#EF4444', '#FFB95A', '#84CC16', '#22C55E'];

  const genderData = [
    { name: '남성', value: demographics.gender.male },
    { name: '여성', value: demographics.gender.female },
  ];
  const GENDER_COLORS = ['#3B82F6', '#FF4778'];

  return (
    <section className="px-4 py-6 mx-4 my-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* 시간대별, 요일별 유동인구 (막대그래프) */}
      <div className="grid grid-cols-2 gap-x-8">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 text-center mb-4">
            시간대별 유동인구
          </h3>
          <div className="h-40">
            <CustomBarChart
              data={timeTraffic}
              dataKey="count"
              xAxisKey="time"
              tooltipUnit="시"
            />
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 text-center mb-4">
            요일별 유동인구
          </h3>
          <div className="h-40">
            <CustomBarChart
              data={weeklyTraffic}
              dataKey="count"
              xAxisKey="day"
              tooltipUnit="요일"
            />
          </div>
        </div>
      </div>
      <div className="text-sm text-center text-gray-900 mt-6">
        <span className="text-gray-600">유동인구가 가장 많은 시간대는</span>
        <br />
        <span className="font-bold text-blue-600">
          {peak.day} {peak.time}
        </span>
        <span className="text-gray-600"> 입니다.</span>
      </div>

      {/* 유동인구 유형 (파이/도넛 차트) */}
      <h2 className="text-sm font-semibold text-gray-900 text-center my-6 pt-6 border-t">
        유동인구 유형
      </h2>
      <div className="flex justify-center items-center gap-10">
        <div className="flex items-center ">
          <div className="w-28 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<CustomAgeTooltip />} />
                <Pie
                  data={ageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={55}
                  dataKey="value"
                >
                  {ageData.map((entry, index) => (
                    <Cell
                      key={`cell-age-${index}`}
                      fill={AGE_COLORS[index % AGE_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2">
            {ageData.map((entry, index) => (
              <div
                key={`legend-age-${index}`}
                className="flex items-center gap-1"
              >
                <span className="text-[8px] text-gray-600 w-9 text-right">
                  {entry.name}
                </span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: AGE_COLORS[index % AGE_COLORS.length],
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center mb-5">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">남성</span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: GENDER_COLORS[0] }}
              ></div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">여성</span>
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: GENDER_COLORS[1] }}
              ></div>
            </div>
          </div>
          <div className="flex items-baseline gap-6 mt-1">
            <p
              className="text-xl font-bold"
              style={{ color: GENDER_COLORS[0] }}
            >
              {genderData[0].value}%
            </p>
            <p
              className="text-xl font-bold"
              style={{ color: GENDER_COLORS[1] }}
            >
              {genderData[1].value}%
            </p>
          </div>
          <div className="w-36 h-20 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell
                      key={`cell-gender-${index}`}
                      fill={GENDER_COLORS[index % GENDER_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
