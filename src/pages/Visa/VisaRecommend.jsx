// src/pages/Visa/VisaRecommend.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HomeIcon from "@/assets/Home.svg";
import CardList from "../../components/CardList";
import VisaMore from "./VisaMore";
import { getUserProfile } from "@/api/auth/Auth";

/* ---------- 파싱 유틸 ---------- */
const stripBOM = (s) =>
  typeof s === "string" && s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
const deSmartQuote = (s) =>
  typeof s === "string" ? s.replace(/[“”]/g, '"').replace(/[‘’]/g, "'") : s;
const looseJsonParse = (maybeStr) => {
  if (typeof maybeStr !== "string") return maybeStr;
  let s = stripBOM(deSmartQuote(maybeStr)).trim();
  const start = Math.min(
    ...["{", "["].map((ch) =>
      s.indexOf(ch) >= 0 ? s.indexOf(ch) : Infinity
    )
  );
  const end = Math.max(s.lastIndexOf("}"), s.lastIndexOf("]"));
  if (start !== Infinity && end > start) s = s.slice(start, end + 1);
  s = s.replace(/,\s*([}\]])/g, "$1");
  try {
    return JSON.parse(s);
  } catch {
    return maybeStr;
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
  let v = typeof raw === "string" ? looseJsonParse(raw) : raw;

  const unwrapOnce = (x) => {
    if (!x || typeof x !== "object") return x;
    if (x.data && Object.keys(x).length === 1) return x.data;
    if (x.response && Object.keys(x).length === 1) return x.response;
    if (x.result && Object.keys(x).length === 1) return x.result;
    if (typeof x.json === "string") return looseJsonParse(x.json);
    return x;
  };
  v = unwrapOnce(unwrapOnce(v));

  const root =
    v && typeof v === "object" ? v.response ?? v.result ?? v.data ?? v : {};

  // ✅ summary는 여기서 유지만 하고, VisaRecommend에서는 사용/표시하지 않음
  return {
    summary: root?.summary ?? "",
    recommendations: asArray(root?.recommendedVisas),
    alternatives: asArray(root?.alternativeOptions),
    cautions: asArray(root?.visaCautions),
    __raw: raw,
    __root: root,
  };
};

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
function VisaRecommend() {
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

  const [displayName, setDisplayName] = useState(
    state?.userName ?? state?.basicInfo?.name 
  );

  // ✅ 사용자 이름을 서버에서 가져와 타이틀에 사용 (state보다 우선)
  useEffect(() => {
    (async () => {
      try {
        const me = await getUserProfile();
        if (me?.name) setDisplayName(me.name);
      } catch {
        /* ignore: fallback으로 state/Anna 사용 */
      }
    })();
  }, []);

  useEffect(() => {
    const m = normalizeRaw(raw);
    setModel(m);
    setItems(toCards(m));
  }, [raw]);

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="relative w-full max-w-[360px] px-6 pt-16 pb-24">
        <button
          type="button"
          onClick={() =>
            nav("/visa-history", { state: { from,raw:model, userName: displayName } })
          }
          className="absolute left-6 top-6 active:scale-[0.98]"
          aria-label="홈으로"
        >
          <img src={HomeIcon} alt="" className="w-6 h-6" />
        </button>

        {/* ✅ 이름만 타이틀에 사용 */}
        <h1 className="text-[25px] font-extrabold text-gray-900 text-center">
          {displayName} 님을 위한
          <br />
          최적의 비자
        </h1>

        {/* ✅ 카드만 표시 (summary 관련 렌더링/텍스트 없음) */}
        <div className="mt-16">
          {items.length === 0 ? (
            <div className="text-center text-gray-600">
              추천 데이터를 불러오지 못했어요.
            </div>
          ) : (
            <CardList items={items} from={from} raw={model} />
          )}
        </div>

        {/* ✅ summary는 VisaMore에서만 사용/표시 */}
        <div className="mt-12">
          <VisaMore raw={model} />
        </div>
      </section>
    </main>
  );
}

export default VisaRecommend;