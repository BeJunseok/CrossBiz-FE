// src/api/visa.js
import axiosInstance from "@/lib/axiosInstance";

/** 프로덕션에서는 과도한 로그 억제 */
const log = (...args) => {
  if (import.meta.env.DEV) console.log(...args);
};
const logErr = (...args) => console.error(...args);

/** 공통 payload 빌더 */
export function buildVisaPayload(partial = {}) {
  const base = {
    basicInfo: {
      userId: 2,
      age: 35,
      bizStatus: "창업예정",
      nationality: "미국",
      status: "D-10",
      bizCategory: "음식점업",
      estimatePeriod: 24,
      workExperience: 5,
      degree: "석사",
      koreanLevel: "TOPIK 5급",
    },
    withVisaInfo: {
      stayPeriod: "2년",
      visaType: "D-10",
      issuedDate: "2023-06-01",
      expiryDate: "2025-06-01",
      businessRegNumber: "123-45-67890",
      annualRevenue: 80000000,
      employeeCount: 3,
    },
  };

  return {
    basicInfo: { ...base.basicInfo, ...(partial.basicInfo || {}) },
    withVisaInfo: { ...base.withVisaInfo, ...(partial.withVisaInfo || {}) },
  };
}

/** 서버 POST만 사용 (저장/로드 공용) */
export async function postVisaRecommendWith(partial = {}) {
  const payload = buildVisaPayload(partial);
  try {
    const res = await axiosInstance.post("/visa/recommend/with", payload);
    log("✅ /visa/recommend/with 응답:", res?.data);
    return { data: res?.data ?? null, payload };
  } catch (err) {
    logErr("❌ /visa/recommend/with 실패:", err?.message || err);
    return { data: null, payload, error: err };
  }
}