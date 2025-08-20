// src/components/DayDetail.jsx
import { useNavigate } from "react-router-dom";

const COLOR_TO_CODE = { red: 1, orange: 2, yellow: 3, green: 4, blue: 5 };
const COLOR_TO_COLOR =  { red: 1, orange: 2, yellow: 3, green: 4, blue: 5 };

export default function DayDetail({ date, items = [] }) {
  const nav = useNavigate();

  const label = date
    ? date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : "";

  const goEditByItem = (it) => {
    if (!date) return;
    nav("/schedule/new", {
      state: {
        preset: {
          dateISO: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            1, 0, 0, 0
          ).toISOString(),
          // 저장 직후 필드명이 title/name/text 중 무엇이든 들어와도 동작
          title: it?.title ?? it?.name ?? it?.text ?? "",
          code: COLOR_TO_CODE[it?.color] ?? null,
          office: it.office ?? "",
          fromArrow: true,
          eventId: it?.id ?? null,
        },
      },
    });
  };

  return (
    <section className="mt-2 md:mt-3">
      {date && (
        <div className="rounded-lg md:rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          {/* 헤더 */}
          <div className="px-2.5 md:px-4 py-2 md:py-3 flex items-center justify-between">
            <div className="inline-flex items-center rounded-lg md:rounded-xl px-2 py-0.5 md:px-3 md:py-1.5">
              <span className="text-[12px] md:text-sm font-extrabold text-purple-700">
                {label}
              </span>
            </div>
            {/* ✅ 상단 '수정' 버튼 완전 제거 */}
          </div>

          <div className="border-t border-gray-200" />

          {/* 리스트: 항상 렌더링 (없으면 비어있게) */}
          <ul className="px-2.5 md:px-4 divide-y divide-gray-100">
            {(items ?? []).map((it, idx) => {
              const displayTitle = it?.title ?? it?.name ?? it?.text ?? "(제목 없음)";
              const colorName = it?.color ?? COLOR_TO_COLOR[it?.code] ?? "blue";
              const dotClass =
                colorName === "green" ? "bg-[#00FF37]" :
                colorName === "red" ? "bg-[#FF0000]" :
                colorName === "orange" ? "bg-[#FF7B00]" :
                colorName === "yellow" ? "bg-[#FFF600]" :
                "bg-[#002FFF]";

              return (
                <li
                  key={it?.id ?? `day-item-${idx}`}
                  className="py-1.5 md:py-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5 md:gap-2 text-[12px] md:text-sm min-w-0">
                    <span
                      className={`inline-block rounded-full ${dotClass}`}
                      style={{ width: "0.4rem", height: "0.4rem" }}
                    />
                    <span className="text-gray-900 truncate">{displayTitle}</span>
                  </div>

                  {/* ✅ 우측 '>' 아이콘만 유지 */}
                  <button
                    onClick={() => goEditByItem(it)}
                    className="shrink-0 w-6 h-6 grid place-items-center rounded-full hover:bg-gray-100"
                    aria-label="edit"
                    title="편집"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M9 5l7 7-7 7"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}