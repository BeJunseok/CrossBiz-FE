// src/pages/Visa/VisaRecommend.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "../../assets/home.svg";
import CardList from "../../components/CardList";
import VisaMore from "./VisaMore";

/* ---------- 유틸: 안전 파서 ---------- */
const stripBOM = (s) =>
  typeof s === "string" && s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;

// “스마트 따옴표” → 일반 쌍따옴표로 교정
const deSmartQuote = (s) =>
  typeof s === "string"
    ? s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'")
    : s;

// 문자열 안에서 JSON만 추출해서 파싱 시도
const looseJsonParse = (maybeStr) => {
  if (typeof maybeStr !== "string") return maybeStr;
  let s = stripBOM(deSmartQuote(maybeStr)).trim();

  // 앞뒤 잡음 제거
  const start = Math.min(
    ...["{", "["].map((ch) => (s.indexOf(ch) >= 0 ? s.indexOf(ch) : Infinity))
  );
  const end = Math.max(s.lastIndexOf("}"), s.lastIndexOf("]"));
  if (start !== Infinity && end > start) {
    s = s.slice(start, end + 1);
  }

  // trailing comma 제거
  s = s.replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(s);
  } catch {
    return maybeStr; // 실패 시 원본 반환
  }
};

const asArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "object") {
    const ks = Object.keys(v);
    if (ks.length && ks.every((k) => /^\d+$/.test(k))) {
      return ks.sort((a, b) => +a - +b).map((k) => v[k]);
    }
  }
  return [];
};

/* ---------- normalizeRaw ---------- */
const normalizeRaw = (raw) => {
  // 문자열 → JSON 파싱 시도
  let v = typeof raw === "string" ? looseJsonParse(raw) : raw;

  // 흔한 래핑 해제
  const unwrapOnce = (x) => {
    if (!x || typeof x !== "object") return x;
    if (x.data && Object.keys(x).length === 1) return x.data;
    if (x.response && Object.keys(x).length === 1) return x.response;
    if (x.result && Object.keys(x).length === 1) return x.result;
    if (typeof x.json === "string") return looseJsonParse(x.json);
    return x;
  };

  v = unwrapOnce(v);
  v = unwrapOnce(v);

  const root =
    v && typeof v === "object"
      ? v.response ?? v.result ?? v.data ?? v
      : {};

  const model = {
    summary: root?.summary ?? "",
    recommendations: asArray(root?.recommendedVisas),
    alternatives: asArray(root?.alternativeOptions),
    cautions: asArray(root?.visaCautions),
    __raw: raw,
    __root: root,
    __pickedKey: undefined,
    __parseInfo: {
      rawType: typeof raw,
      afterParseType: typeof v,
    },
  };

  // 추천 배열 못 찾으면 구조 기반 탐색
  if (model.recommendations.length === 0 && root && typeof root === "object") {
    const looksLikeRec = (arr) => {
      if (!Array.isArray(arr) || !arr.length || typeof arr[0] !== "object")
        return false;
      const sample = arr.slice(0, Math.min(arr.length, 5));
      let hit = 0;
      for (const it of sample) {
        if (
          it &&
          typeof it === "object" &&
          "name" in it &&
          ("reason" in it || "cautions" in it)
        )
          hit++;
      }
      return hit >= Math.ceil(sample.length / 2);
    };

    for (const [k, val] of Object.entries(root)) {
      const arr = asArray(val);
      if (arr.length && looksLikeRec(arr)) {
        model.recommendations = arr;
        model.__pickedKey = k;
        break;
      }
    }
  }

  return model;
};

/* ---------- 디버그 로그 ---------- */
const debugPrintModel = (raw, model) => {
  try {
    console.groupCollapsed(
      "%c[VisaRecommend] DEBUG",
      "background:#111;color:#90ee90;padding:2px 6px;border-radius:4px;"
    );
    console.log("▶ typeof raw:", typeof raw);
    console.log("▶ parse info:", model.__parseInfo);
    console.log(
      "▶ root keys:",
      model.__root && typeof model.__root === "object"
        ? Object.keys(model.__root)
        : null
    );
    console.log("▶ summary:", model.summary);
    console.log("▶ alternatives.length:", model.alternatives.length);
    console.log("▶ cautions.length:", model.cautions.length);

    if (model.__pickedKey) {
      console.log("✅ picked recommendations key:", model.__pickedKey);
    } else if (model.recommendations.length > 0) {
      console.log("✅ recommendations from fixed path: root.recommendedVisas");
    } else {
      console.warn("❌ recommendations not found");
    }

    console.log("▶ recommendations.length:", model.recommendations.length);
    console.table(model.recommendations.slice(0, 3));
    console.groupEnd();
  } catch (e) {
    console.error("[VisaRecommend] debug error:", e);
  }
};

/* ---------- 카드 매핑 ---------- */
const toCards = (model) =>
  model.recommendations.map((v, idx) => ({
    name: v?.name ?? "",
    reason: v?.reason ?? "",
    cautions: Array.isArray(v?.cautions)
      ? v.cautions
      : v?.cautions
      ? [v.cautions]
      : [],
    highlight: idx === 0 ? "가장 유력한 후보!" : undefined,
  }));

/* ---------- 컴포넌트 ---------- */
function VisaRecommend({ userName = "Anna", onHome }) {
  const nav = useNavigate();
  const { state } = useLocation();
  const from = state?.from ?? "history";
  const raw = state?.raw ?? state?.recommendData ?? null;

  const [items, setItems] = useState([]);
  const [model, setModel] = useState({
    summary: "",
    recommendations: [],
    alternatives: [],
    cautions: [],
    __raw: null,
    __root: null,
  });

  useEffect(() => {
    const m = normalizeRaw(raw);
    debugPrintModel(raw, m);

    const mapped = toCards(m);
    if (import.meta.env.DEV) {
      console.log("[VisaRecommend] extracted length:", mapped.length);
    }

    setModel(m);
    setItems(mapped);
  }, [raw]);

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="relative w-full max-w-[360px] px-6 pt-16 pb-24">
        <button
          type="button"
          onClick={
            onHome ?? (() => nav("/visa-history", { state: { from } }))
          }
          className="absolute left-6 top-6 active:scale-[0.98]"
          aria-label="홈으로"
        >
          <img src={HomeIcon} alt="" className="w-6 h-6" />
        </button>

        <h1 className="text-[25px] font-extrabold text-gray-900 text-center">
          {userName} 님을 위한
          <br />
          최적의 비자
        </h1>

        <div className="mt-16">
          {items.length === 0 ? (
            <div className="text-center text-gray-600">
              추천 데이터를 불러오지 못했어요. (개발용) 콘솔의{" "}
              <b>[VisaRecommend] DEBUG</b> 그룹을 확인해 주세요.
            </div>
          ) : (
            <CardList items={items} from={from} raw={model} />
          )}
        </div>

        <div className="mt-12">
          <VisaMore raw={model} />
        </div>
      </section>
    </main>
  );
}

export default VisaRecommend;