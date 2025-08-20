// src/pages/Tax.jsx
import { useState, useEffect, useMemo } from "react";
import { getEventsMap, subscribe } from "../utils/eventStore";
import MonthlyHighlightsCard from "../components/MonthlyHighlightsCard";
import Calendar from "../components/Calendar/Calendar";
import DayDetail from "../components/DayDetail";
import TaxAdvisors from "./TaxAdvisors";

export default function Tax() {
  // ── 상태
  const [savedEventsMap, setSavedEventsMap] = useState(getEventsMap()); // localStorage -> { 'YYYY-MM-DD': [code,...] }
  const [cursor, setCursor] = useState({ y: 2025, m: 8 });              // 0-index 월
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 18));

  // ── eventStore 변경 구독 (구독 즉시 현재값 1회 전달됨)
  useEffect(() => {
    return subscribe(() => setSavedEventsMap(getEventsMap()));
  }, []);

  const YEAR = cursor.y;
  const MONTH = cursor.m;

  // ── 고정 세무 하이라이트(텍스트)
  const taxHighlightGroups = useMemo(() => ([
    {
      day: 11,
      items: [
        "취업 후 학자금 상환(ICL) 원천공제 신고 납부",
        "상환금명세서 신고 간소화 서비스 신청기간",
        "인지세 납부",
        "원천세 신고 납부기한",
      ],
    },
    { day: 25, items: ["개별소비세 과세유흥장소 신고 납부"] },
  ]), []);

  // ── 고정 세무 색상(달력에 표시할 기본 화살표들)
  const fixedTaxDayEvents = useMemo(() => ({
    "2025-09-17": [1, 4],
    "2025-09-08": [4],
  }), []);

  // ── 저장된 이벤트 + 고정 이벤트 머지 (달력에 주입)
  const mergedDayEvents = useMemo(() => {
    const merged = { ...savedEventsMap };
    for (const [k, arr] of Object.entries(fixedTaxDayEvents)) {
      merged[k] = (merged[k] || []).concat(arr);
    }
    return merged;
  }, [savedEventsMap, fixedTaxDayEvents]);

  // ── 날짜별 상세(예시)
  const taxDetailsByDate = useMemo(() => ({
    "2025-09-17": [
      { id: "d1", color: "red",   text: "취업 후 학자금 상환(ICL) 원천공제 신고 납부", cta: "납부" },
      { id: "d2", color: "green", text: "상환금명세서 신고 간소화 서비스 납부",        cta: "납부" },
    ],
  }), []);

  const selectedDetails = useMemo(() => {
    const key = selectedDate.toISOString().slice(0, 10);
    return taxDetailsByDate[key] ?? [];
  }, [selectedDate, taxDetailsByDate]);

  // ── 월 이동
  const prevMonth = () =>
    setCursor(({ y, m }) => {
      const d = new Date(y, m - 1, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  const nextMonth = () =>
    setCursor(({ y, m }) => {
      const d = new Date(y, m + 1, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });

  return (
    <div className="p-4 pb-28 md:pb-40">
      <header className="pt-1">
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-tight text-bold">세금</h1>
      </header>

      <MonthlyHighlightsCard groups={taxHighlightGroups} />

      <Calendar
        year={YEAR}
        month={MONTH}
        dayEvents={mergedDayEvents}   // ← 저장한 화살표 + 고정 화살표 함께 표시
        selected={selectedDate}
        onSelect={setSelectedDate}
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      <DayDetail
        date={selectedDate}
        items={selectedDetails}
        warning="미납된 내역 2건 존재"
      />

      <div className="mt-4">
        <TaxAdvisors />
      </div>
    </div>
  );
}