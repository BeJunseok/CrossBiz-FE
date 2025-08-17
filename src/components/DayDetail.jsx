import { FiExternalLink } from "react-icons/fi";

export default function DayDetail({ date, items = [], warning }) {
  const label = date
    ? date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    : "";

  return (
    <section className="mt-2 md:mt-3">
      {/* ✅ 라벨 + 구분선 + 리스트가 모두 같은 카드 내부 */}
      {date && (
        <div className="rounded-lg md:rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          {/* 헤더 (라벨 + 수정) */}
          <div className="px-2.5 md:px-4 py-2 md:py-3 flex items-center justify-between">
            <div className="inline-flex items-center rounded-lg md:rounded-xl px-2 py-0.5 md:px-3 md:py-1.5">
              <span className="text-[12px] md:text-sm font-extrabold text-purple-700">
                {label}
              </span>
            </div>
            <button className="px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-[10px] md:text-xs text-gray-600 bg-gray-100 hover:bg-gray-200">
              수정
            </button>
          </div>

          {/* 카드 내부 구분선 */}
          <div className="border-t border-gray-200" />

          {/* 리스트 (같은 카드 내부) */}
          {items.length > 0 && (
            <ul className="px-2.5 md:px-4 divide-y divide-gray-100">
              {items.map((it) => (
                <li
                  key={it.id}
                  className="py-1.5 md:py-2.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5 md:gap-2 text-[12px] md:text-sm min-w-0">
                    <span
                      className={`inline-block rounded-full ${
                        it.color === "green"
                          ? "bg-green-500"
                          : it.color === "red"
                          ? "bg-[#D40000]/60"
                          : "bg-purple-500"
                      }`}
                      style={{ width: "0.4rem", height: "0.4rem" }}
                    />
                    <span className="text-gray-900 truncate">{it.text}</span>
                  </div>
                  <button className="px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[10px] md:text-xs font-semibold bg-purple-600 text-white shrink-0">
                    {it.cta ?? "납부"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* 경고 배너는 별도 카드로 아래 유지 */}
      {warning && (
        <div className="mt-2.5 md:mt-3 flex items-center justify-between rounded-xl md:rounded-2xl shadow-md bg-[#D40000]/60 text-white p-2.5 md:p-4">
          <div className="flex items-center gap-2 md:gap-3">
            <svg
              className="w-4 h-4 md:w-5 md:h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M12 3l9 16H3L12 3z" strokeWidth="2" />
              <path d="M12 9v5" strokeWidth="2" />
              <circle cx="12" cy="17" r="1.2" fill="currentColor" />
            </svg>
            <p className="text-[12px] md:text-sm font-semibold">{warning}</p>
          </div>
          <button className="px-2.5 py-1   rounded-xl shadow-lg bg-white grid place-items-center cursor:scale-105">
            <FiExternalLink className="w-4 h-4 text-[#D40000]/60" />
          </button>
        </div>
      )}
    </section>
  );
}