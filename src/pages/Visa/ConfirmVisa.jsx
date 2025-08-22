// src/pages/ConfirmVisa.jsx
import React from "react";

export default function ConfirmVisa({ onPrev, onNext }) {
  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">
          정확한 매칭을 위해
          <br />추가 정보를 입력해주세요.
        </h1>

        {/* 카드 (스크롤 없음) */}
        <div className="mt-6 rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-4">
          {/* 1. 발급받은 비자 종류 */}
          <label className="block">
            <span className="block text-[14px] text-gray-600 mb-1">발급받은 비자 종류</span>
            <input
              type="text"
              placeholder="D-8-1"
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

          {/* 2. 발급일 / 만료일 (한 줄, 2열) */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">발급일</span>
              <input
                type="text" /* date로 쓰면 브라우저 기본 UI가 달라질 수 있어 text로 통일 */
                placeholder="20250129"
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
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">만료일</span>
              <input
                type="text"
                placeholder="20290129"
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

          {/* 3. 사업자등록번호 */}
          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">사업자등록번호</span>
            <input
              type="text"
              placeholder="107-81-76756"
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

          {/* 4. 연매출 */}
          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">연매출</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="5억원 이상"
              className="
                w-full h-11 px-2
                bg-transparent
                border-0 border-b border-gray-200
                focus:border-gray-900 focus:outline-none
                text-[15px] text-gray-900
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
              "
            />
          </label>

          {/* 5. 고용 인원 */}
          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">고용 인원</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="23"
              className="
                w-full h-11 px-2
                bg-transparent
                border-0 border-b border-gray-200
                focus:border-gray-900 focus:outline-none
                text-[15px] text-gray-900
                placeholder:text-gray-300
                [appearance:textfield]
                [&::-webkit-outer-spin-button]:appearance-none
                [&::-webkit-inner-spin-button]:appearance-none
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