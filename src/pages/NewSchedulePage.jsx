// src/pages/NewSchedulePage.jsx
import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar/Calendar";
import { DEFAULT_ICON_24, PALETTE, SELECT_ICONS } from "../utils/arrows";
import { addEvent, removeEventById } from "../utils/eventStore";

const IconChevronLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const weekday = ["일","월","화","수","목","금","토"];
const CODE_TO_COLOR = {1: "red", 2:"orange", 3: "yellow", 4: "green", 5: "blue"};

const splitDateParts = (isoLike) => {
  const d = new Date(isoLike);
  const y = d.getFullYear();
  const m = `${d.getMonth()+1}`.padStart(2,"0");
  const day = `${d.getDate()}`.padStart(2,"0");
  const wd = weekday[d.getDay()];
  const hh = `${d.getHours()}`.padStart(2,"0");
  const mm = `${d.getMinutes()}`.padStart(2,"0");
  return { left: `${y}년 ${m}월 ${day}일 (${wd})`, right: `${hh}:${mm}` };
};
const toYMD = (d) =>
  `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, "0")}-${`${d.getDate()}`.padStart(2, "0")}`;

function TimeWheelPopover({ anchorRef, valueHHmm = "00:00", onChange, onClose }) {
  const popRef = useRef(null);
  useEffect(() => {
    const handle = (e) => {
      if (!popRef.current || !anchorRef.current) return;
      if (!popRef.current.contains(e.target) && !anchorRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  const [H, M] = valueHHmm.split(":").map(n => parseInt(n || "0", 10));
  const initHour = Number.isFinite(H) ? Math.min(23, Math.max(0, H)) : 0;
  const initMin  = Number.isFinite(M) ? Math.min(55, Math.max(0, M - (M % 5))) : 0;

  const hours   = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const Col = ({ values, selected, onPick, widthClass = "w-[70px]" }) => {
    const ref = useRef(null);
    const itemHRef = useRef(36);
    const viewHRef = useRef(180);
    const padRef   = useRef(72);

    useEffect(() => {
      const measure = () => {
        const item = ref.current?.querySelector("[data-wheel-item]");
        const box  = ref.current;
        if (item) itemHRef.current = item.getBoundingClientRect().height || 36;
        if (box)  viewHRef.current = box.getBoundingClientRect().height || 180;
        padRef.current = Math.max(0, viewHRef.current / 2 - itemHRef.current / 2);
        const idx = Math.max(0, values.indexOf(selected));
        if (box) box.scrollTop = idx * itemHRef.current;
      };
      requestAnimationFrame(measure);
    }, []);

    const clampIdx = (idx) => Math.min(Math.max(idx, 0), values.length - 1);
    const onScroll = (e) => {
      const box = e.currentTarget;
      const idx = clampIdx(Math.round((box.scrollTop) / itemHRef.current));
      onPick(values[idx]);
    };

    return (
      <div ref={ref} className={`h-[180px] overflow-y-auto no-scrollbar ${widthClass}`} onScroll={onScroll} style={{ scrollbarWidth: "none" }}>
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none;}`}</style>
        <div style={{ height: 72 }} aria-hidden />
        {values.map((v, i) => (
          <button key={i} type="button" data-wheel-item className={`h-9 w-full flex items-center justify-center text-[14px] ${v === selected ? "font-semibold text-gray-900" : "text-gray-900"}`} onClick={() => onPick(v)}>
            {`${v}`.padStart(2, "0")}
          </button>
        ))}
        <div style={{ height: 72 }} aria-hidden />
      </div>
    );
  };

  const [hour, setHour] = useState(initHour);
  const [min,  setMin]  = useState(initMin);
  useEffect(() => { onChange?.(`${`${hour}`.padStart(2,"0")}:${`${min}`.padStart(2,"0")}`); }, [hour, min, onChange]);

  const rect = anchorRef.current?.getBoundingClientRect();
  const style = rect ? {
    position: "fixed",
    top: Math.min(window.innerHeight - 208, rect.bottom + 8),
    left: Math.min(window.innerWidth - 208, Math.max(8, rect.right - 200)),
    zIndex: 60
  } : {};

  return (
    <div ref={popRef} style={style} className="w-[200px] rounded-xl border border-gray-200 bg-white shadow-lg p-3 relative">
      <div className="pointer-events-none absolute left-3 right-3 top-[calc(50%-18px)] h-9 rounded-md bg-gray-100" />
      <div className="flex gap-2 relative">
        <Col values={Array.from({length:24},(_,i)=>i)} selected={hour} onPick={setHour} />
        <Col values={Array.from({length:12},(_,i)=>i*5)} selected={min}  onPick={setMin}  />
      </div>
    </div>
  );
}

function OfficeSelectDown({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const selected = value || "";
  return (
    <div ref={wrapRef} className="relative mb-3 rounded-xl border border-gray-200 bg-white shadow-md">
      <button type="button" onClick={() => setOpen(v => !v)} className="flex w-full items-center justify-between rounded-xl px-3 py-3">
        <span className={`text-[15px] ${selected ? "font-semibold text-gray-900" : "text-gray-400"}`}>{selected || "조세처"}</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="px-3 py-2 text-[13px] text-gray-500">조세처</div>
          <ul className="max-h-60 overflow-auto">
            {options.map((label) => (
              <li key={label}>
                <button type="button" onClick={() => { onChange(label); setOpen(false); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[15px] text-gray-900">
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function NewSchedulePage() {
  const nav = useNavigate();
  const { state } = useLocation();
  const preset = state?.preset; // { dateISO, title, code, office? }

  useLayoutEffect(() => window.scrollTo(0, 0), []);

  // 초기값: preset을 최우선으로 적용
  const presetDate = preset?.dateISO ? new Date(preset.dateISO) : new Date();
  const defStart = new Date(presetDate.getFullYear(), presetDate.getMonth(), presetDate.getDate(), 0, 0);
  const defEnd   = new Date(presetDate.getFullYear(), presetDate.getMonth(), presetDate.getDate(), presetDate.getHours() || 1, presetDate.getMinutes() || 0);

  const editingId = preset?.eventId ?? null;
  const fromArrow = !!preset?.fromArrow;

  const [arrowCode, setArrowCode] = useState(
    Number.isFinite(preset?.code) ? preset.code : null
  );
  const [paletteOpen, setPaletteOpen] = useState(false);
  const paletteBtnRef = useRef(null);
  const paletteWrapRef = useRef(null);

  const [title, setTitle] = useState(preset?.title ?? "");
  const [start, setStart] = useState(defStart.toISOString().slice(0, 16));
  const [end, setEnd]     = useState(defEnd.toISOString().slice(0, 16));
  const [office, setOffice] = useState(preset?.office ?? ""); // ✅ 프리셋의 조세처 반영

  const [openEndTime, setOpenEndTime] = useState(false);
  const [endView, setEndView] = useState(new Date(end));
  const timeAnchorRef = useRef(null);

  useEffect(() => {
    if (!paletteOpen) return;
    const close = (e) => {
      if (!paletteWrapRef.current || !paletteBtnRef.current) return;
      if (!paletteWrapRef.current.contains(e.target) && !paletteBtnRef.current.contains(e.target)) setPaletteOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [paletteOpen]);

  const isValid = useMemo(
    () => title.trim() !== "" && !!end && office.trim() !== "" && arrowCode != null,
    [title, end, office, arrowCode]
  );

  const onSave = () => {
    if (!isValid) return;
    const payload = {
      date: toYMD(new Date(end)),
      code: arrowCode,
      color: CODE_TO_COLOR[arrowCode],
      title: title.trim(),
      text: title.trim(),
      startISO: new Date(start).toISOString(),
      endISO:   new Date(end).toISOString(),
      office, // ✅ 저장
    };
    addEvent(payload);
    nav(-1);
  };
  // ✅ 폼 리셋 유틸
   const resetForm = () => {
   const now = new Date();
   const s = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0)
                 .toISOString().slice(0,16);
   const e = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0)
                 .toISOString().slice(0,16);
   setArrowCode(null);
   setTitle("");
   setOffice("");
   setStart(s);
   setEnd(e);
   setEndView(new Date(e));
 };

 // ✅ 삭제 버튼 핸들러
 const onDelete = () => {
   // 화살표/리스트에서 편집으로 들어온 경우: 저장돼 있던 이벤트 삭제
   if (fromArrow && editingId) {
     removeEventById(editingId);
   }
   // 폼 리셋 후 이전 화면으로
   resetForm();
   nav(-1);
 };

  

  const endParts = splitDateParts(end);
  const [endDate, endTime] = end.split("T");

  return (
    <div className="w-full min-h-screen bg-[#f3f3f3]">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
        <button onClick={() => nav(-1)} aria-label="back" className="text-gray-900"><IconChevronLeft /></button>
        <h1 className="text-[17px] font-semibold text-gray-900">새 일정</h1>
        <button onClick={onSave} disabled={!isValid} className={`text-[15px] font-semibold ${isValid ? "text-blue-600" : "text-gray-300"}`}>저장</button>
      </header>

      <main className="px-4 pt-4 pb-24">
        {/* 색상 */}
        <div className="mb-3 relative rounded-xl border border-gray-200 p-3 bg-white shadow-md">
          <div className="flex items-center justify-between">
            <div className="text-[13px] text-gray-500">캘린더 색상</div>
            <button
              ref={paletteBtnRef}
              type="button"
              onClick={() => setPaletteOpen(v => !v)}
              aria-label="색상 선택"
              className="h-6 w-6 rounded-full overflow-hidden"
            >
              <img src={arrowCode ? SELECT_ICONS[arrowCode] : DEFAULT_ICON_24} width={24} height={24} alt="" draggable={false} />
            </button>
          </div>

          {paletteOpen && (
            <div ref={paletteWrapRef} className="absolute right-3 top-[42px] z-[60] bg-white border border-gray-200 shadow-md rounded-lg px-3" style={{ width: 206, height: 42 }}>
              <div className="h-full w-full flex items-center justify-between">
                {PALETTE.map(({ code, icon }) => (
                  <button key={code} type="button" onClick={() => { setArrowCode(code); setPaletteOpen(false); }} style={{ width: 24, height: 24, borderRadius: 12, overflow: "hidden" }} aria-label={`color-${code}`}>
                    <img src={icon} width={24} height={24} alt="" draggable={false} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 제목 */}
        <div className="mb-3 rounded-xl border border-gray-200 p-3 bg-white shadow-md">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="제목" className="w-full bg-transparent text-[15px] text-gray-900 placeholder-gray-400 outline-none" />
        </div>

        {/* 날짜/시간 + 항상 보이는 캘린더 */}
        <div className="mb-3 rounded-xl border border-gray-200 bg-white shadow-md">
          <div className="flex w-full items-center gap-3 px-3 py-3">
            <span className="w-[40px] text-left text-[13px] text-gray-900">마감일</span>
            <div className="ml-auto flex min-w-0 items-center gap-2 text-right">
              <span className="truncate rounded-md bg-gray-100 px-2 py-1 text-[13px] text-gray-900">{endParts.left}</span>
              <button ref={timeAnchorRef} type="button" onClick={() => setOpenEndTime(v => !v)} className="rounded-md bg-gray-100 px-2 py-1 text-[13px] text-gray-900">
                {endParts.right}
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200" />

          <div className="px-0 pb-2">
            <Calendar
              hideTitle
              hidePurple
              fitContainer
              year={endView.getFullYear()}
              month={endView.getMonth()}
              dayEvents={{}}
              selected={new Date(endDate)}
              onSelect={(d) => {
                const newEnd = `${toYMD(d)}T${endTime || "00:00"}`;
                setEnd(newEnd);
                setEndView(new Date(d));
              }}
              onPrev={() => setEndView(new Date(endView.getFullYear(), endView.getMonth() - 1, 1))}
              onNext={() => setEndView(new Date(endView.getFullYear(), endView.getMonth() + 1, 1))}
            />
          </div>
          <div className="border-t border-gray-200" />

          {openEndTime && (
            <TimeWheelPopover
              anchorRef={timeAnchorRef}
              valueHHmm={endTime}
              onChange={(hhmm) => setEnd(`${endDate}T${hhmm}`)}
              onClose={() => setOpenEndTime(false)}
            />
          )}
        </div>

        <OfficeSelectDown
          value={office}
          onChange={setOffice}
          options={["홈택스 (국세청)", "위택스", "ETAX (서울시)", "4대 사회보험 연계센터", "UNI-PASS (관세청)", "기타"]}
        />

        {/* 삭제 버튼(그냥 이전으로) */}
        <div className="mt-3">
          <button 
          type="button" 
          onClick={onDelete} 
          className="w-full rounded-xl border text-red-600 bg-white py-3 text-[15px] font-semibold active:scale-[0.99] shadow-md">
            일정 삭제
          </button>
        </div>
      </main>
    </div>
  );
}