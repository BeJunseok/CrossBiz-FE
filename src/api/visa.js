// src/api/visa.js
const BASE = "https://crossbiz.store"; // or "https://www.crossbiz.store"

export async function fetchVisaRecommendWith() {
  const payload = {
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

  try {
    const res = await fetch(`${BASE}/api/visa/recommend/without`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // 상태코드 확인
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`HTTP ${res.status} ${res.statusText} :: ${text}`);
    }

    const data = await res.json();
    console.log("✅ /api/visa/recommend/with 응답:", data);
    return data;
  } catch (err) {
    // CORS / 네트워크 오류 로그
    console.error("❌ API 호출 실패:", err);
    return null;
  }
}