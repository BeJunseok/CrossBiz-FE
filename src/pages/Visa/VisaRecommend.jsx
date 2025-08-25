// src/pages/Visa/VisaRecommend.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/home.svg";
import CardList from "../../components/CardList";
import VisaMore from "./VisaMore";

/** 배열 보정 유틸 */
const A = (v) => (Array.isArray(v) ? v : v ? [v] : []);

/** JSON → CardList 아이템 매핑 (공통 스키마) */
function toCards(json) {
  const recs =
    json?.response?.recommendedVisas ??
    json?.recommendedVisas ??
    [];
  return recs.map((v, idx) => ({
    code: v?.name ?? "",
    highlight: idx === 0 ? "가장 유력한 후보!" : undefined,
    reasons: [v?.reason, v?.purpose, v?.target, v?.qualification].filter(Boolean),
    warnings: A(v?.cautions),
    benefits: A(v?.benefits),
    requiredDocuments: A(v?.requiredDocuments),
    summary: v?.summary,
    name: v?.name,
  }));
}

/** URL 경로들을 순서대로 fetch 시도 */
async function tryFetchPaths(paths) {
  for (const path of paths) {
    try {
      const res = await fetch(path, { method: "GET" });
      if (!res.ok) continue;
      const json = await res.json();
      const mapped = toCards(json);
      if (mapped.length) return mapped;
    } catch (_) {}
  }
  return null;
}

/** Vite 정적 import 폴백 */
async function tryStaticImports(importCandidates) {
  for (const imp of importCandidates) {
    try {
      const mod = await imp();
      const data = mod?.default ?? mod;
      const mapped = toCards(data);
      if (mapped.length) return mapped;
    } catch (_) {}
  }
  return null;
}

export default function VisaRecommend({ userName = "Anna", onHome }) {
  const nav = useNavigate();
  const { state } = useLocation(); // { from?: "issued" | "match", raw?: any }
  const from = state?.from;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 0) 로딩 페이지에서 raw JSON을 넘겨준 경우 최우선 사용
        if (state?.raw) {
          const mapped = toCards(state.raw);
          if (mapped.length) {
            if (!cancelled) setItems(mapped);
            return;
          }
        }

        // 분기에 따라 소스 선택
        const isMatch = from === "match";

        // 1) 퍼블릭 경로 먼저 (대/소문자 모두 시도)
        const publicPaths = isMatch
          ? [
              "/data/CommonUser.json",
              "/data/commonUser.json",
              "/CommonUser.json",
              "/commonUser.json",
            ]
          : [
              "/data/visaUser.json",
              "/visaUser.json",
            ];

        const viaFetch = await tryFetchPaths(publicPaths);
        if (viaFetch && !cancelled) {
          setItems(viaFetch);
          return;
        }

        // 2) 정적 import 폴백
        const viaImport = isMatch
          ? await tryStaticImports([
              () => import("../../data/CommonUser.json"),
            ])
          : await tryStaticImports([
              () => import("../../data/visaUser.json"),
            ]);

        if (viaImport && !cancelled) {
          setItems(viaImport);
          return;
        }

        // 3) 실패 경고
        console.warn(
          isMatch
            ? "추천 데이터 로드 실패: CommonUser.json을 찾을 수 없습니다."
            : "추천 데이터 로드 실패: visaUser.json을 찾을 수 없습니다."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [state, from]);

  if (loading) {
    return (
      <main className="min-h-screen grid place-items-center">
        <p className="text-gray-600">추천 데이터를 불러오는 중…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="relative w-full max-w-[360px] px-6 pt-16 pb-24">
        {/* 좌상단 홈 아이콘 */}
        <button
          type="button"
          onClick={onHome ?? (() => nav("/visa-history", {state: {from}}))}
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
          <CardList items={items} from={state?.from ?? "history"}/>
        </div>

        <div className="mt-12">
          <VisaMore />
        </div>
      </section>
    </main>
  );
}