// src/pages/ConfirmVisa.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import visaUser from "../../data/visaUser.json";

export default function ConfirmVisa({ onNext }) {
  const nav = useNavigate();
  const { state } = useLocation();               // ✅ 부모가 넘긴 state
  const from = state?.from ?? "issued";          // "issued" | "match" | "history" 등

  // --- form states ---
  const [visaType, setVisaType] = useState("");
  const [issuedAt, setIssuedAt] = useState("");
  const [expireAt, setExpireAt] = useState("");
  const [bizNo, setBizNo] = useState("");
  const [annualSales, setAnnualSales] = useState("");
  const [employees, setEmployees] = useState("");

  // --- helpers ---
  const isDate8 = (v) => /^\d{8}$/.test(v);
  const isBizNo = (v) => /^\d{3}-\d{2}-\d{5}$/.test(v);
  const isFilled = (v) => String(v ?? "").trim().length > 0;
  const numbersOnly = (s = "") => String(s).replace(/\D/g, "");

  const formatBizNo = (raw) => {
    const d = numbersOnly(raw).slice(0, 10);
    if (d.length < 4) return d;
    if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
  };

  // JSON → 초기 프리필
  useEffect(() => {
    const info = visaUser?.request?.withVisaInfo ?? {};
    setVisaType(info.visaType ?? "");
    setIssuedAt(info.issuedDate ? numbersOnly(info.issuedDate).slice(0, 8) : "");
    setExpireAt(info.expiryDate ? numbersOnly(info.expiryDate).slice(0, 8) : "");
    setBizNo(info.businessRegNumber ? formatBizNo(info.businessRegNumber) : "");
    if (typeof info.annualRevenue === "number") setAnnualSales(info.annualRevenue.toLocaleString());
    else if (info.annualRevenue != null) setAnnualSales(String(info.annualRevenue));
    setEmployees(info.employeeCount != null ? String(info.employeeCount) : "");
  }, []);

  // 전체 유효성
  const allValid = useMemo(() => {
    return (
      isFilled(visaType) &&
      isDate8(issuedAt) &&
      isDate8(expireAt) &&
      isBizNo(bizNo) &&
      isFilled(annualSales) &&
      /^\d+$/.test(String(employees)) &&
      Number(employees) >= 0
    );
  }, [visaType, issuedAt, expireAt, bizNo, annualSales, employees]);

  // 확인 버튼
  const handleConfirm = useCallback(() => {
    if (!allValid) {
      alert("모든 항목을 입력해주세요!!");
      return;
    }
    const payload = {
      visaType,
      issuedAt,
      expireAt,
      bizNo,
      // annualSales: numbersOnly(annualSales), // ← 숫자만 보내려면 사용
      annualSales,
      employees: Number(employees),
    };

    if (onNext) {
      onNext(payload);
      return;
    }

    // ✅ 명확한 state로 이동
    nav("/visa-loading", {
      state: { from, payload },
      replace: false,
    });
  }, [allValid, visaType, issuedAt, expireAt, bizNo, annualSales, employees, onNext, nav, from]);

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">
          정확한 매칭을 위해
          <br />추가 정보를 입력해주세요.
        </h1>

        {/* 카드 */}
        <div className="mt-6 rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-4">
          <label className="block">
            <span className="block text-[14px] text-gray-600 mb-1">발급받은 비자 종류</span>
            <input
              type="text"
              placeholder="D-8-1"
              value={visaType}
              onChange={(e) => setVisaType(e.target.value)}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900 placeholder:text-gray-300"
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
                onChange={(e) => setIssuedAt(numbersOnly(e.target.value).slice(0, 8))}
                className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900 placeholder:text-gray-300"
              />
              {!isDate8(issuedAt) && issuedAt.length > 0 && (
                <p className="mt-1 text-xs text-red-600">YYYYMMDD 형식 8자리로 입력해주세요.</p>
              )}
            </label>

            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">만료일</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="20290129"
                value={expireAt}
                onChange={(e) => setExpireAt(numbersOnly(e.target.value).slice(0, 8))}
                className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900 placeholder:text-gray-300"
              />
              {!isDate8(expireAt) && expireAt.length > 0 && (
                <p className="mt-1 text-xs text-red-600">YYYYMMDD 형식 8자리로 입력해주세요.</p>
              )}
            </label>
          </div>

          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">사업자등록번호</span>
            <input
              type="text"
              placeholder="107-81-76756"
              value={bizNo}
              onChange={(e) => setBizNo(formatBizNo(e.target.value))}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900 placeholder:text-gray-300"
            />
            {!isBizNo(bizNo) && bizNo.length > 0 && (
              <p className="mt-1 text-xs text-red-600">예: 123-45-67890 형식으로 입력해주세요.</p>
            )}
          </label>

          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">연매출</span>
            <input
              type="text"
              placeholder="5억원 이상"
              value={annualSales}
              onChange={(e) => setAnnualSales(e.target.value)}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900 placeholder:text-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </label>

          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">고용 인원</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="23"
              value={employees}
              onChange={(e) => setEmployees(numbersOnly(e.target.value))}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900 placeholder:text-gray-300 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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