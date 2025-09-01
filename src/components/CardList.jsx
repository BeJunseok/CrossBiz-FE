// src/components/CardList.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import GoodIcon from "../assets/good.svg";
import WarnIcon from "../assets/warning.svg";
import HotBadge from "../assets/Hot.svg";
import PurpleIcon from "../assets/purpleIcon.svg";

export default function CardList({ items = [], from: fromProp, raw }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const { state: locState } = useLocation();
  const from = fromProp ?? locState?.from ?? "history";

  const onSelect = useCallback((idx) => {
    setSelectedIdx(idx);
    setOpen(true);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selectedItem = selectedIdx != null ? items[selectedIdx] : null;

  const goDetail = (item) => {
    nav("/visa-info", {
      state: { from, raw, selected: item },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {items.map((item, idx) => {
          const isSelected = idx === selectedIdx;
          return (
            <article
              key={idx}
              onClick={() => onSelect(idx)}
              className={[
                "cursor-pointer rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.08)] overflow-visible border-2 transition-colors",
                isSelected ? "border-[#2251DD]" : "border-transparent",
              ].join(" ")}
              style={{ backgroundColor: isSelected ? "rgba(101,78,255,0.10)" : "#FFFFFF" }}
            >
              <div className="relative w-full">
                {idx === 0 && (
                  <img
                    src={HotBadge}
                    alt="가장 유력한 후보"
                    className="pointer-events-none absolute z-10 drop-shadow-md h-15 w-auto -left-6 -top-16"
                  />
                )}
                <div
                  className={`w-full px-3 py-2 text-[15px] font-bold ${
                    idx === 0 ? "bg-[#4170FF] text-white" : "bg-[#6E6E6E] text-white"
                  } rounded-t-2xl`}
                >
                  {item.name}
                </div>
              </div>

              <div className="p-2">
                {item.reason && (
                  <section className="mt-2">
                    <header className="flex items-center gap-2 mb-1">
                      <img src={GoodIcon} alt="" className="w-4 h-4" />
                      <h3 className="text-[9px] font-semibold text-gray-700">추천이유</h3>
                    </header>
                    <p className="text-[9px] text-gray-700 whitespace-pre-line">{item.reason}</p>
                  </section>
                )}

                {Array.isArray(item.cautions) && item.cautions.length > 0 && (
                  <section className="mt-3">
                    <header className="flex items-center gap-2 mb-1">
                      <img src={WarnIcon} alt="" className="w-4 h-4" />
                      <h3 className="text-[9px] font-semibold text-gray-700">주의</h3>
                    </header>
                    <ul className="pl-0 space-y-1 list-none">
                      {item.cautions.map((w, i) => (
                        <li key={i} className="text-[9px] text-gray-700">{w}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {/* 하단 모달 */}
      <div className={[
        "fixed inset-x-0 bottom-0 z-[999]",
        "transform transition-transform duration-300 ease-out",
        open ? "translate-y-0" : "translate-y-full",
      ].join(" ")}>
        <div className="mx-auto max-w-md rounded-t-2xl bg-white shadow-[0_-8px_24px_rgba(0,0,0,0.15)]">
          <div className="p-5">
            {selectedItem ? (
              <>
                <div className="flex items-center justify-between relative">
                  <h4 className="text-[15px] font-bold text-gray-900 self-center mt-2">
                    {selectedItem.name}
                  </h4>
                  <div className="shrink-0 flex ml-3 self-center">
                    <img
                      src={PurpleIcon}
                      alt="상세로 이동"
                      className="absolute -right-4 top-1/2 -translate-x-1/2 w-10 h-10 cursor-pointer"
                      onClick={() => goDetail(selectedItem)}
                    />
                  </div>
                </div>
                <p className="mt-1 inline-block text-[12px] font-medium" style={{ color: "#654EFF" }}>
                  상세 설명 및 준비서류 보러가기
                </p>
              </>
            ) : (
              <p className="text-center text-[12px] text-gray-500">카드를 선택하세요.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}