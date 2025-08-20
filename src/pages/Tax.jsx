// src/pages/Tax.jsx
import { useState, useEffect, useMemo } from "react";
import { getEventsMap, getEventsListMap, subscribe } from "../utils/eventStore";
import Calendar from "../components/Calendar/Calendar";
import DayDetail from "../components/DayDetail";
import TaxAdvisors from "./TaxAdvisors";

const toYMD = (d) =>
  `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;

export default function Tax() {
  // ── 상태
  const [savedEventsMap, setSavedEventsMap] = useState(getEventsMap());     // 캘린더 화살표용
  const [savedListMap,  setSavedListMap]  = useState(getEventsListMap());   // ✅ 리스트용
  const [cursor, setCursor] = useState({ y: 2025, m: 8 });                  // 0-index 월
  const [selectedDate, setSelectedDate] = useState(new Date(2025, 8, 17));

  // ── eventStore 변경 구독 (구독 즉시 현재값 1회 전달됨)
  useEffect(() => {
    return subscribe(() => {
      setSavedEventsMap(getEventsMap());
      setSavedListMap(getEventsListMap());   // ✅ 리스트 맵도 동시 갱신
    });
  }, []);

  const YEAR = cursor.y;
  const MONTH = cursor.m;

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

  // ── (선택) 하드코드 예시 유지 가능
  const taxDetailsByDate = useMemo(() => ({
    "2025-09-16": [
      { id: "d1", color: "red",   text: "취업 후 학자금 상환(ICL) 원천공제 신고 납부", cta: "납부" },
      { id: "d2", color: "green", text: "상환금명세서 신고 간소화 서비스 납부",        cta: "납부" },
    ],
  }), []);

  // ✅ 리스트: 로컬 YYYY-MM-DD 키로 저장목록 + (필요하면) 고정 아이템 결합
  const selectedDetails = useMemo(() => {
    const key = toYMD(selectedDate);           // ❌ UTC slice(0,10) 대신 로컬 키
    const saved = savedListMap[key] ?? [];     // 새로 저장한 일정들
    const fixed = taxDetailsByDate[key] ?? []; // 예시 고정 아이템
    return [...fixed, ...saved];
  }, [selectedDate, savedListMap, taxDetailsByDate]);

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

      <Calendar
        year={YEAR}
        month={MONTH}
        dayEvents={mergedDayEvents}   // 저장 화살표 + 고정 화살표
        selected={selectedDate}
        onSelect={setSelectedDate}
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      <DayDetail
        date={selectedDate}
        items={selectedDetails}       // ✅ 저장된 일정이 바로 내려감
        warning="미납된 내역 2건 존재"
      />

      <div className="mt-4">
        <TaxAdvisors />
      </div>
    </div>
  );
}