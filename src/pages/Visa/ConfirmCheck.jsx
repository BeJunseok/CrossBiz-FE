// src/pages/ConfirmCheck.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import visaUser from "../../data/visaUser.json";
import commonUser from "../../data/commonUser.json";
import { getUserProfile, updateUserProfile } from "@/api/auth/Auth";

const LS_KEY = "confirm_check_form_issued_v1";

export default function ConfirmCheck() {
  const nav = useNavigate();
  const { state } = useLocation();
  const from = state?.from; // "issued" | "match" | undefined

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState(null);
  const [profile, setProfile] = useState(null); // ★ 조회 응답 보관(userId 등)
  const firstInputRef = useRef(null);

  const toStr = (v) => (v == null ? "" : String(v));
  const onlyNum = (s = "") => String(s).replace(/\D/g, "");
  const toNumOrNull = (v) => (v === "" || v == null ? null : Number(v));

  // ---------- JSON fallback ----------
  const buildFormFromJson = (source) => {
    const basic = source?.request?.basicInfo ?? {};
    const visa = source?.request?.withVisaInfo ?? {};
    return {
      nationality: toStr(basic.nationality),
      bizInfo: toStr(basic.status),
      status: toStr(visa.visaType || basic.status),
      estimatePeriod:
        basic.estimatePeriod != null
          ? `${toStr(basic.estimatePeriod)}개월`
          : toStr(visa.stayPeriod),
      workExperience: toStr(basic.workExperience),
      degree: toStr(basic.degree),
      koreanLevel: toStr(basic.koreanLevel),
    };
  };

  // ---------- form state ----------
  const [form, setForm] = useState({
    nationality: "",
    bizInfo: "",
    status: "기업투자",
    estimatePeriod: "",
    workExperience: "",
    degree: "",
    koreanLevel: "",
  });

  // ---------- fetch profile & map ----------
  useEffect(() => {
    let mounted = true;

    const mapProfileToForm = (p) => ({
      nationality: toStr(p?.nationality),
      bizInfo: toStr(p?.bizCategory), // 사업자 정보 ← bizCategory ("구직")
      status: toStr(p?.status),       // 체류 자격 ← status ("D-10")
      estimatePeriod: p?.estimatePeriod != null ? `${toStr(p.estimatePeriod)}개월` : "",
      workExperience: toStr(p?.workExperience),
      degree: toStr(p?.degree),
      koreanLevel: toStr(p?.koreanLevel),
    });

    (async () => {
      try {
        setLoading(true);
        setLoadErr(null);
        const res = await getUserProfile(); // 반드시 res.data만 반환
        if (!mounted) return;
        setProfile(res);                    // ★ userId 등 저장
        setForm(mapProfileToForm(res));
      } catch (e) {
        setLoadErr(e?.message ?? "회원정보 조회에 실패했어요.");
        if (from === "issued") setForm(buildFormFromJson(visaUser));
        else if (from === "match") setForm(buildFormFromJson(commonUser));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [from]);

  // 편집 모드 전환 시 포커스
  useEffect(() => {
    if (isEditing && firstInputRef.current) firstInputRef.current.focus();
  }, [isEditing]);

  // 변경 시 저장(issued일 때만)
  useEffect(() => {
    if (from === "issued") localStorage.setItem(LS_KEY, JSON.stringify(form));
  }, [form, from]);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  // 저장 토글 (PATCH)
  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      const payload = {
        nationality: form.nationality || null,
        bizCategory: form.bizInfo || null, // 사업자 정보
        status: form.status || null,       // 체류 자격
        estimatePeriod: form.estimatePeriod
          ? Number(onlyNum(form.estimatePeriod)) // "4개월" → 4
          : null,
        workExperience: form.workExperience !== "" ? Number(form.workExperience) : null,
        degree: form.degree || null,
        koreanLevel: form.koreanLevel || null,
      };
      await updateUserProfile?.(payload);
      // 재조회 반영
      const refreshed = await getUserProfile();
      setProfile(refreshed);
      setForm({
        nationality: toStr(refreshed?.nationality),
        bizInfo: toStr(refreshed?.bizCategory),
        status: toStr(refreshed?.status),
        estimatePeriod:
          refreshed?.estimatePeriod != null ? `${toStr(refreshed.estimatePeriod)}개월` : "",
        workExperience: toStr(refreshed?.workExperience),
        degree: toStr(refreshed?.degree),
        koreanLevel: toStr(refreshed?.koreanLevel),
      });
      if (from === "issued") localStorage.setItem(LS_KEY, JSON.stringify(form));
      alert("수정한 내용을 저장했어요.");
      setIsEditing(false);
    } catch (e) {
      console.error("[ConfirmCheck] update failed:", e);
      alert("저장에 실패했어요. 잠시 후 다시 시도해주세요.");
    }
  };

  // 확인 → 다음 페이지로 basicInfo(state) 전달 (userId 포함)
  const handleConfirm = () => {
    const basicInfo = {
      userId: toNumOrNull(profile?.userId),                       // ★ 필수
      age: toNumOrNull(profile?.age),
      bizStatus: form.bizInfo || profile?.bizStatus || null,      // 예: "창업예정"
      nationality: form.nationality || profile?.nationality || null,
      status: form.status || profile?.status || null,             // 예: "D-10"
      bizCategory: profile?.bizCategory || null,                  // 예: "음식점업"/"구직"
      estimatePeriod: form.estimatePeriod
        ? toNumOrNull(onlyNum(form.estimatePeriod))
        : toNumOrNull(profile?.estimatePeriod),
      workExperience:
        form.workExperience !== "" ? toNumOrNull(form.workExperience) : toNumOrNull(profile?.workExperience),
      degree: form.degree || profile?.degree || null,
      koreanLevel: form.koreanLevel || profile?.koreanLevel || null,
    };

    const nextState = { payload: { basicInfo }, from: "confirm-check" };
    if (from === "match") nav("/confirm-more", { state: nextState });
    else nav("/confirm-visa", { state: nextState });
  };

  const inputCls =
    "w-full h-8 px-2 bg-transparent border-0 border-b text-[15px] focus:outline-none " +
    (isEditing
      ? "border-gray-300 focus:border-gray-900 text-gray-900"
      : "border-transparent text-gray-900");

  return (
    <main className="min-h-screen w-full flex items-start justify-center">
      <section className="w-full max-w-[360px] px-6 pt-20 pb-24">
        <h1 className="text-[22px] font-extrabold text-gray-900">아래 정보가 맞나요?</h1>

        {loading && <p className="mt-3 text-sm text-gray-500">회원정보를 불러오는 중…</p>}
        {loadErr && !loading && <p className="mt-3 text-sm text-red-500">{loadErr}</p>}

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
            <span className="block text-[14px] text-gray-600 mb-1">사업자 정보</span>
            <input
              type="text"
              value={form.bizInfo} // ← bizCategory("구직")
              onChange={handleChange("bizInfo")}
              disabled={!isEditing}
              className={inputCls}
            />
          </label>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">체류 자격</span>
              <input
                type="text"
                value={form.status} // ← status("D-10")
                onChange={handleChange("status")}
                disabled={!isEditing}
                className={inputCls}
              />
            </label>
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">예상 체류 기간</span>
              <input
                type="text"
                value={form.estimatePeriod} // `${estimatePeriod}개월`
                onChange={handleChange("estimatePeriod")}
                disabled={!isEditing}
                className={inputCls}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <label className="block">
              <span className="block text-[14px] text-gray-600 mb-1">경력</span>
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