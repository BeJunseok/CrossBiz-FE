// Calendar.jsx
import useMonthGrid from "../../hooks/useMonthGrid";
import { cx } from "../../utils/cx";
import { useNavigate } from "react-router-dom";
import { DAY_ARROW_ICONS } from "../../utils/arrows";

// 기본 고정값(미지정 시 사용)
const CARD_W  = 361;
const INNER_W = 329;
const GAP     = 4;
const CELL_W  = 47;
const CELL_H  = 80;
const LABEL_W = 28;
const LABEL_H = 20;
const RADIUS  = 6;

/** Date -> 'YYYY-MM-DD' */
const formatLocal = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
/** Date|string|null -> 'YYYY-MM-DD' */
const keyFrom = (v) => {
  if (!v) return null;
  if (typeof v === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    const d = new Date(v);
    return isNaN(d) ? null : formatLocal(d);
  }
  return formatLocal(v);
};

export default function Calendar({
  year,
  month,
  dayEvents = {},   // {'YYYY-MM-DD': [1,3,5]} 형태 (1~5는 색상코드)
  selected,
  onSelect,
  onPrev,
  onNext,
  hideTitle = false,
  hidePurple = false,   // 오늘 연보라 배경 숨김
  fitContainer = false, // 캘린더 영역을 부모폭에 맞춤
}) {
  const cells = useMonthGrid(year, month);
  const weeks = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const nav = useNavigate();

  const todayKey = keyFrom(new Date());
  const selKey   = keyFrom(selected);

  const cardW  = fitContainer ? "100%" : CARD_W;
  const innerW = fitContainer ? "100%" : INNER_W;

  return (
    <section className={hideTitle ? "mt-0 md:mt-0" : "mt-4 md:mt-6"}>
      {!hideTitle && (
        <>
          <div className="border-t border-gray-200 mb-2 md:mb-3" />
          <div className="flex items-center justify-between mb-3" style={{ width: cardW }}>
            <h2 className="text-[15px] md:text-base font-bold text-gray-900 pl-1.5">My 세무 캘린더</h2>
            <button
              type="button"
              aria-label="add"
              className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[17px] leading-none shadow-md hover:bg-gray-800 active:scale-95"
              onClick={() => nav("/schedule/new")}
            >+</button>
          </div>
        </>
      )}

      <div className="bg-white shadow-sm" style={{ width: cardW, padding: 12, borderRadius: 0 }}>
        {/* 헤더 */}
        <div className="flex items-center justify-between" style={{ width: innerW }}>
          <div className="font-extrabold tracking-tight" style={{ fontSize: 20, marginBottom: 4 }}>
            {new Date(year, month, 1).toLocaleString("en-US", { month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center" style={{ gap: 8 }}>
            <button onClick={onPrev} className="rounded-full bg-gray-100 grid place-items-center" style={{ width: 32, height: 32 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button onClick={onNext} className="rounded-full bg-gray-100 grid place-items-center" style={{ width: 32, height: 32 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* 요일 */}
        <div
          className="text-center font-semibold text-gray-700"
          style={{
            width: innerW,
            display: "grid",
            gridTemplateColumns: fitContainer ? "repeat(7, 1fr)" : `repeat(7, ${CELL_W}px)`,
            columnGap: GAP, rowGap: 0,
            fontSize: 12, height: 24, alignItems: "center", marginTop: 8,
          }}
        >
          {weeks.map((w) => <div key={w} style={{ lineHeight: "24px" }}>{w}</div>)}
        </div>

        {/* 날짜 그리드 */}
        <div
          style={{
            width: innerW,
            display: "grid",
            gridTemplateColumns: fitContainer ? "repeat(7, 1fr)" : `repeat(7, ${CELL_W}px)`,
            columnGap: GAP, rowGap: GAP, marginTop: 8,
          }}
        >
          {cells.map((c) => {
            const key       = c.date ? keyFrom(c.date) : null;
            const isSel     = !!selKey && key === selKey;
            const isToday   = key === todayKey && !c.outside;
            const showPurple= isToday && !hidePurple;

            const asCode = (v) => {
              const n = Number(v);
              return Number.isFinite(n) && n>=1 && n<=5 ? n : null;
            };
            const icons = key ? (dayEvents[key] || []).map(asCode).filter(Boolean).map((code)=> DAY_ARROW_ICONS[code]).filter(Boolean) : [];

            return (
              <button
                key={c.key}
                disabled={!c.date}
                onClick={() => c.date && onSelect?.(c.date)}
                className={cx("text-gray-900", c.outside && "text-gray-300")}
                style={{
                  width: fitContainer ? "100%" : CELL_W,
                  height: CELL_H,
                  backgroundColor: showPurple
                    ? "rgba(139,92,246,0.15)"
                    : (c.outside ? "#F9FAFB" : "#FFFFFF"),
                  border: "none",
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                {/* 날짜 라벨 */}
                <div
                  style={{
                    width: "100%",
                    height: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSel ? (
                    <div
                      style={{
                        width: LABEL_W,
                        height: LABEL_H,
                        backgroundColor: "#2563EB",
                        color: "#FFFFFF",
                        borderRadius: RADIUS,
                        fontSize: 12,
                        fontWeight: 600,
                        lineHeight: `${LABEL_H}px`,
                        textAlign: "center",
                      }}
                    >
                      {c.day}
                    </div>
                  ) : (
                    <span className="text-gray-600" style={{ fontSize: 12, fontWeight: 500 }}>
                      {c.day}
                    </span>
                  )}
                </div>

                {/* ⬇️ 날짜 아래 화살표(44x16)들을 세로로 쌓아서 표시 */}
                <div
                  style={{
                    flex: 1,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: 3,                 // 아이콘 사이 간격
                    paddingTop: 4,
                    paddingLeft: 2,
                    overflow: "hidden",     // 너무 많을 때 넘침 방지
                  }}
                >
                  {icons.slice(0, 3).map((icon, i) => (
                    <img
                      key={i}
                      src={icon.src}
                      width={icon.w}
                      height={icon.h}
                      alt=""
                      draggable={false}
                      style={{ display: "block", objectFit: "contain" }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}