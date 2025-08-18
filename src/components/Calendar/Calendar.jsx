import useMonthGrid from "../../hooks/useMonthGrid";
import { cx } from "../../utils/cx";
import EventBars from "./Eventbars";
import { useNavigate } from "react-router-dom";

export default function Calendar({ year, month, dayEvents={}, selected, onSelect, onPrev, onNext,hideTitle = false, }) {
  const cells = useMonthGrid(year, month);
  const weeks = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  const nav = useNavigate();

  const outerGap = hideTitle ? "mt-0 md:mt-0" : "mt-4 md:mt-6";
  const cardGap = hideTitle ? "mt-0" : "mt-2";

  return (
    <section className={outerGap}>
    {!hideTitle && (
    <>
      <div className="border-t border-gray-200 mb-2 md:mb-3" />
      <div className="flex items-center justify-between mb-3">
      <h2 className="text-[15px] md:text-base font-bold text-gray-900 pl-1.5">My 세무 캘린더</h2>
      <button 
        type="button"
        aria-label="add"
        className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-900 text-white text-[17px]
        leading-none shadow-md hover:bg-gray-800 active:scale-95 mr-1"
        onClick={()=>nav("/schedule/new")}
        >+</button>
      </div>
    </>
    )}
      <div className={`${cardGap} rounded-[14px] md:rounded-[24px] bg-white shadow-sm p-2.5 md:p-4`}>
        <div className="flex items-center justify-between">
          <div className="text-base md:text-xl font-extrabold tracking-tight mb-1">
            {new Date(year, month, 1).toLocaleString("en-US", { month: "long", year: "numeric" })}
          </div>
          <div className="flex items-center gap-2.5 md:gap-2">
            <button onClick={onPrev} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 grid place-items-center">
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button onClick={onNext} className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gray-100 grid place-items-center">
              <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <div className="mt-1 md:mt-2 grid grid-cols-7 text-center text-[9px] md:text-[11px] font-semibold text-gray-500">
          {weeks.map((w) => <div key={w} className="py-0.5 md:py-1">{w}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-0.5 md:gap-1 mt-1">
          {cells.map((c) => {
            const key = c.date ? c.date.toISOString().slice(0,10) : null;
            const bars = key && dayEvents[key] ? dayEvents[key] : [];
            const isSel = selected && key === selected.toISOString().slice(0,10);

            return (
              <button
                key={c.key}
                disabled={!c.date}
                onClick={() => c.date && onSelect?.(c.date)}
                className={cx(
                  "h-12 md:h-16 rounded-lg md:rounded-2xl flex flex-col items-center justify-center",
                  c.outside ? "bg-gray-50 text-gray-300" : "bg-white text-gray-900"
                )}
              >
                <span
                  className={cx(
                    "flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full text-[10px] md:text-xs font-bold mb-0.5",
                    isSel && "bg-purple-600 text-white"
                  )}
                >
                  {c.day}
                </span>
                {!c.outside && <EventBars bars={bars} />}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}