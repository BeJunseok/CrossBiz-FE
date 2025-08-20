// src/utils/arrows.js
const BASE = import.meta.env.BASE_URL || "/";



export const DAY_ARROW_ICONS = {
  1: { src: `${BASE}red.svg`,    w: 44, h: 13 },
  2: { src: `${BASE}orange.svg`, w: 44, h: 13 },
  3: { src: `${BASE}yellow.svg`, w: 44, h: 13 },
  4: { src: `${BASE}green.svg`,  w: 44, h: 13 },
  5: { src: `${BASE}blue.svg`,   w: 44, h: 13 },
};

// 선택 아이콘만 사용 (팔레트/상태 표시)
export const SELECT_ICONS = {
  1: `${BASE}redSelect.svg`,
  2: `${BASE}orangeSelect.svg`,
  3: `${BASE}yellowSelect.svg`,
  4: `${BASE}greenSelect.svg`,
  5: `${BASE}blueSelect.svg`,
};

// 무지개 아이콘(기본)
export const DEFAULT_ICON_24 = `${BASE}colorSelect.svg`;

// 저장/전달용 색상값
export const ARROW_COLORS = {
  1: "#FF0000",
  2: "#FF7B00",
  3: "#FFF600",
  4: "#00FF37",
  5: "#002FFF",
};

// 팔레트 한 줄 5개
export const PALETTE = [1, 2, 3, 4, 5].map((code) => ({
  code,
  icon: SELECT_ICONS[code],
  color: ARROW_COLORS[code],
}));

export const getArrowColor = (code) => ARROW_COLORS[SELECT_ICONS[code] ? code : 5];