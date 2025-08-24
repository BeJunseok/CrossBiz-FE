// peak 요일, 시간 계산
export const calculatePeakTime = (weeklyData, timeData) => {
  if (!weeklyData || !timeData) return { day: '', time: '' };

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

// 요일별 유동인구
export const formatWeeklyTraffic = (data) => {
  if (!data) return [];
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

// 시간대별 유동인구
export const formatTimeTraffic = (data) => {
  if (!data) return [];
  return [
    { time: '00-06', count: data.pplTime0006 },
    { time: '06-11', count: data.pplTime0611 },
    { time: '11-14', count: data.pplTime1114 },
    { time: '14-17', count: data.pplTime1417 },
    { time: '17-21', count: data.pplTime1721 },
    { time: '21-24', count: data.pplTime2124 },
  ];
};

// 분기별 유동인구
export const formatQuarterlyFootfall = (data) => {
  if (!data) return null;
  const { dong, ...quarters } = data;
  const trend = Object.values(quarters);
  const trendLabels = [
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
  ];
  return { trend, trendLabels };
};
