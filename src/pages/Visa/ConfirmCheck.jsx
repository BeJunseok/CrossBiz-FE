// src/pages/ConfirmCheck.jsx
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { postVisaRecommendWith } from "@/api/visa";
import { getUserProfile, updateUserProfile } from "@/api/auth/Auth"; 

/** DEV에서만 로그 */
const log = (...args) => {
  if (import.meta.env.DEV) console.log(...args);
};

/** 값 선택 유틸 */
const pick = (...cands) => {
  for (const v of cands) {
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return "";
};

/** 프로필 응답 → 폼 매핑 */
function profileToForm(user) {
  if (!user) {
    return {
      nationality: "",
      bizCategory: "",
      status: "",
      estimatePeriod: "",
      workExperience: "",
      degree: "",
      koreanLevel: "",
    };
  }

  return {
    nationality: user.nationality ?? "",
    bizCategory: user.bizCategory ?? "",
    status: user.status ?? "D-10",
    estimatePeriod:
      typeof user.estimatePeriod === "number"
        ? `${user.estimatePeriod}개월`
        : (user.estimatePeriod ?? ""),
    workExperience:
      user.workExperience != null ? String(user.workExperience) : "",
    degree: user.degree ?? "",
    koreanLevel: user.koreanLevel ?? "",
  };
}

/** 화면 폼 → /users/me PATCH 본문 */
function formToUserUpdate(form) {
  const monthNum = (() => {
    if (typeof form.estimatePeriod === "number") return form.estimatePeriod;
    const m = String(form.estimatePeriod || "").match(/\d+/);
    return m ? Number(m[0]) : undefined;
  })();

  const workNum =
    form.workExperience !== "" && !Number.isNaN(Number(form.workExperience))
      ? Number(form.workExperience)
      : undefined;

  return {
    nationality: form.nationality || undefined,
    bizCategory: form.bizCategory || undefined,
    status: form.status || undefined,
    estimatePeriod: monthNum, // 서버가 숫자(개월) 받는다고 가정
    workExperience: workNum,
    degree: form.degree || undefined,
    koreanLevel: form.koreanLevel || undefined,
  };
}

/** 화면 → 비자추천 POST override (기존 postVisaRecommendWith 형태에 맞춤) */
function formToVisaOverrides(form) {
  const workNum =
    form.workExperience !== "" && !Number.isNaN(Number(form.workExperience))
      ? Number(form.workExperience)
      : undefined;

  const monthNum = (() => {
    if (typeof form.estimatePeriod === "number") return form.estimatePeriod;
    const m = String(form.estimatePeriod || "").match(/\d+/);
    return m ? Number(m[0]) : undefined;
  })();

  return {
    basicInfo: {
      nationality: form.nationality || undefined,
      status: form.status || undefined,
      bizCategory: form.bizCategory || undefined,
      estimatePeriod: monthNum,
      workExperience: workNum,
      degree: form.degree || undefined,
      koreanLevel: form.koreanLevel || undefined,
    },
    withVisaInfo: {
      stayPeriod: form.estimatePeriod || undefined, // "2년" 같은 표기 사용 시
      visaType: form.status || undefined,
    },
  };
}

export default function ConfirmCheck() {
  const nav = useNavigate();
  const { state } = useLocation();
  const from = state?.from;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
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

  /** 초기 로드: 프로필 기반으로 폼 채움 */
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const me = await getUserProfile(); // ← /users/me
        if (!mounted) return;
        log("👤 profile:", me);
        setForm(profileToForm(me));
      } catch (e) {
        console.error("프로필 로드 실패:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // 편집 모드 전환 시 포커스
  useEffect(() => {
    if (isEditing && firstInputRef.current) firstInputRef.current.focus();
  }, [isEditing]);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  /** 저장: 프로필 PATCH → 비자추천 POST */
  const handleEditToggle = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }
    try {
      setLoading(true);
      // 1) 사용자 정보 업데이트
      const userUpdate = formToUserUpdate(form);
      await updateUserProfile(userUpdate); // ← PATCH /users/me

      // 2) "전과 같이 POST" (비자 추천)
      const overrides = formToVisaOverrides(form);
      await postVisaRecommendWith(overrides);

      setIsEditing(false);
      alert("서버에 저장했어요.");
    } catch (e) {
      console.error("저장 실패:", e);
      alert("저장 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (from === "match") nav("/confirm-more");
    else if (from === "issued") nav("/confirm-visa");
    else nav("/confirm-more");
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
                value={form.estimatePeriod}
                onChange={handleChange("estimatePeriod")}
                disabled={!isEditing}
                className={inputCls}
                placeholder="예: 24개월 또는 2년"
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
              value={form.koreanLevel}
              onChange={handleChange("koreanLevel")}
              disabled={!isEditing}
              className={inputCls}
              placeholder="예: TOPIK 5급"
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