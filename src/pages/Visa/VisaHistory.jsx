import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HistoryIcon from "../../assets/History.svg";
import ShareIcon from "../../assets/Share.svg";
import NearbyOffices from "../../components/NearbyOffices";
import { getUserProfile } from "@/api/auth/Auth";
import commonUser from "@/data/CommonUser.json";
import visaUser from "../../data/visaUser.json";

/* ===== helpers ===== */
const norm = (s = "") =>
  String(s).toLowerCase().replace(/\s+/g, "").replace(/[‐-‒–—−]/g, "-");

const matchName = (a = "", b = "") => {
  const A = norm(a), B = norm(b);
  return A === B || A.includes(B) || B.includes(A);
};

const extractRecList = (raw) =>
  raw?.recommendations ??
  raw?.response?.recommendedVisas ??
  raw?.recommendedVisas ??
  [];

const toSelected = (v = {}) => ({
  name: v?.name,
  reason: v?.reason,
  cautions: Array.isArray(v?.cautions) ? v.cautions : v?.cautions ? [v.cautions] : [],
  purpose: v?.purpose,
  target: v?.target,
  qualification: v?.qualification,
  requiredDocuments: v?.requiredDocuments,
  benefits: v?.benefits,
});

export default function VisaHistory() {
  const nav = useNavigate();
  const location = useLocation();

  const fromParam = location.state?.from ?? "history"; // "match" | "history"
  const startFrom = fromParam === "history" ? "issued" : fromParam;

  // 사용자 이름 (없으면 Anna)
  const [userName, setUserName] = useState(location.state?.userName ?? "Anna");
  useEffect(() => {
    (async () => {
      try {
        const me = await getUserProfile();
        if (me?.name) setUserName(me.name);
      } catch {}
    })();
  }, []);

  // 상단 안내(데모 값)
  const visaName = "D-8-4";
  const remainDays = 250;
  const expireDate = "2027.06.31";

  // 히스토리 목록 + raw 복구
  const storageKey = fromParam === "match" ? "visa_history_match" : "visa_history";
  const [history, setHistory] = useState([]);
  const [lastRaw, setLastRaw] = useState(null);

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem(storageKey) || "[]");
      setHistory(Array.isArray(list) ? list : []);
    } catch {
      setHistory([]);
    }

    // 최근 추천 원본(raw)도 백업 키에서 복구
    const tryKeys = [`${storageKey}_last_raw`, "visa_last_raw_match", "visa_last_raw"];
    for (const k of tryKeys) {
      const v = localStorage.getItem(k);
      if (v) {
        try { setLastRaw(JSON.parse(v)); break; } catch {}
      }
    }
  }, [storageKey]);

  // ✅ 우선순위: Recommend가 넘겨준 raw → 없으면 lastRaw → 샘플
  const incomingRaw =
    location.state?.raw ??
    lastRaw ??
    (fromParam === "match" ? commonUser : visaUser);

  // 날짜 내림차순
  const sorted = useMemo(() => {
    const toNum = (d) => Number(String(d || "").replaceAll(".", ""));
    return [...history].sort((a, b) => toNum(b.date) - toNum(a.date));
  }, [history]);

  /* ====== CardList와 동일한 형식으로 전달 ====== */
  const goDetail = (typeName) => {
    const list = extractRecList(incomingRaw);
    const found = list.find((v) => matchName(v?.name, typeName));
    const selected = found ? toSelected(found) : { name: typeName };

    nav("/visa-info", {
      state: {
        from: fromParam,
        raw: incomingRaw,        // ✅ 전체 원본
        selected,                // ✅ 모달과 동일 구조
      },
      search: `?name=${encodeURIComponent(typeName)}`,
    });
  };

  return (
    <main className="min-h-screen w-full flex justify-center">
      <section className="w-full max-w-[393px] px-6 py-6">
        <h1 className="text-[22px] font-semibold text-gray-900">비자</h1>

        {/* 상단 카드 */}
        <div
          className="mt-4 rounded-[24px] w-[352px] h-[274px] text-white 
                     flex flex-col items-center justify-center text-center gap-3"
          style={{ background: "linear-gradient(180deg, #191D24 0%, #4D4C62 100%)" }}
        >
          <p className="text-[24px] font-semibold leading-snug text-[#D0D0D0]">
            {userName} 님의 <span className="text-white">{visaName} 비자</span>가 <br />
            <span className="text-white">{remainDays}</span>일 남았어요.
          </p>
          <p className="text-[17px] font-extrabold opacity-90 text-white">만료일: {expireDate}</p>

          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center 
                       h-[55px] w-[273px] rounded-[999px] 
                       bg:white bg-white text-gray-900 text-[18px] font-semibold shadow-sm"
            onClick={() => nav("/loading-prev", { state: { from: startFrom, userName } })}
          >
            새 비자 매칭
          </button>
        </div>

        {/* 히스토리 */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={HistoryIcon} alt="" className="w-5 h-5" />
            <h2 className="text-[16px] font-semibold text-gray-900">비자 매칭 히스토리</h2>
          </div>
          <button
            type="button"
            className="text-[11px] font-bold text-gray-500 px-1.5 py-0.5 rounded-2xl bg-[#D0D0D0]"
            onClick={() => nav("/history-match", { state: { from: fromParam, userName, raw: incomingRaw } })}
          >
            더보기
          </button>
        </div>

        <div className="mt-3 rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between bg-[#E8E8E8] px-14 py-2">
            <span className="text-[13px] font-semibold text-gray-600">유형</span>
            <span className="text-[13px] font-semibold text-gray-600">날짜</span>
          </div>
          <ul className="divide-y divide-gray-100">
            {sorted.map((row) => (
              <li key={row.id} className="px-4 py-1">
                <div className="flex items-center justify-between">
                  {/* 이름을 눌러도 자세히 보기 */}
                  <button
                    type="button"
                    className="text-left text-[12px] text-gray-900 underline decoration-transparent hover:decoration-gray-300"
                    onClick={() => goDetail(row.type)}
                  >
                    {row.type}
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-700">{row.date}</span>
                    <button
                      type="button"
                      aria-label="상세 보기"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-[#F3F3F3]"
                      onClick={() => goDetail(row.type)}
                    >
                      <img src={ShareIcon} alt="" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {sorted.length === 0 && (
              <li className="px-4 py-3 text-[12px] text-gray-500">저장된 기록이 없습니다.</li>
            )}
          </ul>
        </div>

        <NearbyOffices />
      </section>
    </main>
  );
}