// src/pages/ConfirmMore.jsx
import React from "react";
import IconDown from "../../assets/IconDown.svg"; // 커스텀 드롭다운 아이콘



export default function ConfirmMore({ onPrev, onNext }) {
  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">
          정확한 매칭을 위해
          <br />추가 정보를 입력해주세요.
        </h1>

        {/* 카드 (스크롤 없음) */}
        <div className="mt-6 rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] bg-white p-4">

          {/* ── 사업 방식 (라디오) ── */}
          <div className="mt-1">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-gray-600">사업 방식</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1">
                  <input type="radio" name="biz_type" className="w-3 h-3 accent-gray-900" />
                  <span className="text-[13px] text-gray-900">프랜차이즈</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="biz_type" className="w-3 h-3 accent-gray-900" />
                  <span className="text-[13px] text-gray-900">개인 점포</span>
                </label>
              </div>
            </div>
          </div>

          {/* ── 특허/지식재산권 보유 여부 (라디오) ── */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-gray-600">특허/지식재산권 보유 여부</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1">
                  <input type="radio" name="ip_owned" className="w-3 h-3 accent-gray-900" />
                  <span className="text-[13px] text-gray-900">예</span>
                </label>
                <label className="flex items-center gap-1">
                  <input type="radio" name="ip_owned" className="w-3 h-3 accent-gray-900" />
                  <span className="text-[13px] text-gray-900">아니오</span>
                </label>
              </div>
            </div>
          </div>

          {/* ── 투자금 (input) ── */}
          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">투자금</span>
            <input
              type="text"
              placeholder="1억5천만원"
              className="
                w-full h-11 px-2
                bg-transparent
                border-0 border-b border-gray-200
                focus:border-gray-900 focus:outline-none
                text-[15px] text-gray-900
                placeholder:text-gray-300
              "
            />
          </label>

          {/* ── 오아시스 점수 (input) ── */}
          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">오아시스 점수</span>
            <input
              type="text"
              placeholder="85"
              className="
                w-full h-11 px-2
                bg-transparent
                border-0 border-b border-gray-200
                focus:border-gray-900 focus:outline-none
                text-[15px] text-gray-900
                placeholder:text-gray-300
              "
            />
          </label>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onPrev}
            className="flex-1 h-11 rounded-full border border-gray-300 bg-white text-gray-900 text-[15px] font-semibold active:scale-[0.99]"
          >
            이전
          </button>
          <button
            type="button"
            onClick={onNext}
            className="flex-1 h-11 rounded-full bg-gray-900 text-white text-[15px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.15)] active:scale-[0.99]"
          >
            확인
          </button>
        </div>
      </section>
    </main>
  );
}