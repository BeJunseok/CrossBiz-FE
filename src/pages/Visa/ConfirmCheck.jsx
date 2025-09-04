// src/pages/ConfirmCheck.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserProfile } from "@/api/auth/Auth";
import { mapProfileToBasicInfo, toMonthsNumber } from "@/api/visa";

const log = (...args) => import.meta.env.DEV && console.log(...args);

export default function ConfirmCheck() {
  const nav = useNavigate();
  const { state } = useLocation();
  const from = state?.from;

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState({
    nationality: "",
    bizCategory: "",
    status: "",
    estimatePeriod: "",
    workExperience: "",
    degree: "",
    koreanLevel: "",
  });

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const me = await getUserProfile();
        log("profile:", me);
        setProfile(me);
        setForm({
          nationality: me?.nationality ?? "",
          bizCategory: me?.bizCategory ?? "",
          status: me?.status ?? "D-10",
          estimatePeriod:
            typeof me?.estimatePeriod === "number"
              ? `${me.estimatePeriod}개월`
              : me?.estimatePeriod ?? "",
          workExperience:
            me?.workExperience != null ? String(me.workExperience) : "",
          degree: me?.degree ?? "",
          koreanLevel: me?.koreanLevel ?? "",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isEditing && firstInputRef.current) firstInputRef.current.focus();
  }, [isEditing]);

  const handleChange = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const inputCls =
    "w-full h-8 px-2 bg-transparent border-0 border-b text-[15px] focus:outline-none " +
    (isEditing
      ? "border-gray-300 focus:border-gray-900 text-gray-900"
      : "border-transparent text-gray-900");

  const toggleEdit = () => setIsEditing((v) => !v);

  /** 다음 단계로: basicInfo + userName 전달 */
  const handleConfirm = () => {
    const merged = {
      ...(profile || {}),
      nationality: form.nationality,
      bizCategory: form.bizCategory,
      status: form.status,
      estimatePeriod: toMonthsNumber(form.estimatePeriod),
      workExperience:
        form.workExperience !== "" ? Number(form.workExperience) : undefined,
      degree: form.degree,
      koreanLevel: form.koreanLevel,
    };
    const basicInfo = mapProfileToBasicInfo(merged);
    const userName = profile?.name ?? profile?.loginId ?? "사용자";

    if (from === "issued") {
      nav("/confirm-visa", { state: { from, basicInfo, userName } });
    } else if (from === "match") {
      nav("/confirm-more", { state: { from, basicInfo, userName } });
    } else {
      nav("/confirm-visa", { state: { from: "issued", basicInfo, userName } });
    }
  };

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">아래 정보가 맞나요?</h1>
        {loading && <p className="mt-3 text-[14px] text-gray-600">서버 통신 중...</p>}

        <div className="mt-6 w-full rounded-2xl bg-white shadow-[0_6px_24px_rgba(0,0,0,0.08)] p-4">
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
            <span className="block text-[14px] text-gray-600 mb-1">사업자 정보(업종)</span>
            <input
              type="text"
              value={form.bizCategory}
              onChange={handleChange("bizCategory")}
              disabled={!isEditing}
              className={inputCls}
            />
          </label>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">체류 자격</span>
              <input
                type="text"
                value={form.status}
                onChange={handleChange("status")}
                disabled={!isEditing}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">예상 체류 기간</span>
              <input
                type="text"
                placeholder="예: 24개월 또는 2년"
                value={form.estimatePeriod}
                onChange={handleChange("estimatePeriod")}
                disabled={!isEditing}
                className={inputCls}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">경력(년)</span>
              <input
                type="text"
                value={form.workExperience}
                onChange={handleChange("workExperience")}
                disabled={!isEditing}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">학위</span>
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
            <span className="block text-[14px] text-gray-600 mb-1">한국어 능력</span>
            <input
              type="text"
              placeholder="예: TOPIK 5급"
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
            onClick={toggleEdit}
            className="flex-1 h-11 rounded-full border border-gray-300 bg-white text-gray-900 text-[15px] font-semibold active:scale-[0.99]"
          >
            {isEditing ? "편집 종료" : "수정하기"}
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