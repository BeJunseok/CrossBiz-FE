import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import RobotHi from "../../assets/RobotHi.svg";

/* 배열 보정 */
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

/* 표준화 */
const toModel = (rawLike) => {
  if (rawLike && typeof rawLike === "object") {
    const summary =
      rawLike.summary ??
      rawLike.__root?.summary ??
      rawLike.response?.summary ??
      "";
    if ("alternatives" in rawLike) {
      return { alternatives: asArray(rawLike.alternatives), summary };
    }
    if ("alternativeOptions" in rawLike) {
      return { alternatives: asArray(rawLike.alternativeOptions), summary };
    }
  }
  const root =
    rawLike?.response ?? rawLike?.result ?? rawLike?.data ?? rawLike ?? {};
  return {
    alternatives: asArray(root.alternativeOptions),
    summary: root?.summary ?? "",
  };
};

/* summary → 여러 줄로 */
const splitSummary = (s = "") => {
  if (!s) return [];
  const pieces = String(s)
    .replace(/\r/g, "")
    .split(/[\n]+|(?<=[.!?])\s+|·/g)
    .map((t) => t.trim())
    .filter(Boolean);

  const lines = [];
  for (const p of pieces) {
    if (p.length <= 60) lines.push(p);
    else {
      for (let i = 0; i < p.length; i += 60) lines.push(p.slice(i, i + 60));
    }
    if (lines.length >= 5) break;
  }
  return lines;
};

export default function VisaMore({ raw: rawProp }) {
  const { state } = useLocation();
  const incoming = rawProp ?? state?.raw ?? state?.recommendData ?? null;
  const model = useMemo(() => toModel(incoming), [incoming]);

  const extraVisas = useMemo(
    () =>
      model.alternatives.map((v) => ({
        name: v?.name ?? "미상 비자",
        qualification: Array.isArray(v?.qualification)
          ? v.qualification.filter(Boolean).join(" · ")
          : v?.qualification || "조건 정보 없음",
      })),
    [model.alternatives]
  );

  const aiLines = useMemo(() => {
    const fromSummary = splitSummary(model.summary);
    return fromSummary.length
      ? fromSummary
      : [
          "추천 결과를 바탕으로 다음 단계를 준비해 보세요.",
          "상세 안내는 각 카드의 안내 버튼에서 확인할 수 있어요.",
        ];
  }, [model.summary]);

  return (
    <section className="w-full">
      <h2 className="text-[20px] sm:text-[22px] font-semibold text-gray-900">
        추가적인 조건을 충족하면 가능한 비자 목록이에요.
      </h2>

      <div className="mt-4 grid gap-3">
        {extraVisas.map((v, idx) => (
          <div
            key={idx}
            className="rounded-2xl bg-white shadow-md px-5 py-4 border border-gray-100"
          >
            <div className="text-[15px] font-semibold text-gray-900 border-b pb-2">
              {v.name}
            </div>
            <div className="mt-1 text-[13px] leading-relaxed text-gray-600">
              {v.qualification}
            </div>
          </div>
        ))}
        {extraVisas.length === 0 && (
          <div className="text-[13px] text-gray-500">표시할 추가 옵션이 없어요.</div>
        )}
      </div>

      {/* AI 리포트 박스 */}
<div className="relative mt-20 overflow-visible">
  <img
    src={RobotHi}
    alt=""
    className="absolute z-10 left-3 -top-16 w-[64px] select-none pointer-events-none"
  />
  <div className="relative z-20 rounded-2xl p-5 shadow-xl text-white bg-gradient-to-b from-[#191D24] to-[#4D4C62]">
    {/* 제목 */}
    <div className="flex items-center text-[15px] sm:text-[16px] font-semibold">
      <span>💡AI 리포트</span>
    </div>

    {/* summary 내용 */}
    <div className="mt-3">
      {aiLines.map((line, i) => (
        <p
          key={i}
          className={`text-[11px] leading-[17px] whitespace-pre-line ${
            i > 0 ? "mt-1.5" : ""
          }`}
        >
          {line}
        </p>
      ))}
    </div>
  </div>
</div>
    </section>
  );
}