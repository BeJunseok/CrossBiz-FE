// src/pages/Visa/VisaRecommend.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/home.svg";
import CardList from "../../components/CardList";
import VisaMore from "./VisaMore";

const A = (v) => (Array.isArray(v) ? v : v ? [v] : []);

// 문자열/래핑 정규화
const normalize = (raw) => {
  let v = raw;
  if (typeof v === "string") {
    try { v = JSON.parse(v); } catch {}
  }
  // axios {data:{...}} 래핑 풀기
  if (v && typeof v === "object" && v.data && !v.response && !v.recommendedVisas) v = v.data;
  return v;
};

// 객체를 배열로 강제 변환 (ex: {0:{},1:{}} → [{},{}])
const objToArrayIfNeeded = (x) => {
  if (Array.isArray(x)) return x;
  if (x && typeof x === "object") {
    const keys = Object.keys(x);
    if (keys.every((k) => /^\d+$/.test(k))) {
      return keys.sort((a,b)=>Number(a)-Number(b)).map((k) => x[k]);
    }
  }
  return null;
};

// 추천배열 추출 (키 자동탐지 포함)
const extractRecArray = (input) => {
  const json = normalize(input);

  // 1) 흔한 경로
  let cand =
    json?.response?.recommendedVisas ??
    json?.recommendedVisas ??
    json?.result?.recommendedVisas ??
    json?.data?.recommendedVisas ??
    null;

  // 2) 배열 아니면 객체→배열 시도
  let arr = objToArrayIfNeeded(cand);
  if (arr) return arr;

  // 3) 키 자동탐지 (recommendedVisas 오타/대소문자/공백 대응)
  if (json && typeof json === "object") {
    const foundKey = Object.keys(json).find((k) =>
      k.replace(/\s+/g, "").toLowerCase().includes("recommendedvisas")
    );
    if (foundKey) {
      const v = json[foundKey];
      if (Array.isArray(v)) return v;
      const arr2 = objToArrayIfNeeded(v);
      if (arr2) return arr2;
    }
  }

  // 4) 최후: 전체가 배열이면 그대로 사용
  if (Array.isArray(json)) return json;

  return [];
};

// 카드 매핑 (제목=name, 본문: reason + cautions)
const toCards = (json) =>
  extractRecArray(json).map((v, idx) => ({
    name: v?.name ?? "",
    reason: v?.reason ?? "",
    cautions: A(v?.cautions),
    highlight: idx === 0 ? "가장 유력한 후보!" : undefined,
  }));

export default function VisaRecommend({ userName = "Anna", onHome }) {
  const nav = useNavigate();
  const { state } = useLocation();
  const from = state?.from ?? "history";

  // 로딩에서 넘겨준 값: raw 또는 recommendData 어느쪽이든 받기
  const raw = state?.raw ?? state?.recommendData ?? null;

  const [items, setItems] = useState([]);

  useEffect(() => {
    const mapped = toCards(raw);
    if (import.meta.env.DEV) {
      console.log("[VisaRecommend] raw:", raw);
      console.log("[VisaRecommend] extracted length:", mapped.length);
    }
    setItems(mapped);
  }, [raw]);

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="relative w-full max-w-[360px] px-6 pt-16 pb-24">
        <button
          type="button"
          onClick={onHome ?? (() => nav("/visa-history", { state: { from } }))}
          className="absolute left-6 top-6 active:scale-[0.98]"
          aria-label="홈으로"
        >
          <img src={HomeIcon} alt="" className="w-6 h-6" />
        </button>

        <h1 className="text-[25px] font-extrabold text-gray-900 text-center">
          {userName} 님을 위한
          <br />최적의 비자
        </h1>

        <div className="mt-16">
          {items.length === 0 ? (
            <div className="text-center text-gray-600">
              추천 데이터를 불러오지 못했어요. (개발용) 콘솔 raw를 확인해 주세요.
            </div>
          ) : (
            <CardList items={items} from={from} raw={normalize(raw)} />
          )}
        </div>

        <div className="mt-12">
          <VisaMore raw={normalize(raw)} />
        </div>
      </section>
    </main>
  );
}