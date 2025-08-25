// src/pages/Visa/VisaInfo.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

import LeftIcon from "../../assets/LeftIcon.svg";
import DownloadIcon from "../../assets/Download.svg";
import CopyIcon from "../../assets/Copy.svg";
import PurposeIcon from "../../assets/Purpose.svg";
import PeopleIcon from "../../assets/People.svg";
import TargetIcon from "../../assets/Target.svg";
import NeedIcon from "../../assets/Need.svg";
import BenefitsIcon from "../../assets/Benefits.svg";
import SaveToast from "../../components/SaveToast";
import SaveSvg from "../../assets/Save.svg";
import URLIcon from "../../assets/URL.svg";
import CancelIcon from "../../assets/Cancel.svg";

// ✅ 정적 import
import visaUser from "../../data/visaUser.json";
import commonUser from "../../data/commonUser.json";

// 공통 유틸
const A = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const normalize = (s = "") =>
  s.toLowerCase().replace(/[\s\u00A0]+/g, "").replace(/[‐-‒–—−]/g, "-").trim();
// "D-8 기업 투자 비자" → ["D-8", "기업 투자 비자"]
const splitName = (name = "") => {
  const [first, ...rest] = name.split(" ");
  return [first || "", rest.join(" ") || ""];
};
// 문자열을 자연스러운 리스트로 분해
const toList = (v) => {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  const parts = String(v)
    .split(/[,•·ㆍ;／\/\n]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [String(v)];
};

export default function VisaInfo() {
  const nav = useNavigate();
  const { state } = useLocation(); // { from?: "match" | "history", raw?: any }
  const from = state?.from ?? "history";
  const [sp] = useSearchParams();
  const nameParam = sp.get("name"); 

  // 🔎 데이터 소스 결정: raw > (match? commonUser : visaUser)
  const sourceJson = useMemo(() => {
    if (state?.raw) return state.raw;
    return from === "match" ? commonUser : visaUser;
  }, [state?.raw, from]);

  // JSON에서 대상 비자 찾기
  const visa = useMemo(() => {
    const list =
      sourceJson?.response?.recommendedVisas ??
      sourceJson?.recommendedVisas ??
      [];
    if (!nameParam) return null;
    const N = normalize(nameParam);
    return (
      list.find((v) => normalize(v?.name) === N) ||
      list.find((v) => normalize(v?.name).includes(N)) ||
      null
    );
  }, [sourceJson, nameParam]);

  // 헤더 타이틀 파트
  const [mainCode, subTitle] = splitName(visa?.name || "");

  // 섹션을 JSON 기반으로 구성
  const sections = useMemo(
    () => [
      { key: "purpose",  title: "목적",     icon: PurposeIcon,  body: visa?.purpose },
      { key: "people",   title: "대상",     icon: PeopleIcon,   body: visa?.target },
      { key: "qual",     title: "신청자격", icon: TargetIcon,   list: toList(visa?.qualification) },
      { key: "need",     title: "필요서류", icon: NeedIcon,     list: A(visa?.requiredDocuments) },
      { key: "benefits", title: "혜택",     icon: BenefitsIcon, list: A(visa?.benefits) },
    ],
    [visa]
  );

  // 토스트 & 모달
  const [showSave, setShowSave] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  const triggerSave = useCallback(() => {
    const key = from === "match" ? "visa_history_match" : "visa_history";
    const type = (visa?.name || nameParam || "").trim();
    if (!type) return;

    // 오늘 날짜 YYYY.MM.DD
    const d = new Date();
    const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(
      d.getDate()
    ).padStart(2, "0")}`;

    // 기존 목록 읽기
    let list = [];
    try {
      const raw = JSON.parse(localStorage.getItem(key) || "[]");
      list = Array.isArray(raw) ? raw : [];
    } catch {
      list = [];
    }

    // 중복 방지: 같은 type 있으면 날짜/id 갱신, 없으면 추가
    const idx = list.findIndex((it) => (it?.type || "") === type);
    if (idx >= 0) {
      list[idx] = { ...list[idx], date, id: Date.now() };
    } else {
      list.push({ id: Date.now(), type, date, source: from });
    }

    localStorage.setItem(key, JSON.stringify(list));
    setShowSave(true); // 라우팅 없이 토스트만
  }, [visa, nameParam]);

  const openCopyModal = useCallback(() => setShowCopyModal(true), []);
  const closeCopyModal = useCallback(() => setShowCopyModal(false), []);

  // 가드: nameParam 없거나 매칭 실패
  if (!nameParam || !visa) {
    return (
      <main className="min-h-screen w-full flex justify-center">
        <section className="w-full max-w-[393px] px-6 py-16 text-center">
          <p className="font-semibold">
            {nameParam ? "해당 이름의 비자를 찾을 수 없습니다." : "비자 이름이 없습니다."}
          </p>
          {nameParam && <p className="text-sm text-gray-500 mt-2">요청한 이름: {nameParam}</p>}
          <button
            className="mt-6 w-full h-11 rounded-full bg-gray-900 text-white"
            onClick={() => nav("/visa-history")}
          >
            비자 히스토리로 이동
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex justify-center">
      <section className="w-full max-w-[393px]">
        {/* ───── 헤더 ───── */}
        <header
          className="relative w-full text-white pt-8 pb-6 px-6"
          style={{ background: "linear-gradient(180deg,#000000 0%,#2B3055 100%)" }}
        >
          {/* 좌측 상단 LeftIcon */}
          <img
            src={LeftIcon}
            alt=""
            className="absolute top-6 left-6 w-auto h-5 object-contain cursor-pointer"
            onClick={() => nav(-1)}
          />

          {/* 우측 상단 DownloadIcon + CopyIcon */}
          <div className="absolute top-6 right-6 flex gap-1.5">
            <button type="button" className="block p-0 m-0" onClick={triggerSave} aria-label="저장">
              <img src={DownloadIcon} alt="" className="w-auto h-6 block cursor-pointer" />
            </button>
            <button
              type="button"
              className="block p-0 m-0"
              onClick={openCopyModal}
              aria-label="복사/공유 옵션"
            >
              <img src={CopyIcon} alt="" className="w-auto h-6 block cursor-pointer" />
            </button>
          </div>

          {/* 타이틀 (JSON 기반) */}
          <div className="mt-12">
            <div className="text-[40px] font-semibold leading-tight">{mainCode || visa.name}</div>
            {!!subTitle && <div className="mt-1 text-[15px] font-semibold">{subTitle}</div>}
            <div className="mt-1 text-[13px] opacity-90">technology start-up visa</div>
          </div>
        </header>

        {/* ───── 본문 ───── */}
        <div className="px-6 py-6">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-md px-5 py-4">
            {sections.map((s, idx) => (
              <div key={s.key} className={idx === 0 ? "" : "mt-6"}>
                <div className="flex items-center gap-2">
                  <img src={s.icon} alt="" className="shrink-0" />
                  <h3 className="text-[15px] font-semibold text-gray-900">{s.title}</h3>
                </div>

                {/* body or list */}
                {s.body && (
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-700">{s.body}</p>
                )}
                {Array.isArray(s.list) && s.list.length > 0 && (
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

      {/* 저장 토스트 */}
      <SaveToast
        open={showSave}
        onClose={() => setShowSave(false)}
        autoHideMs={2000}
        imageSrc={SaveSvg}
        width={351}
        height={46}
        bottom={16}
        xButton={{ top: 10, right: 10, w: 36, h: 36 }}
      />

      {/* 복사 모달 */}
      {showCopyModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-[2px] flex items-end justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full flex justify-center pb-[calc(env(safe-area-inset-bottom,0)+16px)]">
            <div className="w-[351px] max-w-[351px] rounded-2xl shadow-xl px-5 py-4">
              <div className="flex flex-col gap-3">
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