import React from "react";
import HomeIcon from "../../assets/home.svg";
import CardList from "../../components/CardList";
import VisaMore from "./VisaMore";

// 페이지에서 사용할 샘플 데이터
const recommendations = [
  {
    code: "D-8-4 (기술창업비자)",
    highlight: "가장 유력한 후보!",
    reasons: [
      "특허/지식재산권 보유(O) → 가산점 상당",
      "오아시스 점수 1,800점 이상에 딱 맞음",
      "2억 원 준비금 → 최소 투자 요건 충족",
    ],
    warnings: [
      "단순 음식점 운영만으로는 안 되고, ‘기술성·혁신성’ 증빙 필요",
    ],
  },
  {
    code: "D-8-1 (외국인투자기업비자)",
    reasons: [
      "1억 원 이상 투자 가능 (현재 2억 준비)",
      "법인 설립 후 본인의 임원으로 등재",
      "기술 숙련도는 필수 아님",
    ],
    warnings: [
      "개인사업자가 아닌 법인사업자 형태로 전환 필요",
    ],
  },
  {
    code: "D-10-2 (창업 준비비자)",
    reasons: [
      "사업 전 단계에서 한국 체류 가능",
      "이후 D-8-4로 전환 용이",
      "체류기간이 짧고,창업활동 증빙 지속 필요",
    ],
    warnings: [
      "개인사업자가 아닌 법인사업자 형태로 전환 필요",
    ],
  },
];

export default function VisaRecommend({ userName = "Anna", onHome }) {
  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="relative w-full max-w-[360px] px-6 pt-16 pb-24">
        {/* 좌상단 홈 아이콘 */}
        <button
          type="button"
          onClick={onHome}
          className="absolute left-6 top-6 active:scale-[0.98]"
          aria-label="홈으로"
        >
          <img src={HomeIcon} alt="" className="w-6 h-6" />
        </button>

        {/* 타이틀 */}
        <h1 className="text-[25px] font-extrabold text-gray-900 text-center">
          {userName} 님을 위한
          <br />
          최적의 비자
        </h1>

        {/* 카드 리스트 */}
        <div className="mt-16">
          <CardList items={recommendations} />
        </div>
          <div className="mt-12">
          <VisaMore />
        </div>
      </section>
    </main>
  );
}