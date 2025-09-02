// src/pages/Visa/VisaMore.jsx
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import RobotHi from "../../assets/RobotHi.svg";

/* --- 공용 유틸: 배열 보정 --- */
const asArray = (v) => {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "object") {
    const ks = Object.keys(v);
    // {0:{},1:{}} 형태 → 배열
    if (ks.length && ks.every((k) => /^\d+$/.test(k))) {
      return ks.sort((a, b) => +a - +b).map((k) => v[k]);
    }
  }
  return [];
};

/* --- 입력 표준화: VisaRecommend에서 내려준 model 우선 --- */
const toModel = (rawLike) => {
  // ✅ 표준 모델 그대로 받으면 바로 사용
  if (rawLike && typeof rawLike === "object") {
    if ("alternatives" in rawLike) {
      return { alternatives: asArray(rawLike.alternatives) };
    }
    // 혹시 모델이 alternativeOptions로 내려오는 경우까지 커버
    if ("alternativeOptions" in rawLike) {
      return { alternatives: asArray(rawLike.alternativeOptions) };
    }
  }

  // ✅ 레거시/직접진입 대비: response/result/data 루트에서 읽기
  const root =
    rawLike?.response ?? rawLike?.result ?? rawLike?.data ?? rawLike ?? {};
  return { alternatives: asArray(root.alternativeOptions) };
};

export default function VisaMore({ raw: rawProp }) {
  const { state } = useLocation();
  // 우선순위: prop(model) → location.state.raw/model → fallback null
  const incoming = rawProp ?? state?.raw ?? state?.recommendData ?? null;
  const model = useMemo(() => toModel(incoming), [incoming]);

  // name + qualification만 추출
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

  // 화면 출처에 따라 문구만 다르게
  const from = state?.from ?? "history";
  const aiRoutes =
    from === "match"
      ? [
          "단기적으로는 무비자/임시 체류에서 점수·자격요건 충족",
          "오아시스/특허 가점 활용해 D-8-4 또는 유사 비자 검토",
          "사업 실적과 고용 창출 후 F-2/F-5로 스텝업",
        ]
      : [
          "단기적으로는 D-8-4 신청(특허/오아시스 점수 활용)",
          "사업 성과와 고용 실적을 쌓아 F-2-7 또는 F-5-22로 전환",
          "장기적으로는 영주권(F-5) 또는 귀화까지 고려",
        ];

  if (import.meta.env.DEV) {
    console.groupCollapsed(
      "%c[VisaMore] alternatives",
      "background:#111;color:#87cefa;padding:2px 6px;border-radius:4px;"
    );
    console.log("incoming:", incoming);
    console.log("model.alternatives.length:", model.alternatives.length);
    console.table(extraVisas.slice(0, 5));
    console.groupEnd();
  }

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
          <div className="text-[13px] text-gray-500">
            표시할 추가 옵션이 없어요.
          </div>
        )}
      </div>

      <div className="relative mt-20 overflow-visible">
        <img
          src={RobotHi}
          alt=""
          className="absolute z-10 left-3 -top-16 w-[64px] select-none pointer-events-none"
        />
        <div className="relative z-20 rounded-2xl p-5 shadow-xl text-white bg-gradient-to-b from-[#191D24] to-[#4D4C62]">
          <div className="flex items-center text-[16px] sm:text-[17px] font-semibold">
            <span>💡AI 추천 경로</span>
          </div>
          <ul className="mt-3 space-y-2">
            {aiRoutes.map((line, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-3.5 h-3.5 mt-[2px] shrink-0">➜</span>
                <span className="text-[11px] leading-relaxed">{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}