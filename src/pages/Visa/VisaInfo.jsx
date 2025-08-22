// src/pages/Visa/VisaInfo.jsx
import React from "react";

import LeftIcon from "../../assets/LeftIcon.svg";
import DownloadIcon from "../../assets/Download.svg";
import CopyIcon from "../../assets/Copy.svg";
import PurposeIcon from "../../assets/Purpose.svg";
import PeopleIcon from "../../assets/People.svg";
import TargetIcon from "../../assets/Target.svg";
import NeedIcon from "../../assets/Need.svg";
import BenefitsIcon from "../../assets/Benefits.svg";
import { useState, useCallback } from "react";
import SaveToast from "../../components/SaveToast";
import SaveSvg from "../../assets/Save.svg";
import URLIcon from "../../assets/URL.svg";
import CancelIcon from "../../assets/Cancel.svg";

const sections = [
  { key: "purpose",  title: "목적",     icon: PurposeIcon,  body: "외국인이 한국에서 기술 기반 창업을 할 수 있도록 허가하는 비자" },
  { key: "people",   title: "대상",     icon: PeopleIcon,   body: "우수한 기술력·지식재산권을 바탕으로 한국에서 창업을 원하는 외국인" },
  { key: "qual",     title: "신청자격", icon: TargetIcon,   list: [
      "국내 정부가 인정하는 특허·지식재산권 보유",
      "창업 오아시스 프로그램 수료 및 점수 충족 (예: 1,800점 이상)",
      "충분한 창업 자본금 증빙 (보통 1억원 이상 권장)",
    ]},
  { key: "need",     title: "필요서류", icon: NeedIcon,     list: [
      "사업계획서 (Business Plan)",
      "법인등기/사업자등록증 사본(등록後 제출 가능)",
      "투자 증빙서류 (자본금, 은행잔고증명 등)",
      "학력·경력 증빙서류",
      "한국어 능력 증명 (TOPIK 등, 선택 가점)",
    ]},
  { key: "benefits", title: "혜택",     icon: BenefitsIcon, body: "정부 지원 창업 프로그램 및 투자 매칭 기회, 이후 거주(F-2)·영주(F-5) 비자로 단계적 전환 가능" },
];

export default function VisaInfo() {
  const [showSave, setShowSave] = useState(false);
  const [showCopyModal, setShowCopyModal] =useState(false);

  const triggerToast = useCallback(()=>setShowSave(true),[]);
  const openCopyModal = useCallback(()=>setShowCopyModal(true),[]);
  const closeCopyModal = useCallback(()=>setShowCopyModal(false),[]);

  

  return (
    <main className="min-h-screen w-full flex justify-center">
    
      <section className="w-full max-w-[393px]">
        <header
  className="relative w-full text-white pt-8 pb-6 px-6"
  style={{ background: "linear-gradient(180deg,#000000 0%,#2B3055 100%)" }}
>
  {/* 좌측 상단 LeftIcon */}
  <img
    src={LeftIcon}
    alt=""
    className="absolute top-6 left-6 w-auto h-5 object-contain cursor-pointer"
  />

  {/* 우측 상단 DownloadIcon + CopyIcon */}
  <div className="absolute top-6 right-6 flex gap-1.5">
    <button
      type="button"
      className="block p-0 m-0"
      onClick={triggerToast}
      aria-label="저장"
    >
    <img
      src={DownloadIcon}
      alt=""
      className="w-auto h-6 block cursor-pointer"
    />
    </button>
    <button
      type="button"
      className="block p-0 m-0"
      onClick={openCopyModal}
      aria-label="복사/공유 옵션"
    >
    <img
      src={CopyIcon}
      alt=""
      className="w-auto h-6 block cursor-pointer"
    />
    </button>
  </div>

  {/* 타이틀 */}
  <div className="mt-12">
    <div className="text-[40px] font-semibold leading-tight">D-8-4</div>
    <div className="mt-1 text-[15px] font-semibold">기술창업비자</div>
    <div className="mt-1 text-[13px] opacity-90">technology start-up visa</div>
  </div>
</header>

        {/* ───── 본문: 하나의 카드, 섹션은 여백으로 구분 ───── */}
        <div className="px-6 py-6">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-md px-5 py-4">
            {sections.map((s, idx) => (
              <div key={s.key} className={idx === 0 ? "" : "mt-6"}>
                <div className="flex items-center gap-2">
                  <img src={s.icon} alt="" className="shrink-0" />
                  <h3 className="text-[15px] font-semibold text-gray-900">{s.title}</h3>
                </div>

                {"body" in s && (
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-700">{s.body}</p>
                )}

                {Array.isArray(s.list) && (
                  <ul className="mt-2 space-y-1.5">
                    {s.list.map((line, i) => (
                      <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-gray-700">
                        <span className="mt-[6px] inline-block w-1.5 h-1.5 rounded-full bg-gray-400" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <SaveToast
        open={showSave}
        onClose={()=> setShowSave(false)}
        autoHideMs={2000}
        imageSrc={SaveSvg}
        width={351}
        height={46}
        bottom={16}
        xButton={{top: 10, right:10, w:36, h:36}}
      />
      {/* ▼ 복사 모달 (Copy 클릭) */}
{showCopyModal && (
  <div
    className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[2px] flex items-end justify-center"
    role="dialog"
    aria-modal="true"
  >
    {/* 하단 배치: 351 x auto, 안전 영역(pad) 포함 */}
    <div className="w-full flex justify-center pb-[calc(env(safe-area-inset-bottom,0)+16px)]">
      <div className="w-[351px] max-w-[351px rounded-2xl shadow-xl px-5 py-4">
        {/* 세로 스택: URL / Cancel 각자 '버튼' */}
        <div className="flex flex-col gap-3">
          {/* URL 복사 버튼 */}
          <button
            type="button"
            className="w-full"
            aria-label="URL 복사"
            onClick={() => {
              try {
                navigator.clipboard?.writeText?.(window.location.href || "");
              } catch {}
              
              closeCopyModal();
            }}
          >
            <img src={URLIcon} alt="URL 복사" className="w-full h-auto block" />
          </button>

          {/* 취소 버튼 (닫기) */}
          <button
            type="button"
            className="w-full"
            aria-label="닫기"
            onClick={closeCopyModal}
          >
            <img src={CancelIcon} alt="닫기" className="w-full h-auto block" />
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </main>
  );
}