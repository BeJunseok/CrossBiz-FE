import { useMemo } from "react";

export default function useMonthGrid(year, month) {
  return useMemo(() => {
    const first = new Date(year, month, 1);
    const last  = new Date(year, month + 1, 0);
    const start = (first.getDay() + 6) % 7; // 월(0)~일(6)
    const days  = last.getDate();
    const prevLast = new Date(year, month, 0).getDate();

    const cells = [];
    for (let i=0;i<start;i++) cells.push({ key:`p-${i}`, day: prevLast - start + 1 + i, outside:true, date:null });
    for (let d=1; d<=days; d++) cells.push({ key:`c-${d}`, day:d, outside:false, date:new Date(year,month,d) });
    while (cells.length<35) {
      const next = cells.length - (start + days) + 1;
      cells.push({ key:`n-${next}`, day: next, outside:true, date:null });
    }
    return cells;
  }, [year, month]);
}