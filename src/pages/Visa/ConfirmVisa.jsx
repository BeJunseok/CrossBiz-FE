// src/pages/Visa/ConfirmVisa.jsx
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import visaUser from "../../data/visaUser.json";
import { axiosInstance } from "@/lib/axiosInstance";
import { getUserProfile } from "@/api/auth/Auth";

// 유틸
const numbersOnly = (s = "") => String(s).replace(/\D/g, "");
const isDate8 = (v) => /^\d{8}$/.test(v);
const isBizNo = (v) => /^\d{3}-\d{2}-\d{5}$/.test(v);
const isFilled = (v) => String(v ?? "").trim().length > 0;
const toYmdDash = (yyyymmdd) =>
  isDate8(yyyymmdd)
    ? `${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`
    : "";

const formatBizNo = (raw) => {
  const d = numbersOnly(raw).slice(0, 10);
  if (d.length < 4) return d;
  if (d.length < 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 5)}-${d.slice(5)}`;
};

// "24개월" / "2년" 같은 문자열을 개월수 숫자로
const toMonthsNumber = (val) => {
  if (val == null || val === "") return undefined;
  const s = String(val);
  const n = Number(numbersOnly(s));
  if (Number.isNaN(n) || n === 0) return undefined;
  // "년" 포함되면 *12
  if (/년/.test(s)) return n * 12;
  return n; // "개월" 또는 그냥 숫자
};

export default function ConfirmVisa() {
  const nav = useNavigate();
  const { state } = useLocation();
  const from = state?.from ?? "issued";

  // --- form states (비자 정보) ---
  const [visaType, setVisaType] = useState("");
  const [issuedAt, setIssuedAt] = useState(""); // YYYYMMDD
  const [expireAt, setExpireAt] = useState(""); // YYYYMMDD
  const [bizNo, setBizNo] = useState(""); // 123-45-67890
  const [annualSales, setAnnualSales] = useState(""); // 문자열 입력(쉼표 허용)
  const [employees, setEmployees] = useState(""); // 정수

  // --- profile (basicInfo 구성용) ---
  const [profile, setProfile] = useState(null);

  // 프로필 로드 → basicInfo 구성에 사용
  useEffect(() => {
    (async () => {
      try {
        const me = await getUserProfile(); // { userId, age, nationality, ... }
        setProfile(me);
        if (import.meta.env.DEV) console.log("profile:", me);
      } catch (e) {
        console.warn("프로필 로드 실패:", e);
      }
    })();
  }, []);

  // JSON → 초기 프리필 (withVisaInfo)
  useEffect(() => {
    const info = visaUser?.request?.withVisaInfo ?? {};
    setVisaType(info.visaType ?? "");
    setIssuedAt(info.issuedDate ? numbersOnly(info.issuedDate).slice(0, 8) : "");
    setExpireAt(info.expiryDate ? numbersOnly(info.expiryDate).slice(0, 8) : "");
    setBizNo(info.businessRegNumber ? formatBizNo(info.businessRegNumber) : "");
    if (typeof info.annualRevenue === "number")
      setAnnualSales(String(info.annualRevenue));
    else if (info.annualRevenue != null) setAnnualSales(String(info.annualRevenue));
    setEmployees(info.employeeCount != null ? String(info.employeeCount) : "");
  }, []);

  // 전체 유효성 (withVisaInfo에 대한)
  const allValid = useMemo(
    () =>
      isFilled(visaType) &&
      isDate8(issuedAt) &&
      isDate8(expireAt) &&
      isBizNo(bizNo) &&
      isFilled(annualSales) &&
      /^\d+$/.test(String(employees)) &&
      Number(employees) >= 0,
    [visaType, issuedAt, expireAt, bizNo, annualSales, employees]
  );

  // POST 본문에서 undefined 제거
  const stripUndef = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== undefined && v !== null)
    );

  // 확인 → basicInfo + withVisaInfo 로 POST 후 로딩 페이지로 이동
  const handleConfirm = useCallback(async () => {
    if (!allValid) {
      alert("모든 항목을 올바르게 입력해주세요!!");
      return;
    }

    // 1) withVisaInfo (현재 폼)
    const withVisaInfo = {
      visaType: visaType,
      issuedDate: toYmdDash(issuedAt),
      expiryDate: toYmdDash(expireAt),
      businessRegNumber: bizNo,
      annualRevenue: Number(String(annualSales).replace(/,/g, "")),
      employeeCount: Number(employees),
    };

    // 2) basicInfo (프로필 기반) — 서버 스키마에 맞춰 최대한 채움
    const basicInfo = stripUndef({
      userId: profile?.userId,
      age:
        profile?.age != null
          ? Number(numbersOnly(profile.age))
          : undefined,
      nationality: profile?.nationality ?? profile?.country,
      status: profile?.status ?? "D-10",
      bizStatus: profile?.bizStatus ?? undefined,
      bizCategory: profile?.bizCategory ?? undefined,
      estimatePeriod: toMonthsNumber(profile?.estimatePeriod),
      workExperience:
        profile?.workExperience != null
          ? Number(profile.workExperience)
          : undefined,
      degree: profile?.degree ?? undefined,
      koreanLevel: profile?.koreanLevel ?? undefined,
    });

    const payload = {
      basicInfo,
      withVisaInfo,
    };

    try {
      const res = await axiosInstance.post("/visa/recommend/with", payload, {
        validateStatus: () => true, // 4xx도 응답 본문 확인
      });
      if (import.meta.env.DEV) {
        console.log("[POST /visa/recommend/with]", res.status, res.data);
      }

      if (res.status === 403) {
        alert("접근이 거부되었습니다(403). 로그인 토큰/권한 또는 CORS 설정을 확인해주세요.");
        return;
      }
      if (res.status >= 400) {
        alert(`요청이 실패했습니다: ${res.status}`);
        return;
      }

      // 로딩 페이지로 응답 전달 (VisaLoading이 기대하는 키: raw)
      nav("/visa-loading", {
        state: { from: "issued", raw: res.data },
        replace: false,
      });
    } catch (e) {
      console.error("비자 추천 API 실패:", e);
      alert("추천 정보를 불러오는 중 오류가 발생했어요.");
    }
  }, [allValid, visaType, issuedAt, expireAt, bizNo, annualSales, employees, profile, nav]);

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
              placeholder="123-45-67890"
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
              placeholder="500000000"
              value={annualSales}
              onChange={(e) => setAnnualSales(e.target.value)}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200 focus:border-gray-900 focus:outline-none text-[15px] text-gray-900 placeholder:text-gray-300"
            />
          </label>

          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">고용 인원</span>
            <input
              type="number"
              inputMode="numeric"
              placeholder="3"
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