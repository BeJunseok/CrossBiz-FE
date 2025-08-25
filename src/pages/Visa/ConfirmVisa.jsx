// src/pages/ConfirmVisa.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchVisaRecommendWith } from "@/api/visa";

const SS_PAYLOAD = "visa_recommend_payload_v1";
const SS_RESULT  = "visa_recommend_result_v1";

export default function ConfirmVisa() {
  const nav = useNavigate();
  const { state } = useLocation();
  const basicInfo = state?.payload?.basicInfo || {};

  const [visaType, setVisaType] = useState("");
  const [issuedAt, setIssuedAt] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [bizNo, setBizNo] = useState("");
  const [annualSales, setAnnualSales] = useState("");
  const [employees, setEmployees] = useState("");

  const onlyNum = (s="") => String(s).replace(/\D/g, "");
  const isDate8 = (v) => /^\d{8}$/.test(v);
  const isBizNo = (v) => /^\d{3}-\d{2}-\d{5}$/.test(v);
  const isFilled = (v) => String(v ?? "").trim().length > 0;
  const toYmdDash = (yyyymmdd) =>
    `${yyyymmdd.slice(0,4)}-${yyyymmdd.slice(4,6)}-${yyyymmdd.slice(6,8)}`;
  const fmtBizNo = (raw) => {
    const d = onlyNum(raw).slice(0,10);
    if (d.length < 4) return d;
    if (d.length < 6) return `${d.slice(0,3)}-${d.slice(3)}`;
    return `${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}`;
  };

  const allValid = useMemo(() =>
    basicInfo?.userId &&
    isFilled(visaType) &&
    isDate8(issuedAt) &&
    isDate8(expireAt) &&
    isBizNo(bizNo) &&
    isFilled(annualSales) &&
    /^\d+$/.test(String(employees)), 
  [basicInfo?.userId, visaType, issuedAt, expireAt, bizNo, annualSales, employees]);

  const handleConfirm = useCallback(async () => {
    if (!basicInfo?.userId) {
      alert("기본 정보(userId)가 없습니다. 이전 단계로 돌아가 다시 진행해주세요.");
      return;
    }
    if (!allValid) {
      alert("모든 항목을 올바르게 입력해주세요.");
      return;
    }

    const withVisaInfo = {
      stayPeriod: null,
      visaType,
      issuedDate: toYmdDash(issuedAt),
      expiryDate: toYmdDash(expireAt),
      businessRegNumber: bizNo,
      annualRevenue: Number(onlyNum(annualSales)),
      employeeCount: Number(employees),
    };

    const payload = { basicInfo, withVisaInfo };

    try {
      console.log("[ConfirmVisa] POST payload:", payload);
      const result = await fetchVisaRecommendWith(payload);

      // 새로고침 대비 세션 저장
      sessionStorage.setItem(SS_PAYLOAD, JSON.stringify(payload));
      sessionStorage.setItem(SS_RESULT, JSON.stringify(result));

      // 결과 페이지로 이동하며 state도 함께 전달
      nav("/visa-recommend", { state: { from: "confirm-visa", payload, result } });
    } catch (err) {
      console.error("[ConfirmVisa] POST failed:", {
        message: err?.message,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      alert("제출에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  }, [basicInfo, allValid, visaType, issuedAt, expireAt, bizNo, annualSales, employees, nav]);

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">
          정확한 매칭을 위해 <br /> 추가 정보를 입력해주세요.
        </h1>

        <div className="mt-6 rounded-2xl bg-white shadow p-4">
          <label className="block">
            <span className="text-[14px] text-gray-600 mb-1 block">발급받은 비자 종류</span>
            <input
              type="text"
              placeholder="D-8-1"
              value={visaType}
              onChange={(e) => setVisaType(e.target.value)}
              className="w-full h-11 px-2 border-b border-gray-200 focus:border-gray-900 outline-none"
            />
          </label>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="text-[14px] text-gray-600 mb-1 block">발급일</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="20250129"
                value={issuedAt}
                onChange={(e) => setIssuedAt(onlyNum(e.target.value).slice(0, 8))}
                className="w-full h-11 px-2 border-b border-gray-200 focus:border-gray-900 outline-none"
              />
              {!isDate8(issuedAt) && issuedAt.length > 0 && (
                <p className="text-xs text-red-600">YYYYMMDD 형식 8자리</p>
              )}
            </label>

            <label className="block">
              <span className="text-[14px] text-gray-600 mb-1 block">만료일</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="20290129"
                value={expireAt}
                onChange={(e) => setExpireAt(onlyNum(e.target.value).slice(0, 8))}
                className="w-full h-11 px-2 border-b border-gray-200 focus:border-gray-900 outline-none"
              />
              {!isDate8(expireAt) && expireAt.length > 0 && (
                <p className="text-xs text-red-600">YYYYMMDD 형식 8자리</p>
              )}
            </label>
          </div>

          <label className="block mt-4">
            <span className="text-[14px] text-gray-600 mb-1 block">사업자등록번호</span>
            <input
              type="text"
              placeholder="123-45-67890"
              value={bizNo}
              onChange={(e) => setBizNo(fmtBizNo(e.target.value))}
              className="w-full h-11 px-2 border-b border-gray-200 focus:border-gray-900 outline-none"
            />
            {!isBizNo(bizNo) && bizNo.length > 0 && (
              <p className="text-xs text-red-600">예: 123-45-67890</p>
            )}
          </label>

          <label className="block mt-4">
            <span className="text-[14px] text-gray-600 mb-1 block">연매출</span>
            <input
              type="text"
              placeholder="500000000"
              value={annualSales}
              onChange={(e) => setAnnualSales(e.target.value)}
              className="w-full h-11 px-2 border-b border-gray-200 focus:border-gray-900 outline-none"
            />
          </label>

          <label className="block mt-4">
            <span className="text-[14px] text-gray-600 mb-1 block">고용 인원</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="23"
              value={employees}
              onChange={(e) => setEmployees(onlyNum(e.target.value))}
              className="w-full h-11 px-2 border-b border-gray-200 focus:border-gray-900 outline-none"
            />
          </label>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="flex-1 h-11 rounded-full border border-gray-300 bg-white text-gray-900"
          >
            이전
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 h-11 rounded-full bg-gray-900 text-white"
          >
            확인
          </button>
        </div>
      </section>
    </main>
  );
}