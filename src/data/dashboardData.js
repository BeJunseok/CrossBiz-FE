

// --- API 응답 예시 데이터 ---
const weeklyTrafficResponse = {
  dong: '공덕동',
  pplMonday: 1751048,
  pplTuesday: 845522,
  pplWednesday: 1042894,
  pplThursday: 943370,
  pplFriday: 250355,
  pplSaturday: 743988,
  pplSunday: 1244947,
};

const ageResponse = {
  dong: '연남동',
  pplAge10: 10,
  pplAge20: 26,
  pplAge30: 23,
  pplAge40: 16,
  pplAge50: 12,
  pplAge60: 14,
};

const genderResponse = {
  dong: '공덕동',
  male: 46,
  female: 54,
};

const timeTrafficResponse = {
  dong: '공덕동',
  pplTime0006: 3547702,
  pplTime0611: 2729591,
  pplTime1114: 1492741,
  pplTime1417: 1450245,
  pplTime1721: 2023242,
  pplTime2124: 1678601,
};

const dongPopulationResponse = [
  { totalPpl: 173386, dong: '서교동', rank: 3 },
  { totalPpl: 129221, dong: '공덕동', rank: 4 },
  { totalPpl: 79291, dong: '아현동', rank: 1 },
  { totalPpl: 68885, dong: '망원1동' },
  { totalPpl: 67035, dong: '성산2동' },
  { totalPpl: 6695602, dong: '연남동' },
  { totalPpl: 6638894, dong: '대흥동' },
  { totalPpl: 6077000, dong: '서강동' },
  { totalPpl: 5919302, dong: '성산1동' },
  { totalPpl: 5759684, dong: '망원2동' },
  { totalPpl: 5642605, dong: '용강동' },
  { totalPpl: 5522692, dong: '염리동' },
  { totalPpl: 5213228, dong: '상암동' },
  { totalPpl: 4950213, dong: '신수동' },
  { totalPpl: 4581859, dong: '합정동' },
  { totalPpl: 4181729, dong: '도화동' },
];

// --- 데이터 변환 및 계산 로직 ---

// 요일별/시간대별 데이터에서 피크 타임을 계산하는 함수
const calculatePeakTime = (weeklyData, timeData) => {
  const dayMapping = {
    pplMonday: '월요일',
    pplTuesday: '화요일',
    pplWednesday: '수요일',
    pplThursday: '목요일',
    pplFriday: '금요일',
    pplSaturday: '토요일',
    pplSunday: '일요일',
  };
  const timeMapping = {
    pplTime0006: '00-06시',
    pplTime0611: '06-11시',
    pplTime1114: '11-14시',
    pplTime1417: '14-17시',
    pplTime1721: '17-21시',
    pplTime2124: '21-24시',
  };

  const weeklyCounts = (({ dong, ...rest }) => rest)(weeklyData);
  const timeCounts = (({ dong, ...rest }) => rest)(timeData);

  const peakDayKey = Object.keys(weeklyCounts).reduce((a, b) =>
    weeklyCounts[a] > weeklyCounts[b] ? a : b
  );
  const peakTimeKey = Object.keys(timeCounts).reduce((a, b) =>
    timeCounts[a] > timeCounts[b] ? a : b
  );

  return {
    day: dayMapping[peakDayKey] || '',
    time: timeMapping[peakTimeKey] || '',
  };
};

const formatWeeklyTraffic = (data) => {
  return [
    { day: '월', count: data.pplMonday },
    { day: '화', count: data.pplTuesday },
    { day: '수', count: data.pplWednesday },
    { day: '목', count: data.pplThursday },
    { day: '금', count: data.pplFriday },
    { day: '토', count: data.pplSaturday },
    { day: '일', count: data.pplSunday },
  ];
};

const formatTimeTraffic = (data) => {
  return [
    { time: '00-06', count: data.pplTime0006 },
    { time: '06-11', count: data.pplTime0611 },
    { time: '11-14', count: data.pplTime1114 },
    { time: '14-17', count: data.pplTime1417 },
    { time: '17-21', count: data.pplTime1721 },
    { time: '21-24', count: data.pplTime2124 },
  ];
};

// --- 최종 mockDashboardData 객체 ---

export const mockDashboardData = {
  location: {
    dong: '공덕동',
    type: '복합형 상권',
    rank: 5,
  },
  businessTypes: [
    { category: '외식업', count: 32 },
    { category: '소매·유통', count: 25 },
    { category: '서비스업', count: 18 },
    { category: 'IT·과학', count: 12 },
    { category: '보건·의료', count: 7 },
    { category: '중개업', count: 5 },
  ],
  monthlyRevenue: [
    { category: '외식업', salesAmount: 900000000 },
    { category: '소매·유통', salesAmount: 500000000 },
    { category: '서비스업', salesAmount: 800000000 },
    { category: 'IT·과학', salesAmount: 1200000000 },
    { category: '보건·의료', salesAmount: 700000000 },
    { category: '중개업', salesAmount: 500000000 },
  ],
  openCloseRate: {
    openSharePct: 30,
    closeSharePct: 70,
    comparison: [
      { name: '행운동', openSharePct: 57, closeSharePct: 43 },
      { name: '가나동', openSharePct: 57, closeSharePct: 43 },
    ],
  },
  footTraffic: {
    trend: [
      60000, 75000, 72000, 20000, 35000, 25000, 60000, 85000, 58000, 82000,
      45000, 72000,
    ],
    trendLabels: [
      '22 Q2',
      '22 Q3',
      '22 Q4',
      '23 Q1',
      '23 Q2',
      '23 Q3',
      '23 Q4',
      '24 Q1',
      '24 Q2',
      '24 Q3',
      '24 Q4',
      '25 Q1',
    ],
  },

  peak: calculatePeakTime(weeklyTrafficResponse, timeTrafficResponse),
  demographics: {
    age: ageResponse,
    gender: genderResponse,
  },
  timeTraffic: formatTimeTraffic(timeTrafficResponse),
  weeklyTraffic: formatWeeklyTraffic(weeklyTrafficResponse),
  topDongByPpl: dongPopulationResponse.slice(0, 3),
};
