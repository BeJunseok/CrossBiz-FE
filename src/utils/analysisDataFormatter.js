// peak 요일, 시간 계산
export const calculatePeakTime = (weeklyData, timeData) => {
  if (!weeklyData || !timeData) return { day: '', time: '' };

  const dayMapping = {
    pplMonday: 'monday',
    pplTuesday: 'tuesday',
    pplWednesday: 'wednesday',
    pplThursday: 'thursday',
    pplFriday: 'friday',
    pplSaturday: 'saturday',
    pplSunday: 'sunday',
  };
  const timeMapping = {
    pplTime0006: 't0006',
    pplTime0611: 't0611',
    pplTime1114: 't1114',
    pplTime1417: 't1417',
    pplTime1721: 't1721',
    pplTime2124: 't2124',
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
    dayKey: dayMapping[peakDayKey] || '',
    timeKey: timeMapping[peakTimeKey] || '',
  };
};

// 요일별 유동인구
export const formatWeeklyTraffic = (data) => {
  if (!data) return [];
  return [
    { day: 'mon', count: data.pplMonday },
    { day: 'tue', count: data.pplTuesday },
    { day: 'wed', count: data.pplWednesday },
    { day: 'thu', count: data.pplThursday },
    { day: 'fri', count: data.pplFriday },
    { day: 'sat', count: data.pplSaturday },
    { day: 'sun', count: data.pplSunday },
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
