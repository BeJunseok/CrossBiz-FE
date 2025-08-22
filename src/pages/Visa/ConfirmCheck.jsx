// src/pages/ConfirmMore.jsx (또는 ConfirmCheck.jsx)
import React from "react";

export default function ConfirmCheck({ onEdit, onConfirm }) {
  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">
          아래 정보가 맞나요?
        </h1>

        {/* 고정 박스 (스크롤 제거) */}
        <div
          className="
            mt-6 w-full
            rounded-2xl bg-white
            shadow-[0_6px_24px_rgba(0,0,0,0.08)]
            p-4
          "
        >
          {/* 1. 국적 */}
          <label className="block">
            <span className="block text-[14px] text-gray-600 mb-1">국적</span>
            <input
              type="text"
              className="w-full h-8 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900"
            />
          </label>

          {/* 2. 사업자 정보 */}
          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">사업자 정보</span>
            <input
              type="text"
              className="w-full h-8 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900"
            />
          </label>

          {/* 3. 체류 자격 / 예상 체류 기간 */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">체류 자격</span>
              <input
                type="text"
                className="w-full h-8 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900"
              />
            </label>
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">예상 체류 기간</span>
              <input
                type="text"
                className="w-full h-8 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900"
              />
            </label>
          </div>

          {/* 4. 경력 / 학위 */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">경력</span>
              <input
                type="text"
                className="w-full h-8 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900"
              />
            </label>
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">학위</span>
              <input
                type="text"
                className="w-full h-8 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900"
              />
            </label>
          </div>

          {/* 5. 한국어 능력 */}
          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">한국어 능력</span>
            <input
              type="text"
              className="w-full h-8 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900"
            />
          </label>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="flex-1 h-11 rounded-full border border-gray-300 bg-white text-gray-900 text-[15px] font-semibold active:scale-[0.99]"
          >
            수정하기
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 h-11 rounded-full bg-gray-900 text-white text-[15px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.15)] active:scale-[0.99]"
          >
            확인
          </button>
        </div>
      </section>
    </main>
  );
}