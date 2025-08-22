// src/pages/VisaLoading.jsx
import React, { useEffect, useState } from "react";
import Loading from "../../assets/loading.svg";   // 이전에 저장한 로딩 SVG
import Circle from "../../assets/circle.svg";     // 빈 원 아이콘
import Check from "../../assets/check.svg";       // 체크 아이콘

export default function VisaLoading({ userName = "Anna" }) {
  const [step1Done, setStep1Done] = useState(false);
  const [step2Done, setStep2Done] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setStep1Done(true), 2000); // 2초 후 1단계 완료
    const t2 = setTimeout(() => setStep2Done(true), 4000); // 4초 후 2단계 완료
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <main className="min-h-screen w-full flex items-center justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24 text-center">
        {/* 상단 문구 */}
        <h1 className="text-[27px] font-bold text-gray-900 leading-snug">
          {userName} 님에게 딱 맞는
          <br />비자를 찾고 있어요.
        </h1>

        {/* 중앙 로더 */}
        <div className="mt-12 flex items-center justify-center">
          <img
            src={Loading}
            alt="로딩중"
            className="animate-spin"
          />
        </div>

        
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <span className="text-[14px] text-gray-700">사업 계획 정보 분석중</span>
            <img
              src={step1Done ? Check : Circle}
              alt={step1Done ? "완료" : "대기"}
              className={`w-4 h-4 transition-opacity duration-300 ${step1Done ? "opacity-100" : "opacity-70"}`}
            />
          </div>

          {/* 2행 */}
          <div className="flex items-center justify-between py-3">
            <span className="text-[14px] text-gray-700">비자 매칭중</span>
            <img
              src={step2Done ? Check : Circle}
              alt={step2Done ? "완료" : "대기"}
              className={`w-4 h-4 transition-opacity duration-300 ${step2Done ? "opacity-100" : "opacity-70"}`}
            />
          </div>
        
      </section>
    </main>
  );
}