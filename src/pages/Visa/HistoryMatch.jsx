import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LeftIcon from '../../assets/LeftIcon.svg';
import ShareIcon from '../../assets/Share.svg';
import commonUser from '@/data/CommonUser.json';
import visaUser from '../../data/visaUser.json';

/* ===== helpers ===== */
const norm = (s = '') =>
  String(s)
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[‐-‒–—−]/g, '-');

const matchName = (a = '', b = '') => {
  const A = norm(a),
    B = norm(b);
  return A === B || A.includes(B) || B.includes(A);
};

const extractRecList = (raw) =>
  raw?.recommendations ??
  raw?.response?.recommendedVisas ??
  raw?.recommendedVisas ??
  [];

const toSelected = (v = {}) => ({
  name: v?.name,
  reason: v?.reason,
  cautions: Array.isArray(v?.cautions)
    ? v.cautions
    : v?.cautions
      ? [v.cautions]
      : [],
  purpose: v?.purpose,
  target: v?.target,
  qualification: v?.qualification,
  requiredDocuments: v?.requiredDocuments,
  benefits: v?.benefits,
});

export default function HistoryMatch() {
  const nav = useNavigate();
  const location = useLocation();

  const from = location.state?.from ?? 'history'; // "match" | "history"
  const userName = location.state?.userName ?? 'Anna';

  const storageKey = from === 'match' ? 'visa_history_match' : 'visa_history';

  const [history, setHistory] = useState([]);
  const [lastRaw, setLastRaw] = useState(null);

  useEffect(() => {
    // 1) 히스토리
    try {
      const raw = JSON.parse(localStorage.getItem(storageKey) || '[]');
      setHistory(Array.isArray(raw) ? raw : []);
    } catch {
      setHistory([]);
    }

    // 2) 최근 raw 복구
    const tryKeys = [
      `${storageKey}_last_raw`,
      'visa_last_raw_match',
      'visa_last_raw',
    ];
    for (const k of tryKeys) {
      const v = localStorage.getItem(k);
      if (v) {
        try {
          setLastRaw(JSON.parse(v));
          break;
        } catch {}
      }
    }
  }, [storageKey]);

  // ✅ 우선 순위: (A) 이전 페이지에서 내려준 raw → (B) lastRaw → (C) 샘플
  const incomingRaw =
    location.state?.raw ??
    lastRaw ??
    (from === 'match' ? commonUser : visaUser);

  // 날짜 내림차순 정렬
  const sorted = useMemo(() => {
    const toNum = (d) => Number(String(d || '').replaceAll('.', ''));
    return [...history].sort((a, b) => toNum(b.date) - toNum(a.date));
  }, [history]);

  // CardList와 동일 포맷으로 넘기기: { from, raw, selected }, search ?name=
  const goVisaInfo = (typeName) => {
    const list = extractRecList(incomingRaw);
    const found = list.find((v) => matchName(v?.name, typeName));
    const selected = found ? toSelected(found) : { name: typeName };

    nav(`/visa-info?name=${encodeURIComponent(typeName)}`, {
      state: {
        from,
        userName,
        raw: incomingRaw, // ✅ raw 그대로 전달
        selected, // ✅ 하단 모달과 동일 구조
      },
    });
  };

  return (
    <main className="min-h-screen w-full flex justify-center bg-white">
      <section className="w-[393px] px-0 py-2">
        {/* 헤더 */}
        <header className="relative h-[75px] border-b border-gray-200 flex items-center justify-center px-4">
          <img
            src={LeftIcon}
            alt="뒤로가기"
            className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => nav(-1)}
          />
          <h1 className="text-center text-[18px] font-semibold text-gray-900">
            비자 매칭 히스토리
          </h1>
        </header>

        {/* 리스트 카드 */}
        <div className="mt-12 w-full bg-white overflow-hidden">
          <div className="flex items-center justify-between bg-[#E8E8E8] px-14 py-2">
            <span className="text-[13px] font-semibold text-gray-600">
              유형
            </span>
            <span className="text-[13px] font-semibold text-gray-600">
              날짜
            </span>
          </div>

          <ul className="divide-y divide-gray-100">
            {sorted.map((row) => (
              <li key={row.id} className="py-3 px-4">
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    className="text-left text-[14px] text-gray-900 underline decoration-transparent hover:decoration-gray-300"
                    onClick={() => goVisaInfo(row.type)}
                  >
                    {row.type}
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] text-gray-700">
                      {row.date}
                    </span>
                    <button
                      type="button"
                      aria-label="상세 보기"
                      className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 bg-[#F3F3F3] hover:bg-gray-50"
                      onClick={() => goVisaInfo(row.type)}
                    >
                      <img src={ShareIcon} alt="" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {sorted.length === 0 && (
              <li className="py-4 px-4 text-[12px] text-gray-500">
                저장된 기록이 없습니다.
              </li>
            )}
          </ul>

          <div className="border-t border-gray-200" />
        </div>
      </section>
    </main>
  );
}
