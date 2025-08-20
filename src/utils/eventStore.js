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
  // 디버깅에 도움
  // console.log("[eventStore] write", events);
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
  // 🔑 구독 직후 현재값을 즉시 전달 (초기 렌더 보장)
  try { fn(read()); } catch (e) { console.error(e); }

  return () => {
    listeners = listeners.filter((f) => f !== fn);
  };
}

// 달력용: 날짜별 코드배열로 변환 { 'YYYY-MM-DD': number[] }
export function getEventsMap() {
  const norm = (v) => {
    const n =Number(v);
    return Number.isFinite(n) && n >=1 && n<=5 ? n: null;
  }
  return read().reduce((acc,e) => {
    const k = e?.date;
    const c = norm(e?.code);
    if (k && c){
    (acc[k] ||= []).push(c);
    }
    return acc;
  },{});
}