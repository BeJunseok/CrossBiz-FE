// src/pages/Visa/ConfirmMore.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import commonUser from "../../data/commonUser.json"; // ✅ 추가

export default function ConfirmMore() {
  const navigate = useNavigate();

  // ✅ CommonUser.json에서 기본값 추출
  const wv = commonUser?.request?.withoutVisaInfo ?? {};
  const initBizType = "private"; // 기본값: 개인 점포
  const initIpOwned =
    wv.hasIntellectualProperty === true
      ? "yes"
      : wv.hasIntellectualProperty === false
      ? "no"
      : "";
  const initInvestment =
    wv.businessFund != null ? String(wv.businessFund) : "";
  const initOasis = wv.oasisScore != null ? String(wv.oasisScore) : "";

  // ✅ 폼 상태 (초기값 프리필)
  const [bizType, setBizType] = useState(initBizType);      // "franchise" | "private"
  const [ipOwned, setIpOwned] = useState(initIpOwned);      // "yes" | "no"
  const [investment, setInvestment] = useState(initInvestment); // 문자열
  const [oasis, setOasis] = useState(initOasis);            // 문자열

  const handlePrev = () => navigate(-1);

  const handleNext = () => {
    if (!bizType || !ipOwned || !investment.trim() || !oasis.trim()) {
      alert("모든 항목을 입력해주세요!!");
      return;
    }
 
    navigate("/visa-loading", {
      state: {from: "match"},
      replace: false,
    });
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">
          정확한 매칭을 위해
          <br />추가 정보를 입력해주세요.
        </h1>

        {/* 카드 */}
        <div className="mt-12 rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] bg-white p-4">
          {/* ── 사업 방식 ── */}
          <div className="mt-1">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-gray-600">사업 방식</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="biz_type"
                    className="w-3 h-3 accent-gray-900"
                    value="franchise"
                    checked={bizType === "franchise"}
                    onChange={(e) => setBizType(e.target.value)}
                  />
                  <span className="text-[13px] text-gray-900">프랜차이즈</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="biz_type"
                    className="w-3 h-3 accent-gray-900"
                    value="private"
                    checked={bizType === "private"} // ✅ 기본 선택
                    onChange={(e) => setBizType(e.target.value)}
                  />
                  <span className="text-[13px] text-gray-900">개인 점포</span>
                </label>
              </div>
            </div>
          </div>

          {/* ── 특허/지식재산권 보유 여부 ── */}
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-gray-600">특허/지식재산권 보유 여부</span>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="ip_owned"
                    className="w-3 h-3 accent-gray-900"
                    value="yes"
                    checked={ipOwned === "yes"} // ✅ true → yes
                    onChange={(e) => setIpOwned(e.target.value)}
                  />
                  <span className="text-[13px] text-gray-900">예</span>
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="ip_owned"
                    className="w-3 h-3 accent-gray-900"
                    value="no"
                    checked={ipOwned === "no"} // ✅ false → no
                    onChange={(e) => setIpOwned(e.target.value)}
                  />
                  <span className="text-[13px] text-gray-900">아니오</span>
                </label>
              </div>
            </div>
          </div>

          {/* ── 투자금 ── */}
          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">투자금</span>
            <input
              type="text"
              placeholder="1억5천만원"
              value={investment} // ✅ businessFund 프리필
              onChange={(e) => setInvestment(e.target.value)}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200
                         focus:border-gray-900 focus:outline-none text-[15px] text-gray-900
                         placeholder:text-gray-300"
            />
          </label>

          {/* ── 오아시스 점수 ── */}
          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">오아시스 점수</span>
            <input
              type="text"
              placeholder="85"
              value={oasis} // ✅ oasisScore 프리필
              onChange={(e) => setOasis(e.target.value)}
              className="w-full h-11 px-2 bg-transparent border-0 border-b border-gray-200
                         focus:border-gray-900 focus:outline-none text-[15px] text-gray-900
                         placeholder:text-gray-300"
            />
          </label>
        </div>

        {/* 하단 버튼 */}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="flex-1 h-11 rounded-full border border-gray-300 bg-white text-gray-900 text-[15px] font-semibold active:scale-[0.99]"
          >
            이전
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="flex-1 h-11 rounded-full bg-gray-900 text-white text-[15px] font-semibold shadow-[0_2px_10px_rgba(0,0,0,0.15)] active:scale-[0.99]"
          >
            확인
          </button>
        </div>
      </section>
    </main>
  );
}