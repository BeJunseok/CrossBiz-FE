// src/utils/eventStore.js
const KEY = "my_events_v1";

let listeners = [];

// 안전한 JSON 파싱
function safeParse(json) {
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

// 읽기
function read() {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(KEY);
  return safeParse(raw || "[]");
}

// 쓰기 + 브로드캐스트
function write(events) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(KEY, JSON.stringify(events));
  }
  listeners.forEach((fn) => {
    try { fn(events); } catch (e) { console.error(e); }
  });
}

export function getEvents() {
  return read();
}

// 단건 추가
export function addEvent(evt) {
  const list = read();
  const id = (globalThis.crypto?.randomUUID?.() ?? `ev_${Date.now()}`);
  const next = [...list, { id, ...evt }];
  write(next);
  return id;
}

// 모두 비우기
export function clearAll() {
  write([]);
}

// 구독 (현재값 즉시 한 번 쏴줌)
export function subscribe(fn) {
  if (typeof fn !== "function") return () => {};
  listeners.push(fn);
  try { fn(read()); } catch (e) { console.error(e); }

  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}

// 달력용: 날짜별 코드배열로 변환 { 'YYYY-MM-DD': number[] }
export function getEventsMap() {
  const norm = (v) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= 1 && n <= 5 ? n : null;
  };
  return read().reduce((acc, e) => {
    const k = e?.date;            // 로컬 'YYYY-MM-DD'로 저장된 키
    const c = norm(e?.code);      // 1~5
    if (k && c) (acc[k] ||= []).push(c);
    return acc;
  }, {});
}

/* ✅ 리스트용: 날짜별 상세목록 맵
   { 'YYYY-MM-DD': [{id,color,code,title,text,...}, ...] } */
export function getEventsListMap() {
  return read().reduce((acc, e) => {
    const k = e?.date;            // 로컬 'YYYY-MM-DD'
    if (k) (acc[k] ||= []).push(e);
    return acc;
  }, {});
}

export function removeEventById(id) {
  const list = read();
  const next = list.filter((e) => e.id!== id);
  write(next);
}