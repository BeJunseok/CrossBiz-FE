import { FiExternalLink } from "react-icons/fi";
import IconButton from "./IconButton";

export default function MonthlyHighlightsCard({ groups=[] }) {
  return (
    <section className="mt-4 md:mt-6">
      <div className="mb-1.5 md:mb-3 flex items-center justify-between">
        <h1 className="text-[15px] md:text-base font-bold text-gray-900 pl-1.5">이번달 주요 세무일정</h1>
        <IconButton className="p-0.5 md:p-1.5">
          <svg className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>
          </svg>
        </IconButton>
      </div>

      <div className="rounded-lg md:rounded-2xl bg-white border border-gray-200 shadow-sm p-1.5 md:p-3">
        {groups.map((g, gi) => (
          <div key={gi} className="flex gap-2 md:gap-3 p-1.5 md:p-3">
            <div className="shrink-0 pt-0.5">
              <div className="w-6 h-6 md:w-10 md:h-10 rounded-full bg-blue-600 text-white grid place-items-center">
                <span className="text-[9px] md:text-[13px] font-bold leading-none">{g.day}일</span>
              </div>
            </div>

            <div className="w-px md:w-[2px] bg-gray-200 self-stretch rounded-full" />

            <div className="flex-1 space-y-0.5 md:space-y-1.5">
              {g.items.map((it, ii) => (
                <div key={ii} className="flex items-start gap-2.5 md:gap-2">
                  <p className="text-[11px] md:text-sm text-gray-900 leading-4 md:leading-5 truncate">{it}</p>
                  <FiExternalLink className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}