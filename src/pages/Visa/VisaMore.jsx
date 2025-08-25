// src/pages/Visa/VisaMore.jsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import RobotHi from "../../assets/RobotHi.svg";

// ✅ JSON import (폴백 데이터)
import visaUser from "../../data/visaUser.json";
import commonUser from "../../data/commonUser.json";

export default function VisaMore() {
  const { state } = useLocation(); // { from?: "match" | "history", raw?: any }
  const from = state?.from ?? "history";

  // 1) 데이터 소스 결정: raw > (match? commonUser : visaUser)
  const sourceJson = useMemo(() => {
    if (state?.raw) return state.raw;
    return from === "match" ? commonUser : visaUser;
  }, [state?.raw, from]);

  // 2) alternativeOptions 추출
  const extraVisas = useMemo(() => {
    return (
      sourceJson?.response?.alternativeOptions ??
      sourceJson?.alternativeOptions ??
      []
    );
  }, [sourceJson]);

  // 3) AI 추천 경로 (필요시 분기 가능)
  const aiRoutes =
    from === "match"
      ? [
          "단기적으로는 무비자/임시 체류에서 점수·자격요건 충족",
          "오아시스/특허 가점 활용해 D-8-4 또는 유사 비자 검토",
          "사업 실적과 고용 창출 후 F-2/F-5로 스텝업",
        ]
      : [
          "단기적으로는 D-8-4 신청(특허/오아시스 점수 활용)",
          "사업 성과와 고용 실적을 쌓아 F-2-7 또는 F-5-22로 전환",
          "장기적으로는 영주권(F-5) 또는 귀화까지 고려",
        ];

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
              {v?.name ?? "미상 비자"}
            </div>
            <div className="mt-1 text-[13px] leading-relaxed text-gray-600">
              {v?.qualification || v?.description || "조건 정보 없음"}
            </div>
          </div>
        ))}
        {extraVisas.length === 0 && (
          <div className="text-[13px] text-gray-500">
            표시할 추가 옵션이 없어요.
          </div>
        )}
      </div>

      {/* AI 추천 경로 박스 */}
      <div className="relative mt-20 overflow-visible">
        <img
          src={RobotHi}
          alt=""
          className="absolute z-10 left-3 -top-16 w-[64px] select-none pointer-events-none"
        />

        <div
          className="relative z-20 rounded-2xl p-5 shadow-xl text-white
                     bg-gradient-to-b from-[#191D24] to-[#4D4C62]"
        >
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