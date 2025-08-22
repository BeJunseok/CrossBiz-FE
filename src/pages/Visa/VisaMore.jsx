import React from "react";
import {  HiChevronRight } from "react-icons/hi2";
import { FaArrowRight } from "react-icons/fa6";
import RobotHi from "../../assets/RobotHi.svg";

/** 추가 조건 충족 시 가능한 비자 목록 (임시 데이터) */
const extraVisas = [
  {
    code: "F-2-7",
    name: "거주비자",
    requirement: "소득·학력·나이·TOPIK·경력 등 점수 합 80점 이상 필요",
  },
  {
    code: "F-5-22",
    name: "영주비자(창업 우수인재)",
    requirement: "창업 후 매출·고용 실적 충족 필요",
  },
  {
    code: "D-9",
    name: "무역경영",
    requirement: "수출입 실적 등 요건 필요",
  },
  {
    code: "E-7",
    name: "특정활동",
    requirement: "직무 관련 전공·경력 + 한국 고용계약 필요",
  },
];

/** AI 추천 경로 (임시 데이터) */
const aiRoutes = [
  "단기적으로는 D-8-4 신청(특허/오아시스 점수 활용)",
  "사업 성과와 고용 실적을 쌓아 F-2-7 또는 F-5-22로 전환",
  "장기적으로는 영주권(F-5) 또는 귀화까지 고려",
];

export default function VisaMore() {
  return (
    <section className="w-full">
      {/* 제목 */}
      <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900">
        추가적인 조건을 충족하면 가능한 비자 목록이에요.
      </h2>

      {/* 비자 카드들 */}
      <div className="mt-4 grid gap-3">
        {extraVisas.map((v, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white shadow-md px-5 py-4 border border-gray-100"
          >
            <div className="text-[15px] font-semibold text-gray-900 border-b pb-2">
              {v.code} <span className="text-gray-700">({v.name})</span>
            </div>
            <div className="mt-1 text-[13px] leading-relaxed text-gray-600">
              {v.requirement}
            </div>
          </div>
        ))}
      </div>

     {/* AI 추천 경로 박스 (리팩토링) */}
<div className="relative mt-20 overflow-visible">
  {/* 로봇: 카드 뒤로 들어가도록 z-10, 위로 튀어나오게 -top 값 */}
  <img
    src={RobotHi}
    alt=""
    className="absolute z-10 left-3 -top-16 w-[64px] select-none pointer-events-none"
  />

  {/* 카드: 로봇보다 위로 보이도록 z-20 */}
  <div className="relative z-20 rounded-2xl p-5 shadow-xl text-white
                  bg-gradient-to-b from-[#191D24] to-[#4D4C62]">
    <div className="flex items-center text-[16px] sm:text-[17px] font-semibold">
      <span>💡AI 추천 경로</span>
    </div>

    <ul className="mt-3 space-y-2">
      {aiRoutes.map((line, i) => (
        <li key={i} className="flex items-start gap-2">
          <FaArrowRight className="w-3.5 h-3.5 mt-[2px] shrink-0" />
          <span className="text-[11px] leading-relaxed">{line}</span>
        </li>
      ))}
    </ul>
  </div>
</div>
    </section>
  );
}