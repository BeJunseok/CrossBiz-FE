// src/pages/Visa/VisaHistory.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/* icons */
import HistoryIcon from "../../assets/History.svg";
import ShareIcon from "../../assets/Share.svg";
import NearbyOffices from "../../components/NearbyOffices";

export default function VisaHistory() {
  const nav = useNavigate();
  const location = useLocation();

  // 부모/이전 페이지에서 내려온 분기 (기본: history)
  const from = location.state?.from ?? "history"; // "match" | "history"

  // 데모 카드(상단 요약)
  const userName = "Anna";
  const visaName = "D-8-4";
  const remainDays = 250;
  const expireDate = "2027.06.31";

  // 🔑 from 값에 따른 로컬스토리지 키
  const storageKey = from === "match" ? "visa_history_match" : "visa_history";

  const [history, setHistory] = useState([]);

  // ✅ from이 바뀔 때마다 해당 키에서 읽기
  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setHistory(Array.isArray(list) ? list : []);
    } catch {
      setHistory([]);
    }
  }, [storageKey]);

  // 날짜 내림차순
  const sorted = useMemo(() => {
    const toNum = (d) => Number(String(d || "").replaceAll(".", ""));
    return [...history].sort((a, b) => toNum(b.date) - toNum(a.date));
  }, [history]);

  return (
    <main className="min-h-screen w-full flex justify-center">
      <section className="w-full max-w-[393px] px-6 py-6">
        {/* 최상단 타이틀 */}
        <h1 className="text-[22px] font-semibold text-gray-900">비자</h1>

        {/* 상단 그라데이션 카드 */}
        <div
          className="mt-4 rounded-[24px] w-[352px] h-[274px] text-white 
                     flex flex-col items-center justify-center text-center gap-3"
          style={{ background: "linear-gradient(180deg, #191D24 0%, #4D4C62 100%)" }}
        >
          <p className="text-[24px] font-semibold leading-snug text-[#D0D0D0]">
            {userName} 님의 <span className="text-white">{visaName} 비자</span>가 <br />
            <span className="text-white">{remainDays}</span>일 남았어요.
          </p>
          <p className="text-[17px] font-extrabold opacity-90 text-white">만료일: {expireDate}</p>

          {/* 현재 from을 유지해서 로딩 페이지로 이동 */}
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center 
                       h-[55px] w-[273px] rounded-[999px] 
                       bg:white bg-white text-gray-900 text-[18px] font-semibold shadow-sm"
            onClick={() => nav("/visa-loading", { state: { from } })}
          >
            새 비자 매칭
          </button>
        </div>

        {/* 비자 매칭 히스토리 헤더 */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={HistoryIcon} alt="" className="w-5 h-5" />
            <h2 className="text-[16px] font-semibold text-gray-900">
              비자 매칭 히스토리
              
            </h2>
          </div>
          <button
            type="button"
            className="text-[11px] font-bold text-gray-500 px-1.5 py-0.5 rounded-2xl bg-[#D0D0D0]"
            onClick={() => nav("/history-match", {state: {from}})}
          >
            더보기
          </button>
        </div>

        {/* 히스토리 리스트 카드 */}
        <div className="mt-3 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between bg-[#E8E8E8] px-14 py-2">
            <span className="text-[13px] font-semibold text-gray-600">유형</span>
            <span className="text-[13px] font-semibold text-gray-600">날짜</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {sorted.map((row) => (
              <li key={row.id} className="px-4 py-1">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-gray-900">{row.type}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-700">{row.date}</span>
                    <button
                      type="button"
                      aria-label="공유"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-[#F3F3F3]"
                      onClick={() => nav(`/visa-info?name=${encodeURIComponent(row.type)}`,{state: {from},})}
                    >
                      <img src={ShareIcon} alt="" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {sorted.length === 0 && (
              <li className="px-4 py-3 text-[12px] text-gray-500">저장된 기록이 없습니다.</li>
            )}
          </ul>
        </div>

        {/* 주변 관할기관 */}
        <NearbyOffices />
      </section>
    </main>
  );
}