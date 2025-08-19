// src/pages/NewSchedulePage.jsx
import React, { useLayoutEffect, useMemo, useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "../components/Calendar/Calendar";

const IconChevronLeft = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <path d="M15 19L8 12L15 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const weekday = ["일","월","화","수","목","금","토"];
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

const COLORS = ["#111827","#2563EB","#059669","#F59E0B","#EF4444","#8B5CF6","#06B6D4","#C084FC"];
const toYMD = (d) => `${d.getFullYear()}-${`${d.getMonth()+1}`.padStart(2,"0")}-${`${d.getDate()}`.padStart(2,"0")}`;

/* ===== 시간 휠 팝오버(아래로 뜨는 드롭다운 스타일) : 24시간 + 분(5분 단위) ===== */
function TimeWheelPopover({ anchorRef, valueHHmm = "00:00", onChange, onClose }) {
  const popRef = useRef(null);

  // 바깥 클릭 닫기
  useEffect(() => {
    const handle = (e) => {
      if (!popRef.current || !anchorRef.current) return;
      if (!popRef.current.contains(e.target) && !anchorRef.current.contains(e.target)) onClose?.();
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  // 초기 값 파싱
  const [H, M] = valueHHmm.split(":").map(n => parseInt(n || "0", 10));
  const initHour = Math.min(23, Math.max(0, isNaN(H) ? 0 : H));
  const initMin  = Math.min(55, Math.max(0, isNaN(M) ? 0 : M - (M % 5)));

  // 리스트 데이터
  const hours   = Array.from({ length: 24 }, (_, i) => i);         // 00..23
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);     // 00..55

  /* 공통 컬럼 — 중앙 스냅 정밀 동기화 */
  const Col = ({ values, selected, onPick, widthClass = "w-[70px]" }) => {
    const ref = useRef(null);
    const itemHRef = useRef(36);         // 실제 아이템 높이
    const viewHRef = useRef(180);        // 뷰 높이
    const rafRef   = useRef(0);
    const snapTORef= useRef(0);

    // 아이템 실제 높이 측정 후 초기 정렬
    useEffect(() => {
      const measure = () => {
        const item = ref.current?.querySelector("[data-wheel-item]");
        const box  = ref.current;
        if (item) itemHRef.current = item.getBoundingClientRect().height || 36;
        if (box)  viewHRef.current = box.getBoundingClientRect().height || 180;

        const idx = Math.max(0, values.indexOf(selected));
        const centerOffset = viewHRef.current / 2 - itemHRef.current / 2;
        const top = Math.max(0, idx * itemHRef.current - centerOffset);
        if (box) box.scrollTop = top;
      };
      // 첫 렌더 후 측정
      requestAnimationFrame(measure);
    }, []); // mount 1회

    const clampIdx = (idx) => Math.min(Math.max(idx, 0), values.length - 1);

    // 스크롤 시: 중앙 기준으로 가장 가까운 항목을 선택
    const onScroll = (e) => {
      const box = e.currentTarget;
      const centerOffset = viewHRef.current / 2 - itemHRef.current / 2;
      const idx = clampIdx(Math.round((box.scrollTop + centerOffset) / itemHRef.current));
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => onPick(values[idx]));

      // 스크롤 종료 후 정확히 정렬(덜컥임 방지)
      clearTimeout(snapTORef.current);
      snapTORef.current = setTimeout(() => {
        const targetTop = idx * itemHRef.current - centerOffset;
        box.scrollTo({ top: targetTop, behavior: "auto" });
      }, 100);
    };

    // 클릭 시: 선택 + 중앙 정렬
    const onClickItem = (v, idx) => {
      const box = ref.current;
      const centerOffset = viewHRef.current / 2 - itemHRef.current / 2;
      onPick(v);
      if (box) box.scrollTo({ top: idx * itemHRef.current - centerOffset, behavior: "auto" });
    };

    return (
      <div
        ref={ref}
        className={`h-[180px] overflow-y-auto no-scrollbar ${widthClass}`}
        onScroll={onScroll}
        style={{ scrollbarWidth: "none" }}
      >
        <style>{`.no-scrollbar::-webkit-scrollbar{display:none;}`}</style>
        {values.map((v, i) => (
          <button
            key={v}
            type="button"
            data-wheel-item
            onClick={() => onClickItem(v, i)}
            className={`h-9 w-full flex items-center justify-center text-[14px]
              ${v === selected ? "font-semibold text-gray-900" : "text-gray-900"}`}
          >
            {`${v}`.padStart(2, "0")}
          </button>
        ))}
      </div>
    );
  };

  // 현재 선택 상태
  const [hour, setHour] = useState(initHour);
  const [min,  setMin]  = useState(initMin);

  // 선택 즉시 외부 전달
  useEffect(() => {
    onChange?.(`${`${hour}`.padStart(2,"0")}:${`${min}`.padStart(2,"0")}`);
  }, [hour, min, onChange]);

  // 앵커 아래로 위치
  const rect = anchorRef.current?.getBoundingClientRect();
  const POPOVER_W = 200, POPOVER_H = 200;
  const style = rect ? {
    position: "fixed",
    top: Math.min(window.innerHeight - POPOVER_H - 8, rect.bottom + 8),
    left: Math.min(window.innerWidth - POPOVER_W - 8, Math.max(8, rect.right - POPOVER_W)),
    zIndex: 60
  } : {};

  return (
    <div ref={popRef} style={style}
      className="w-[200px] rounded-xl border border-gray-200 bg-white shadow-lg p-3 relative">
      {/* 중앙 가이드(회색 필) */}
      <div className="pointer-events-none absolute left-3 right-3 top-[calc(50%-18px)] h-9 rounded-md bg-gray-100" />
      <div className="flex gap-2 relative">
        <Col values={hours}   selected={hour} onPick={setHour} />
        <Col values={minutes} selected={min}  onPick={setMin}  />
      </div>
    </div>
  );
}

/* ===== 항상 ‘아래’로 뜨는 조세처 셀렉트 ===== */
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
    <div ref={wrapRef} className="relative mb-3 rounded-xl border border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="flex w-full items-center justify-between rounded-xl px-3 py-3"
      >
        <span className={`text-[15px] ${selected ? "font-semibold text-gray-900" : "text-gray-400"}`}>
          {selected || "조세처"}
        </span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-gray-400">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="px-3 py-2 text-[13px] text-gray-500">조세처</div>
          <ul className="max-h-60 overflow-auto">
            {options.map((label) => (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => { onChange(label); setOpen(false); }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 text-[15px] text-gray-900"
                >{label}</button>
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
  useLayoutEffect(() => window.scrollTo(0, 0), []);

  const [colorIdx, setColorIdx] = useState(0);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [title, setTitle] = useState("");

  const now = new Date();
  const defStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0); // 시작은 내부값만 유지
  const defEnd   = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 1, 0);

  const [start, setStart] = useState(defStart.toISOString().slice(0,16));
  const [end, setEnd]     = useState(defEnd.toISOString().slice(0,16));
  const [alarm, setAlarm] = useState("당일");
  const [office, setOffice] = useState("");

  const [openEndCal, setOpenEndCal] = useState(false);
  const [openEndTime, setOpenEndTime] = useState(false);
  const [endView, setEndView] = useState(new Date(end));
  const timeAnchorRef = useRef(null);

  /* ✅ 저장 버튼 활성화: 제목/종료/조세처만 있으면 OK */
  const isValid = useMemo(
    () => title.trim() !== "" && !!end && office.trim() !== "",
    [title, end, office]
  );

  const onSave = () => {
    if (!isValid) return;
    const payload = {
      color: COLORS[colorIdx],
      title: title.trim(),
      start: new Date(start).toISOString(),
      end:   new Date(end).toISOString(),
      alarm,
      office
    };
    console.log("SAVE NEW EVENT:", payload);
    nav(-1);
  };

  const endParts = splitDateParts(end);
  const [endDate, endTime] = end.split("T");

  return (
    <div className="w-full min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-4 py-3">
        <button onClick={() => nav(-1)} aria-label="back" className="text-gray-900">
          <IconChevronLeft />
        </button>
        <h1 className="text-[17px] font-semibold text-gray-900">새 일정</h1>
        <button
          onClick={onSave}
          disabled={!isValid}
          className={`text-[15px] font-semibold ${isValid ? "text-blue-600" : "text-gray-300"}`}
        >
          저장
        </button>
      </header>

      <main className="px-4 pt-4 pb-24">
        {/* 캘린더 색상 */}
        <div className="mb-3 rounded-xl border border-gray-200 p-3">
          <div className="flex items-center">
            <div className="text-[13px] text-gray-500">캘린더 색상</div>
            <div className="relative ml-auto">
              <button
                type="button"
                onClick={() => setShowColorPicker(v => !v)}
                className="h-6 w-6 rounded-full border"
                style={{ backgroundColor: COLORS[colorIdx], borderColor: "rgba(0,0,0,0.08)" }}
                aria-label="색상 선택 열기"
              />
              {showColorPicker && (
                <>
                  <button type="button" aria-hidden onClick={() => setShowColorPicker(false)} className="fixed inset-0 z-40 cursor-default" />
                  <div className="absolute right-0 top-full mt-2 z-[60] w-56 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((c, i) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => { setColorIdx(i); setShowColorPicker(false); }}
                          className={`h-7 w-7 rounded-full border transition ${i === colorIdx ? "ring-2 ring-offset-2 ring-gray-300" : ""}`}
                          style={{ backgroundColor: c, borderColor: "rgba(0,0,0,0.08)" }}
                          aria-label={`color-${i}`}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 제목 */}
        <div className="mb-3 rounded-xl border border-gray-200 p-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목"
            className="w-full bg-transparent text-[15px] text-gray-900 placeholder-gray-400 outline-none"
          />
        </div>

        {/* 종료만 표시 */}
        <div className="mb-3 rounded-xl border border-gray-200">
          <div className="flex w-full items-center gap-3 px-3 py-3">
            <span className="w-[40px] text-left text-[13px] text-gray-500">종료</span>
            <div className="ml-auto flex min-w-0 items-center gap-2 text-right">
              {/* 날짜 → 아래 인라인 캘린더 */}
              <button
                type="button"
                onClick={() => { setOpenEndCal(v => !v); setOpenEndTime(false); setEndView(new Date(end)); }}
                className="truncate rounded-md bg-gray-100 px-2 py-1 text-[13px] text-gray-900"
              >
                {endParts.left}
              </button>
              {/* 시간 → 아래 팝오버 */}
              <button
                ref={timeAnchorRef}
                type="button"
                onClick={() => { setOpenEndTime(v => !v); setOpenEndCal(false); }}
                className="rounded-md bg-gray-100 px-2 py-1 text-[13px] text-gray-900"
              >
                {endParts.right}
              </button>
            </div>
          </div>

          {/* 종료 캘린더 (인라인, 헤더/여백 제거) */}
          {openEndCal && (
            <>
              <div className="px-0 pb-2">
                <Calendar
                  hideTitle
                  year={endView.getFullYear()}
                  month={endView.getMonth()}
                  dayEvents={{}}
                  selected={new Date(endDate)}
                  onSelect={(d) => { setEnd(`${toYMD(d)}T${endTime || "00:00"}`); setOpenEndCal(false); }}
                  onPrev={() => setEndView(new Date(endView.getFullYear(), endView.getMonth() - 1, 1))}
                  onNext={() => setEndView(new Date(endView.getFullYear(), endView.getMonth() + 1, 1))}
                />
              </div>
              <div className="border-t border-gray-200" />
            </>
          )}

          {/* 시간 팝오버 */}
          {openEndTime && (
            <TimeWheelPopover
              anchorRef={timeAnchorRef}
              valueHHmm={endTime}
              onChange={(hhmm) => setEnd(`${endDate}T${hhmm}`)}
              onClose={() => setOpenEndTime(false)}
            />
          )}

          {/* 알림 */}
          <div className="flex items-center gap-3 px-3 py-3">
            <span className="w-[40px] text-left text-[13px] text-gray-500">알림</span>
            <div className="ml-auto relative cursor-pointer">
              <select
                value={alarm}
                onChange={(e) => setAlarm(e.target.value)}
                className="h-8 rounded-lg bg-[#f3f3f3] focus:bg-[#f3f3f3] px-2 pr-6 text-[13px] leading-none outline-none appearance-none cursor-pointer"
              >
                <option value="당일">당일</option>
                <option value="하루 전">하루 전</option>
                <option value="이틀 전">이틀 전</option>
                <option value="일주일 전">일주일 전</option>
              </select>
              <div className="cursor-pointer absolute right-1 top-1/2 -translate-y-1/2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9l6 6 6-6" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* 조세처 (항상 아래로) */}
        <OfficeSelectDown
          value={office}
          onChange={setOffice}
          options={[
            "홈택스 (국세청)",
            "위택스",
            "ETAX (서울시)",
            "4대 사회보험 연계센터",
            "UNI-PASS (관세청)",
            "기타",
          ]}
        />
      </main>
    </div>
  );
}