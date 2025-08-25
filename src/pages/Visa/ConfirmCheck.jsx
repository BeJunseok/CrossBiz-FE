// src/pages/ConfirmCheck.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import visaUser from "../../data/visaUser.json";
import commonUser from "../../data/commonUser.json";

const LS_KEY = "confirm_check_form_issued_v1"; 

export default function ConfirmCheck() {
  const nav = useNavigate();
  const { state } = useLocation();
  const from = state?.from; // "issued" | "match" | undefined

  const [isEditing, setIsEditing] = useState(false);
  const firstInputRef = useRef(null);

  // ✅ JSON 데이터에서 form 빌드하는 함수 (공통화)
  const buildFormFromJson = (source) => {
    const basic = source?.request?.basicInfo ?? {};
    const visa = source?.request?.withVisaInfo ?? {};
    return {
      nationality: basic.nationality ?? "",
      bizInfo: basic.bizStatus ?? "",
      status: basic.status || visa.visaType || "기업투자",
      estimatePeriod:
        basic.estimatePeriod != null
          ? `${basic.estimatePeriod}개월`
          : visa.stayPeriod ?? "",
      workExperience:
        basic.workExperience != null ? String(basic.workExperience) : "",
      degree: basic.degree ?? "",
      koreanLevel: basic.koreanLevel ?? "",
    };
  };

  // ✅ 초기값 분기
  const [form, setForm] = useState(() => {
    if (from === "issued") return buildFormFromJson(visaUser);
    if (from === "match") return buildFormFromJson(commonUser);
    return {
      nationality: "",
      bizInfo: "",
      status: "기업투자",
      estimatePeriod: "",
      workExperience: "",
      degree: "",
      koreanLevel: "",
    };
  });

  // 라우팅 state가 늦게 들어올 경우 대비
  useEffect(() => {
    if (from === "issued") setForm(buildFormFromJson(visaUser));
    if (from === "match") setForm(buildFormFromJson(commonUser));
  }, [from]);

  // 편집 모드 전환 시 포커스
  useEffect(() => {
    if (isEditing && firstInputRef.current) firstInputRef.current.focus();
  }, [isEditing]);

  // 변경 시 저장 (issued일 때만 저장)
  useEffect(() => {
    if (from === "issued")
      localStorage.setItem(LS_KEY, JSON.stringify(form));
  }, [form, from]);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleEditToggle = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      if (from === "issued")
        localStorage.setItem(LS_KEY, JSON.stringify(form));
      setIsEditing(false);
      alert("수정한 내용을 저장했어요.");
    }
  };

  const handleConfirm = () => {
    if (from === "match") nav("/confirm-more");
    else if (from === "issued") nav("/confirm-visa");
    else nav("/confirm-visa");
  };

  const inputCls =
    "w-full h-8 px-2 bg-transparent border-0 border-b text-[15px] focus:outline-none " +
    (isEditing
      ? "border-gray-300 focus:border-gray-900 text-gray-900"
      : "border-transparent text-gray-900");

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">
          아래 정보가 맞나요?
        </h1>

        <div className="mt-6 w-full rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-4">
          {/* 입력 필드들 (동일) */}
          <label className="block">
            <span className="block text-[14px] text-gray-600 mb-1">국적</span>
            <input
              ref={firstInputRef}
              type="text"
              value={form.nationality}
              onChange={handleChange("nationality")}
              disabled={!isEditing}
              className={inputCls}
            />
          </label>

          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">
              사업자 정보
            </span>
            <input
              type="text"
              value={form.bizInfo}
              onChange={handleChange("bizInfo")}
              disabled={!isEditing}
              className={inputCls}
            />
          </label>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">
                체류 자격
              </span>
              <input
                type="text"
                value={form.status}
                onChange={handleChange("status")}
                disabled={!isEditing}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">
                예상 체류 기간
              </span>
              <input
                type="text"
                value={form.estimatePeriod}
                onChange={handleChange("estimatePeriod")}
                disabled={!isEditing}
                className={inputCls}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">
                경력
              </span>
              <input
                type="text"
                value={form.workExperience}
                onChange={handleChange("workExperience")}
                disabled={!isEditing}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">
                학위
              </span>
              <input
                type="text"
                value={form.degree}
                onChange={handleChange("degree")}
                disabled={!isEditing}
                className={inputCls}
              />
            </label>
          </div>

          <label className="block mt-4">
            <span className="block text-[14px] text-gray-600 mb-1">
              한국어 능력
            </span>
            <input
              type="text"
              value={form.koreanLevel}
              onChange={handleChange("koreanLevel")}
              disabled={!isEditing}
              className={inputCls}
            />
          </label>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={handleEditToggle}
            className="flex-1 h-11 rounded-full border border-gray-300 bg-white text-gray-900 text-[15px] font-semibold active:scale-[0.99]"
          >
            {isEditing ? "저장" : "수정하기"}
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