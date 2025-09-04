import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";




export default function VisaHome() {
  const nav = useNavigate();
  const goMatch = () => nav("/loading-prev", {state: {from: "match"}});
  const goIssued = () => nav("/loading-prev", {state: {from: "issued"}});
  const [visaData, setVisaData] = useState(null);

 
  
  return (
    <>
 
      {visaData && (<pre>{JSON.stringify(visaData,null,2)}</pre>)}
      <section
        className="
          absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
          w-[352px] h-[390px] rounded-[28px]
          bg-gradient-to-b from-[#454451] to-[#191D24]
          shadow-[0_12px_24px_rgba(0,0,0,0.25)]
          p-3
        "
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
          backgroundImage: "url('/back1.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        />
        {/* 카드 내부 레이아웃:
            - content: 카드 전체를 채움(inset-0)
            - 제목: flex-1 영역 정중앙
            - 하단 요소: 제목 기준으로 margin-top으로 간격 */}
        <div className="absolute inset-0 px-6 text-center text-white flex flex-col">
          {/* 1) 제목 = 카드 정 중앙 */}
          <div className="flex-1 flex justify-center">
            <h1 className="text-[25px] font-bold leading-snug  mt-40">
              AI가 <b>Anna</b> 님의 
              <br />
              조건을 고려해
              <br />
              최적의 비자를 안내해줘요.
            </h1>
          </div>

         
          <p
          role="button"
          tabIndex={0}
          onClick={goIssued}
          onKeyDown={(e) => e.key === "Enter" && goIssued()}
          className="text-[13px] text-[#C5CBD4] underline underline-offset-2 mt-7 cursor-pointer">
            이미 발급받은 비자가 있으세요?
          </p>

          <button
            type="button"
            className="w-full h-12 rounded-full font-bold
                       bg-[#C9CAF1] text-black shadow-[0_2px_0_rgba(0,0,0,0.06)]
                       active:translate-y-[1px] mt-5 mb-3 hover:scale-101 py-3"
            onClick={goMatch}
          >
            비자 매칭받기
          </button>
        </div>
      </section>

      {/* ───────── 로봇/비자: 레이아웃(main) 기준 absolute ───────── */}
      <img
        src="/robot.svg"
        alt="AI 로봇"
        className="absolute z-10 left-1/2 -translate-x-1/2 pointer-events-none select-none"
        style={{ top: "calc(50% - 260px)"}}
      />

      {/* VISA 큰 카드 (오른쪽 위) */}
      <img
        src="/visa1.svg"
        alt="VISA 카드1"
        className="absolute z-10 pointer-events-none select-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
        style={{
          left: "calc(50% + 92px)",
          top: "calc(50% - 280px)",
          transform: "translateX(-50%) rotate(-20deg)",
        }}
      />

      {/* VISA 작은 카드 (더 오른쪽·더 위) */}
      <img
        src="/visa2.svg"
        alt="VISA 카드2"
        className="absolute z-10 pointer-events-none select-none drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
        style={{
          left: "calc(50% + 107px)",
          top: "calc(50% - 295px)",
          transform: "translateX(-50%) rotate(-20deg)",
        }}
      />
    </>
  );
}