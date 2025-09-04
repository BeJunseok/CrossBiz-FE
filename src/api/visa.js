// src/api/visa.js
import axiosInstance from "@/lib/axiosInstance";

/** DEV 에서만 콘솔 */
const log = (...args) => import.meta.env.DEV && console.log(...args);

/** 공통 유틸 */
const onlyDigits = (s = "") => String(s).replace(/\D/g, "");

/** "20-30대" → 20 , "29" → 29 */
export function normalizeAge(ageLike) {
  if (ageLike == null) return undefined;
  const d = onlyDigits(ageLike);
  if (!d) return undefined;
  return Number(d.slice(0, 2));
}

/** "24개월" | "2년" | 24 | "24" → 24(개월)  */
export function toMonthsNumber(val) {
  if (val == null || val === "") return undefined;
  const s = String(val);
  const n = Number(onlyDigits(s));
  if (!n) return undefined;
  return /년/.test(s) ? n * 12 : n;
}

/** 사용자 프로필 → API basicInfo (accessToken 제외) */
export function mapProfileToBasicInfo(profile = {}) {
  const {
    userId,
    nationality,
    status,
    bizStatus,
    bizCategory,
    estimatePeriod,
    workExperience,
    degree,
    koreanLevel,
    age,
    accessToken, // 제외
    ...rest
  } = profile;

  return {
    userId,
    nationality: nationality ?? rest.country,
    status: status ?? "D-10",
    bizStatus,
    bizCategory,
    estimatePeriod: toMonthsNumber(estimatePeriod),
    workExperience:
      workExperience != null ? Number(workExperience) : undefined,
    degree,
    koreanLevel,
    age: normalizeAge(age),
  };
}

/** YYYYMMDD → YYYY-MM-DD */
export function yyyymmddToDash(yyyymmdd) {
  const s = onlyDigits(yyyymmdd).slice(0, 8);
  if (s.length !== 8) return "";
  return `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`;
}

/** 개월수 차이를 "X년" 또는 "Y개월" 문자열로 (정확히 12의 배수면 년) */
export function monthsToLabel(months) {
  if (!months) return "";
  return months % 12 === 0 ? `${months / 12}년` : `${months}개월`;
}

/** Date 차이로 개월수 근사(연*12 + 월 차이) */
export function diffMonths(issuedYmd, expiryYmd) {
  const i = onlyDigits(issuedYmd);
  const e = onlyDigits(expiryYmd);
  if (i.length !== 8 || e.length !== 8) return undefined;
  const iy = Number(i.slice(0, 4));
  const im = Number(i.slice(4, 6));
  const ey = Number(e.slice(0, 4));
  const em = Number(e.slice(4, 6));
  const m = (ey - iy) * 12 + (em - im);
  return m > 0 ? m : undefined;
}

/** 최종 POST */
export async function postVisaRecommendWith(payload) {
  log("[POST] /visa/recommend/with payload:", payload);
  const res = await axiosInstance.post("/visa/recommend/with", payload);
  return res.data;
}

export async function postVisaRecommendWithout(payload) {
  log("[POST] /visa/recommend/without payload:",payload);
  const res = await axiosInstance.post("/visa/recommend/without",payload);
  return res.data;
}