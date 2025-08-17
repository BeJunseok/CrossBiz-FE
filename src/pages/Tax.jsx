import { useState } from "react";
import MonthlyHighlightsCard from "../components/MonthlyHighlightsCard";
import Calendar from "../components/Calendar/Calendar";
import DayDetail from "../components/DayDetail";
import TaxAdvisors from "./TaxAdvisors";

export default function Tax() {
  const [cursor, setCursor] = useState({ y: 2025, m: 8 }); // Sep 2025
  const [selected, setSelected] = useState(new Date(2025, 8, 18));
  const YEAR = cursor.y, MONTH = cursor.m;

  const groups = [
    { day: 11, items: [
      "취업 후 학자금 상환(ICL) 원천공제 신고 납부",
      "상환금명세서 신고 간소화 서비스 신청기간",
      "인지세 납부", "원천세 신고 납부기한" ] },
    { day: 25, items: ["개별소비세 과세유흥장소 신고 납부"] },
  ];

  const dayEvents = {
    "2025-09-17": ["red","green"],
    "2025-09-08": ["green"],
  };

  const detailItemsByDate = {
    "2025-09-17": [
      { id: "d1", color: "red",   text: "취업 후 학자금 상환(ICL) 원천공제 신고 납부", cta: "납부" },
      { id: "d2", color: "green", text: "상환금명세서 신고 간소화 서비스 납부",        cta: "납부" },
    ],
  };
  const details = detailItemsByDate[selected.toISOString().slice(0,10)] ?? [];

  const prevMonth = () => { const d = new Date(YEAR, MONTH-1, 1); setCursor({ y:d.getFullYear(), m:d.getMonth() }); };
  const nextMonth = () => { const d = new Date(YEAR, MONTH+1, 1); setCursor({ y:d.getFullYear(), m:d.getMonth() }); };

  return (
    <div className="p-4 pb-28 md:pb-40">
      <header className="pt-1">
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-tight text-bold">세금</h1>
      </header>

      <MonthlyHighlightsCard groups={groups} />

      <Calendar
        year={YEAR}
        month={MONTH}
        dayEvents={dayEvents}
        selected={selected}
        onSelect={setSelected}
        onPrev={prevMonth}
        onNext={nextMonth}
      />

      <DayDetail date={selected} items={details} warning="미납된 내역 2건 존재" />
     <div className="mt-4">
      <TaxAdvisors />
      </div>
    </div>
  );
}