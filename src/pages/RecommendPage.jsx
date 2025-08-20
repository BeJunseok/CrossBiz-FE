import React, { useMemo, useState, useLayoutEffect, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

const IconStarFill = ({ size = 22, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path d="M12 17.3l-6.16 3.33 1.18-6.88L2 8.97l6.92-1L12 1.6l3.08 6.36 6.92 1-5.02 4.78 1.18 6.88L12 17.3z" fill="currentColor"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconMore = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>
  </svg>
);
const IconGlobe = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="inline-block align-[-1px]">
    <path d="M12 3a9 9 0 100 18a9 9 0 000-18Z" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M3 12h18M12 3c3.3 3.8 3.3 13.2 0 18M12 3c-3.3 3.8-3.3 13.2 0 18" stroke="currentColor" strokeWidth="1.6"/>
  </svg>
);

const IconPhone = ({ size = 18, className="" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
    <path fill="currentColor" d="M6.62 10.79a15.05 15.05 0 006.59 6.59l1.98-1.98a1 1 0 011.01-.24c1.1.37 2.29.57 3.5.57a1 1 0 011 1v3.52a1 1 0 01-1 1C11.85 21.26 2.74 12.15 2.75 2.3a1 1 0 011-1H7.3a1 1 0 011 1c0 1.21.2 2.4.57 3.5a1 1 0 01-.25 1.01l-2 1.98z"/>
  </svg>
);

const Avatar = () => <div className="h-8 w-8 shrink-0 rounded-full bg-gray-200" />;
const Tag = ({ children }) => <span className="inline-block rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-semibold text-gray-800">{children}</span>;
const Row = ({ label, children, accent }) => (
  <li className="flex text-[13px] leading-6">
    <span className="min-w-[72px] shrink-0 text-gray-500">{label}</span>
    <span className={accent ? "font-semibold text-blue-600" : "text-gray-800"}>{children}</span>
  </li>
);
const RatingBar = ({ label, value, max = 10 }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="flex items-center gap-2">
      <span className="w-4 text-right text-[12px] text-gray-600">{label}</span>
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="absolute inset-y-0 left-0 rounded-full bg-blue-600" style={{ width: `${pct}%` }}/>
      </div>
    </div>
  );
};


function ContactSheet({ open, phone="010-0000-0000", onClose }) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  if (!open) return null;

  const content = (
    <div className="fixed inset-0 z-[100]">
     
      <button
        aria-hidden
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-[4px]"
      />
      
      <div className="fixed inset-x-0 bottom-6 mx-auto w-[92%] max-w-[520px] space-y-2">
        <button
          type="button"
          onClick={() => { const num = phone.replace(/[^\d]/g,""); window.location.href = `tel:${num}`; }}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-white py-3 text-[15px] font-semibold text-blue-600 shadow-2xl shadow-black/40 ring-1 ring-black/5 active:translate-y-[1px]"
        >
          <IconPhone className="text-blue-600" />
          통화 {phone}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex w-full items-center justify-center gap-2 rounded-[14px] bg-white py-3 text-[15px] font-semibold text-blue-600 shadow-2xl shadow-black/40 ring-1 ring-black/5 active:translate-y-[1px]"
        >
          취소
        </button>
      </div>
    </div>
  );

 
  return createPortal(content, document.body);
}


