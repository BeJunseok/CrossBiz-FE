// src/pages/Visa/VisaHistory.jsx
import React from "react";
import HistoryIcon from "../../assets/History.svg";
import ShareIcon from "../../assets/Share.svg";

export default function VisaHistory() {
  const userName = "Anna";
  const visaName = "D-8-4";
  const remainDays = 250;
  const expireDate = "2027.06.31";

  const history = [
    { id: 1, type: "D-8-4 (기술창업)", date: "2022.03.01" },
    { id: 2, type: "D-8-1 (외국인투자기업)", date: "2024.03.01" },
    { id: 3, type: "D-10-2 (창업 준비)", date: "2025.08.16" },
    { id: 4, type: "D-8-4 (기술창업)", date: "2022.03.01" },
  ];

  return (
    <main className="min-h-screen w-full flex justify-center bg-[#f3f3f3]">
      {/* ★ 393 고정, 좌우 padding 제거 */}
      <section className="w-[393px] py-6">
        {/* 타이틀: 살짝만 들여쓰기 원하면 px-4, 완전 0이면 px-0 */}
        <h1 className="px-4 text-[22px] font-semibold text-gray-900">비자</h1>

        {/* 상단 그라데이션 카드: w-full로 393 꽉 */}
        <div
          className="mt-4 rounded-[24px] w-full h-[274px] text-white
                     flex flex-col items-center justify-center text-center gap-3"
          style={{ background: "linear-gradient(180deg,#191D24 0%,#4D4C62 100%)" }}
        >
          <p className="text-[24px] font-semibold leading-snug text-[#D0D0D0]">
            {userName} 님의 <span className="text-white">{visaName} 비자</span>가 <br />
            <span className="text-white">{remainDays}</span>일 남았어요.
          </p>
          <p className="text-[17px] font-extrabold opacity-90 text-white">
            만료일: {expireDate}
          </p>
          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center
                       h-[55px] w-[273px] rounded-[999px]
                       bg-white text-gray-900 text-[18px] font-semibold shadow-sm"
          >
            새 비자 매칭
          </button>
        </div>

        {/* 비자 매칭 히스토리 헤더 */}
        <div className="mt-8  flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={HistoryIcon} alt="" className="w-5 h-5" />
            <h2 className="text-[16px] font-semibold text-gray-900">비자 매칭 히스토리</h2>
          </div>
          <button
            type="button"
            className="text-[11px] font-bold text-gray-500 px-2 py-0.5 rounded-2xl bg-[#D0D0D0]"
          >
            더보기
          </button>
        </div>

        {/* 히스토리 카드: 부모에 overflow 없음, 카드에만 rounded+border */}
        <div className="mt-3 w-[393px] rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          {/* 헤더 행: 좌/우 완전 0 (필요하면 pl-3/pr-3로 살짝 여백 추가 가능) */}
          <div className="flex items-center justify-between bg-[#E8E8E8] py-2 px-0">
            <span className="text-[13px] font-semibold text-gray-600 pl-0">유형</span>
            <span className="text-[13px] font-semibold text-gray-600 pr-0">날짜</span>
          </div>

          {/* 리스트: 양옆 완전 0 */}
          <ul className="divide-y divide-gray-100">
            {history.map((row) => (
              <li key={row.id} className="py-3 px-0">
                <div className="flex items-center justify-between w-full">
                  {/* 좌: 유형 (완전 0) */}
                  <span className="text-[14px] text-gray-900 pl-0">{row.type}</span>

                  {/* 우: 날짜 + share (완전 0) */}
                  <div className="flex items-center gap-2 pr-0">
                    <span className="text-[13px] text-gray-700">{row.date}</span>
                    <button
                      type="button"
                      aria-label="공유"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 hover:bg-gray-50"
                    >
                      <img src={ShareIcon} alt="" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}