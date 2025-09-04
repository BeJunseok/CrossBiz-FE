// src/pages/Visa/ConfirmVisa.jsx
import React, { useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  yyyymmddToDash,
  postVisaRecommendWith,
  diffMonths,
  monthsToLabel,
} from "@/api/visa";

const digits = (s = "") => String(s).replace(/\D/g, "");
const isDate8 = (v) => /^\d{8}$/.test(v);
const isBizNo = (v) => /^\d{3}-\d{2}-\d{5}$/.test(v);
const isFilled = (v) => String(v ?? "").trim().length > 0;

const formatBizNo = (raw) => {
  const d = digits(raw).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
};

export default function ConfirmVisa() {
  const nav = useNavigate();
  const { state } = useLocation();
  const from = state?.from ?? "issued";
  const basicInfo = state?.basicInfo; // ← ConfirmCheck에서 전달

  // --- 폼(빈칸 시작) ---
  const [visaType, setVisaType] = useState("");
  const [issuedAt, setIssuedAt] = useState("");   // YYYYMMDD
  const [expiryAt, setExpiryAt] = useState("");   // YYYYMMDD
  const [bizNo, setBizNo] = useState("");         // 123-45-67890
  const [annualSales, setAnnualSales] = useState("");
  const [employees, setEmployees] = useState("");

  const allValid = useMemo(
    () =>
      isFilled(visaType) &&
      isDate8(issuedAt) &&
      isDate8(expiryAt) &&
      isBizNo(bizNo) &&
      isFilled(annualSales) &&
      /^\d+$/.test(String(employees)),
    [visaType, issuedAt, expiryAt, bizNo, annualSales, employees]
  );

  const handleConfirm = useCallback(async () => {
    if (!basicInfo) {
      alert("이전 단계 정보가 없습니다. 처음부터 다시 진행해주세요.");
      nav("/confirm-check");
      return;
    }
    if (!allValid) {
      alert("모든 항목을 올바르게 입력해주세요!");
      return;
    }

    // 자동 stayPeriod 계산 (발급/만료 기준)
    const months = diffMonths(issuedAt, expiryAt);
    const stayPeriod = monthsToLabel(months); // "2년" 또는 "24개월"

    const payload = {
      basicInfo,
      withVisaInfo: {
        stayPeriod, // 자동 계산 결과
        visaType,
        issuedDate: yyyymmddToDash(issuedAt),
        expiryDate: yyyymmddToDash(expiryAt),
        businessRegNumber: bizNo,
        annualRevenue: Number(String(annualSales).replace(/,/g, "")),
        employeeCount: Number(employees),
      },
    };

    try {
      const data = await postVisaRecommendWith(payload);
      nav("/visa-loading", {
        state: { from, raw: data }, // 이후 Recommend에서 그대로 사용
      });
    } catch (e) {
      console.error("비자 추천 API 실패:", e);
      alert("추천 정보를 불러오는 중 오류가 발생했어요.");
    }
  }, [basicInfo, from, allValid, visaType, issuedAt, expiryAt, bizNo, annualSales, employees, nav]);

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">
          정확한 매칭을 위해
          <br />추가 정보를 입력해주세요.
        </h1>

        <div className="mt-6 rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-4">
          <label className="block">
            <span className="block text-[14px] text-gray-600 mb-1">발급받은 비자 종류</span>
            <input
              type="text"
              placeholder="D-8-1"
              value={visaType}
              onChange={(e) => setVisaType(e.target.value)}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px]"
            />
          </label>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">발급일</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="20250129"
                value={issuedAt}
                onChange={(e) => setIssuedAt(digits(e.target.value).slice(0, 8))}
                className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px]"
              />
              {!isDate8(issuedAt) && issuedAt.length > 0 && (
                <p className="mt-1 text-xs text-red-600">YYYYMMDD 형식 8자리로 입력하세요.</p>
              )}
            </label>

            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">만료일</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="20290129"
                value={expiryAt}
                onChange={(e) => setExpiryAt(digits(e.target.value).slice(0, 8))}
                className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px]"
              />
              {!isDate8(expiryAt) && expiryAt.length > 0 && (
                <p className="mt-1 text-xs text-red-600">YYYYMMDD 형식 8자리로 입력하세요.</p>
              )}
            </label>
          </div>

          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">사업자등록번호</span>
            <input
              type="text"
              placeholder="123-45-67890"
              value={bizNo}
              onChange={(e) => setBizNo(formatBizNo(e.target.value))}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px]"
            />
            {!isBizNo(bizNo) && bizNo.length > 0 && (
              <p className="mt-1 text-xs text-red-600">예: 123-45-67890</p>
            )}
          </label>

          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">연매출</span>
            <input
              type="text"
              placeholder="80000000"
              value={annualSales}
              onChange={(e) => setAnnualSales(e.target.value)}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px]"
            />
          </label>

          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">고용 인원</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="3"
              value={employees}
              onChange={(e) => setEmployees(digits(e.target.value))}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={() => nav(-1)}
            className="flex-1 h-11 rounded-full border border-gray-300 bg-white text-gray-900 text-[15px] font-semibold active:scale-[0.99]"
          >
            이전
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 h-11 rounded-full bg-gray-900 text-white text-[15px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.15)] active:scale-[0.99]"
          >
            확인
          </button>
        </div>
      </section>
    </main>
  );
}