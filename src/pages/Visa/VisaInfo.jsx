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

import visaUser from "../../data/visaUser.json";
import commonUser from "../../data/commonUser.json";


/* ============ helpers ============ */
const A = (v) => (Array.isArray(v) ? v : v ? [v] : []);


const normalize = (s = "") =>
  s.toLowerCase().replace(/[\s\u00A0]+/g, "").replace(/[‐-‒–—−]/g, "-").trim();

const matchName = (a = "", b = "") => {
  const A1 = normalize(a), B1 = normalize(b);
  return A1 === B1 || A1.includes(B1) || B1.includes(A1);
};

const splitName = (name = "") => {
  const [first, ...rest] = String(name).split(" ");
  return [first || "", rest.join(" ") || ""];

};

const toList = (v) => {
  if (Array.isArray(v)) return v;
  if (!v) return [];
  const parts = String(v)
    .split(/[,•·ㆍ;；;／\/\n]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [String(v)];
};

// 표준/레거시 어디서든 추천배열 꺼내기
const recsFrom = (src) =>
  src?.recommendations ??
  src?.response?.recommendedVisas ??
  src?.recommendedVisas ??
  [];

// 하단 모달/History에서 넘기는 selected 최소객체에 raw의 전체 필드를 병합
const mergeVisa = (base = {}, extra = {}) => {
  // base 우선, 비어있으면 extra로 보강
  const out = { ...extra, ...base };
  // cautions는 배열 보정
  out.cautions = Array.isArray(out.cautions)
    ? out.cautions
    : out.cautions
    ? [out.cautions]
    : [];
  return out;
};

/* ============ component ============ */
export default function VisaInfo() {
  const nav = useNavigate();
  const { state } = useLocation();

  const from = state?.from ?? "history";

  const [sp] = useSearchParams();
  const nameParam = sp.get("name") || "";


  // 1) 데이터 소스 선정
  const source = useMemo(() => {

    if (state?.raw) return state.raw;

    // 최근 추천 원본(raw) 복구 시도
    const tryKeys = [
      `${from === "match" ? "visa_history_match" : "visa_history"}_last_raw`,
      "visa_last_raw_match",
      "visa_last_raw",
    ];
    for (const k of tryKeys) {
      const v = localStorage.getItem(k);
      if (v) {
        try {
          const parsed = JSON.parse(v);
          if (parsed) return parsed;
        } catch {}
      }
    }

    // 최종 폴백: 샘플
    return from === "match" ? commonUser : visaUser;

  }, [state?.raw, from]);

  // 2) 추천 리스트
  const recList = useMemo(() => recsFrom(source), [source]);

  // 3) 최종 비자 객체: (1) state.selected → (2) name으로 raw에서 찾고 병합 → (3) name만 있으면 최소객체
  const visa = useMemo(() => {

    const selected = state?.selected || null;                 // { name, reason, cautions, purpose, ... } 최소객체
    const targetName = nameParam || selected?.name || "";

    // raw에서 풀 오브젝트
    const byName = recList.find((v) => matchName(v?.name, targetName));

    if (selected && byName) return mergeVisa(selected, byName);
    if (selected) return mergeVisa(selected, {});             // selected만으로 표시
    if (byName) return mergeVisa(byName, {});                 // raw만으로 표시

    // 그래도 없으면 이름만
    return targetName ? { name: targetName } : null;

  }, [state?.selected, recList, nameParam]);

  const [mainCode, subTitle] = splitName(visa?.name || '');

  const sections = useMemo(
    () => [
      { key: 'purpose', title: '목적', icon: PurposeIcon, body: visa?.purpose },
      { key: 'people', title: '대상', icon: PeopleIcon, body: visa?.target },
      {
        key: 'qual',
        title: '신청자격',
        icon: TargetIcon,
        list: toList(visa?.qualification),
      },
      {
        key: 'need',
        title: '필요서류',
        icon: NeedIcon,
        list: A(visa?.requiredDocuments),
      },
      {
        key: 'benefits',
        title: '혜택',
        icon: BenefitsIcon,
        list: A(visa?.benefits),
      },
    ],
    [visa]
  );

  /* ============ save/share ============ */
  const [showSave, setShowSave] = useState(false);
  const [showCopyModal, setShowCopyModal] = useState(false);

  const triggerSave = useCallback(() => {
    const key = from === 'match' ? 'visa_history_match' : 'visa_history';
    const type = (visa?.name || nameParam || '').trim();
    if (!type) return;

    const d = new Date();
    const date = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
      d.getDate()).padStart(2, "0")}`;


    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(key) || '[]') || [];
      if (!Array.isArray(list)) list = [];
    } catch {
      list = [];
    }

    const idx = list.findIndex((it) => (it?.type || "") === type);

    if (idx >= 0) list[idx] = { ...list[idx], date, id: Date.now() };
    else list.push({ id: Date.now(), type, date, source: from });

    localStorage.setItem(key, JSON.stringify(list));

    // 원본 raw도 최신으로 백업해 두면 나중에 History에서 복원 가능
    try {
      localStorage.setItem(
        `${key}_last_raw`,
        JSON.stringify(source)
      );
    } catch {}

    setShowSave(true);
  }, [visa, nameParam, from, source]);

  const openCopyModal = useCallback(() => setShowCopyModal(true), []);
  const closeCopyModal = useCallback(() => setShowCopyModal(false), []);

  /* ============ guard ============ */
  if (!visa) {
    return (
      <main className="min-h-screen w-full flex justify-center">
        <section className="w-full max-w-[393px] px-6 py-16 text-center">
          <p className="font-semibold">
            {nameParam
              ? '해당 이름의 비자를 찾을 수 없습니다.'
              : '비자 이름이 없습니다.'}
          </p>
          {nameParam && (
            <p className="text-sm text-gray-500 mt-2">
              요청한 이름: {nameParam}
            </p>
          )}
          <button
            className="mt-6 w-full h-11 rounded-full bg-gray-900 text-white"
            onClick={() => nav('/visa-history')}
          >
            비자 히스토리로 이동
          </button>
        </section>
      </main>
    );
  }

  /* ============ render ============ */
  return (
    <main className="min-h-screen w-full flex justify-center">
      <section className="w-full max-w-[393px]">
        {/* 헤더 */}
        <header
          className="relative w-full text-white pt-8 pb-6 px-6"
          style={{
            background: 'linear-gradient(180deg,#000000 0%,#2B3055 100%)',
          }}
        >
          <img
            src={LeftIcon}
            alt=""
            className="absolute top-6 left-6 w-auto h-5 object-contain cursor-pointer"
            onClick={() => nav(-1)}
          />
          <div className="mt-12">
            <div className="text-[40px] font-semibold leading-tight">
              {mainCode || visa.name}
            </div>
            {!!subTitle && (
              <div className="mt-1 text-[15px] font-semibold">{subTitle}</div>
            )}
            <div className="mt-1 text-[13px] opacity-90">
              technology start-up visa
            </div>
          </div>

          {/* 우측 상단 버튼 */}
          <div className="absolute top-6 right-6 flex gap-1.5">
            <button
              type="button"
              className="block p-0 m-0"
              onClick={triggerSave}
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
        </header>

        {/* 본문 */}
        <div className="px-6 py-6">
          <div className="rounded-2xl border border-gray-100 bg-white shadow-md px-5 py-4">
            {sections.map((s, idx) => (
              <div key={s.key} className={idx === 0 ? '' : 'mt-6'}>
                <div className="flex items-center gap-2">
                  <img src={s.icon} alt="" className="shrink-0" />
                  <h3 className="text-[15px] font-semibold text-gray-900">
                    {s.title}
                  </h3>
                </div>

                {s.body && (
                  <p className="mt-2 text-[13px] leading-relaxed text-gray-700">
                    {s.body}
                  </p>
                )}
                {Array.isArray(s.list) && s.list.length > 0 && (
                  <ul className="mt-2 space-y-1.5">
                    {s.list.map((line, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[13px] leading-relaxed text-gray-700"
                      >
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

                  onClick={() => { try { navigator.clipboard?.writeText?.(window.location.href || ""); } catch {} ; closeCopyModal(); }}
                >
                  <img src={URLIcon} alt="URL 복사" className="w-full h-auto block" />

                </button>
                <button
                  type="button"
                  className="w-full"
                  aria-label="닫기"
                  onClick={closeCopyModal}
                >
                  <img
                    src={CancelIcon}
                    alt="닫기"
                    className="w-full h-auto block"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
