// src/pages/Visa/HistoryMatch.jsx
import React from "react";
import LeftIcon from "../../assets/LeftIcon.svg";
import ShareIcon from "../../assets/Share.svg";

export default function HistoryMatch() {
  const history = [
    { id: 1, type: "D-8-4 (기술창업)", date: "2022.03.01" },
    { id: 2, type: "D-8-1 (외국인투자기업)", date: "2024.03.01" },
    { id: 3, type: "D-10-2 (창업 준비)", date: "2025.08.16" },
    { id: 4, type: "D-8-4 (기술창업)", date: "2022.03.01" },
    { id: 5, type: "D-8-4 (기술창업)", date: "2022.03.01" },
  ];

  return (
    <main className="min-h-screen w-full flex justify-center bg-white">
      {/* ★ 393 고정 & 좌우 패딩 제거 */}
      <section className="w-[393px] px-0 py-2">
        {/* 상단 헤더: 여기만 px-4 */}
        <header className="relative h-[75px] border-b border-gray-200 flex items-center justify-center px-4">
          
          <img
            src={LeftIcon}
            alt="뒤로가기"
            className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer"
          />
          
          <h1 className="text-center text-[18px] font-semibold text-gray-900">
            비자 매칭 히스토리
          </h1>
        </header>

        {/* 히스토리 카드: 풀폭(393px), 보더는 ring으로 */}
        <div className="mt-12 w-full bg-white overflow-hidden">
          {/* 카드 헤더 + 하단 보더 */}
          <div className="flex items-center justify-between bg-[#E8E8E8] px-14 py-2">
            <span className="text-[13px] font-semibold text-gray-600">유형</span>
            <span className="text-[13px] font-semibold text-gray-600">날짜</span>
          </div>

          {/* 리스트: 헤더 보더와의 간격은 padding-top으로 */}
        
            <ul className="divide-y divide-gray-100">
              {history.map((row) => (
                <li key={row.id} className="py-3 px-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] text-gray-900">{row.type}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] text-gray-700">{row.date}</span>
                      <button
                        type="button"
                        aria-label="공유"
                        className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-[#F3F3F3] hover:bg-gray-50"
                      >
                        <img src={ShareIcon} alt="" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200"></div>
          </div>
        
      </section>
    </main>
  );
}