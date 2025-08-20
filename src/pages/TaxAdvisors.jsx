import { useMemo, useState } from "react";
import { 
  ADVISORS,
  INDUSTRY_OPTIONS,
  LANGUAGE_OPTIONS,
  SORT_OPTIONS,
} from "../data/taxAdvisors"; 
import { useNavigate } from "react-router-dom";


const cx = (...a) => a.filter(Boolean).join(" ");

export default function TaxAdvisors() {

  const [industry, setIndustry] = useState("");
  const [lang, setLang] = useState("");
  const [sort, setSort] = useState("hire");
  const nav = useNavigate();
  const getLabel = (opts, v) => opts.find(o => o.value === v)?.label ?? opts[0]?.label ?? "";

  const list = useMemo(() => {
    let arr = [...ADVISORS];
    const ind = industry.trim();
    const lg = lang.trim();
    

    if (ind) arr = arr.filter((x) => x.industries?.includes(ind));
    if (lg)  arr = arr.filter((x) => x.languages?.includes(lg));

    if (sort === "hire") {
      arr.sort((a, b) => (b.hireCount ?? 0) - (a.hireCount ?? 0));
    } else if (sort === "new") {
      arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return arr;
  }, [industry, lang, sort]);

  return (
    <div className="mt-10 border-t border-gray-300">
      <h2 className="text-[15px] md:text-base font-bold text-gray-900 pl-1.5 mt-4">
        세무상담사 추천
      </h2>

      
      <div className="mt-2 flex items-center justify-between gap-3 bg-white rounded-2xl shadow-sm border border-gray-200 py-1">

        <section className="flex items-center gap-1.5">
    
          <div className="relative inline-flex items-center h-8 rounded-full bg-black text-white px-3">
           
            <span className="text-sm leading-none whitespace-nowrap pr-4">
              {getLabel(INDUSTRY_OPTIONS, industry)}
            </span>
        
            <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-80"
                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.25 7.5L10 12.25 14.75 7.5" stroke="currentColor" strokeWidth="1.8" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
           
            <select
              aria-label="업종"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="select-overlay absolute inset-0 w-full h-full cursor-pointer"
            >
              {INDUSTRY_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

         
          <div className="relative inline-flex items-center h-8 rounded-full bg-black text-white px-3">
            <span className="text-sm leading-none whitespace-nowrap pr-4">
              {getLabel(LANGUAGE_OPTIONS, lang)}
            </span>
            <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-80"
                viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path d="M5.25 7.5L10 12.25 14.75 7.5" stroke="currentColor" strokeWidth="1.8" fill="none"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <select
              aria-label="가능 언어"
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="select-overlay absolute inset-0 w-full h-full cursor-pointer"
            >
              {LANGUAGE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </section>

       
        <div className="relative inline-flex items-center h-8 rounded-full bg-white text-gray-900 px-3 mr-2.5">
          
          <span className="text-sm leading-none whitespace-nowrap pr-4">
            {SORT_OPTIONS.find(o => o.value === sort)?.label}
          </span>
     
          <svg
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-60"
            viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
          >
            <path
              d="M5.25 7.5L10 12.25 14.75 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
     
          <select
            aria-label="정렬"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="select-overlay absolute inset-0 w-full h-full cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      <section className="mt-2.5 rounded-2xl bg-white border border-gray-200 shadow-sm">
        {list.map((it, idx) => (
          <article
            key={`${it.id}-${idx}`}
            className={cx(
              "px-4 py-4 flex gap-3 items-start transition-transform duration-200 ease-in-out hover:scale-105 cursor-pointer",
              idx !== list.length - 1 && "border-b border-gray-100"
            
            )}
            onClick={()=> nav("/recommend",{
              state :{
                  name: it.name,
                  langs: it.langs || ["영어","중국어"],
              },
            })
            }
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-extrabold text-gray-900 truncate">
                {it.name}
              </h3>

              <div className="mt-0.5 text-sm">
                <span className="text-blue-700 font-semibold">
                  {it.headline || (it.languages?.join(", ") + " 가능")}
                </span>
                <span className="mx-1.5 text-gray-400">·</span>
                <span className="text-gray-700">
                  {it.industries?.join(", ")}
                </span>
              </div>

              <p className="mt-1 text-sm text-gray-600 line-clamp-1">
                {it.bio}
              </p>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {it.tags?.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full bg-gray-100 text-gray-800 text-xs px-2.5 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-14 h-14 rounded-xl bg-gray-100 shrink-0" />
          </article>
        ))}
      </section>
    </div>
  );
}