export default function RecommendPage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const [tab, setTab] = useState("info");
  const [openContact, setOpenContact] = useState(false);

  const c = useMemo(
    () => ({
      name: state?.name ?? "김철수 세무사",
      langs: state?.langs ?? ["영어", "중국어"],
    }),
    [state]
  );

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    if (document?.documentElement) document.documentElement.scrollTop = 0;
    if (document?.body) document.body.scrollTop = 0;
  }, []);

  const PAD_TOP_PROFILE = "pt-5";
  const PAD_TOP_SECTION = "pt-4";
  const serviceDetail =
    "부동산실거래조사, 자금출처소명, 자금조달계획서 지원, 가족간 증여/양도, 차량감가, 해외주식 등 다양한 세목에 대해 주기적 관리와 맞춤형 리포트를 제공합니다. 기장 서비스는 매월 카드·매출·매입 보고서와 예수부 가산세 등 프리미엄 리포트를 받아보실 수 있습니다.";
  const reviews = [
    { name: "Jhon smith 님", score: 4.8, date: "2025.08.04", text: "Reasonable amount and kind attitude. Will contact again!" },
    { name: "金哲洙 님", score: 5.0, date: "2025.07.28", text: "费用合理，态度亲切，解答详细。非常满意。" },
  ];
  const avg = (reviews.reduce((s, r) => s + r.score, 0) / reviews.length).toFixed(1);

  return (
    <div className="w-full bg-white">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-2.5">
        <button onClick={() => nav("/tax")} aria-label="back" className="text-gray-900">
          <IconChevronLeft />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900">세무상담사 추천</h1>
        <button aria-label="more" className="text-gray-900">
          <IconMore />
        </button>
      </header>

      <section className={`px-4 ${PAD_TOP_PROFILE}`}>
        <div className="flex flex-col items-center">
          <div className="h-[64px] w-[64px] rounded-md bg-gray-200" />
          <h2 className="mt-2 text-[18px] font-semibold text-gray-900">{c.name}</h2>
          <p className="mt-1 text-[13px] text-gray-700">
            <span className="mr-1 text-gray-500"><IconGlobe /></span>
            {c.langs.join(", ")} 가능 · 외식업 전문
          </p>
          <p className="mt-2 w-full text-center text-[12px] leading-tight text-gray-500 line-clamp-2">
            안녕하세요. 외국인 한인과 여러분의 한국 내 회사를 위해 최선을 다하는 김철수 세무사입니다. 언제든지 연락 주세요.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
            <Tag>3개국어능통</Tag><Tag>재무관리</Tag><Tag>기장전문</Tag>
          </div>
        </div>
      </section>

      <nav className="px-4 pt-4">
        <div className="relative flex items-center justify-between gap-4 border-b border-gray-200 pb-2">
          {[
            { k: "info", t: "상담사 정보" },
            { k: "service", t: "서비스 상세" },
            { k: "review", t: `리뷰 (${reviews.length})` },
          ].map(({ k, t }) => (
            <button key={k} onClick={() => setTab(k)} className="relative -mb-[1px] pb-1 text-[14px] text-gray-600">
              <span className={`relative inline-block ${tab === k ? "font-semibold text-gray-900" : ""} after:absolute after:left-0 after:bottom-[-11px] after:h-[2px] after:bg-black ${tab === k ? "after:w-full" : "after:w-0"}`}>{t}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="px-4 pb-8">
        {tab === "info" && (
          <section className={PAD_TOP_SECTION}>
            <h3 className="mb-2 text-[15px] font-semibold text-gray-900 mt-2">상담사 정보</h3>
            <ul className="space-y-1.5">
              <Row label="요금:" accent>12만원 (시간당)</Row>
              <Row label="전문 분야:">재무 관리, 기장 관리, 회계</Row>
              <Row label="가능 언어:">{[...c.langs, "스페인어"].join(", ")}</Row>
              <Row label="상담 시간:">오전 09시 ~ 오후 18시</Row>
              <Row label="전화번호:">010-0000-0000</Row>
              <Row label="위치:">서울특별시 마포구 와우산로 94 (상수동)</Row>
            </ul>
          </section>
        )}

        {tab === "service" && (
          <section className={PAD_TOP_SECTION}>
            <h3 className="mb-2 text-[15px] font-semibold text-gray-900 mt-4">서비스 상세</h3>
            <p className="text-[13px] leading-6 text-gray-800">{serviceDetail}</p>
          </section>
        )}

        {tab === "review" && (
          <section className={PAD_TOP_SECTION}>
            <h3 className="mb-3 text-[15px] font-semibold text-gray-900">리뷰 ({reviews.length})</h3>
            <div className="mb-4 grid grid-cols-12 gap-3 rounded-lg border border-gray-200 p-3">
              <div className="col-span-5 flex items-center gap-2">
                <IconStarFill size={28} className="text-blue-600" />
                <div className="text-[22px] font-semibold leading-none text-gray-900">
                  {avg} <span className="text-sm text-gray-500">/5.0</span>
                </div>
              </div>
              <div className="col-span-7 flex flex-col justify-center gap-1.5">
                <RatingBar label={5} value={9} />
                <RatingBar label={4} value={8} />
                <RatingBar label={3} value={4} />
                <RatingBar label={2} value={2} />
                <RatingBar label={1} value={1} />
              </div>
            </div>

            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className="rounded-xl bg-[#f3f3f3] p-3">
                  <div className="mb-2 flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <Avatar />
                      <div className="leading-tight">
                        <div className="text-[13px] font-semibold text-gray-900">{r.name}</div>
                        <div className="mt-1 flex items-center gap-1 text-[13px]">
                          <IconStarFill size={14} className="text-blue-600" />
                          <span className="font-semibold text-gray-900">{r.score.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <span className="ml-3 shrink-0 text-[12px] text-gray-500">{r.date}</span>
                  </div>
                  <p className="text-[13px] leading-6 text-gray-800">{r.text}</p>
                  <button disabled className="mt-2 text-[12px] text-gray-400 underline">번역 보기</button>
                </div>
              ))}
            </div>

            <div className="mt-4 pb-2">
              <button
                type="button"
                onClick={() => setOpenContact(true)}
                className="mx-auto block w-[86%] rounded-full bg-gray-900 py-2.5 text-[15px] font-semibold text-white shadow-md active:opacity-90"
              >
                문의하기
              </button>
            </div>
          </section>
        )}
        <div className="h-64 bg-white" />
      </main>

   
      <ContactSheet
        open={openContact}
        phone="010-0000-0000"
        onClose={() => setOpenContact(false)}
      />
    </div>
  );
}