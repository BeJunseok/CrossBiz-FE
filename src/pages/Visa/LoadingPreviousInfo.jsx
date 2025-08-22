// src/pages/LoadingPreviousInfo.jsx
import React from "react";
import loadingIcon from "../../assets/loading.svg"; // 네가 저장한 SVG

export default function LoadingPreviousInfo() {
  return (
    <main className="min-h-screen w-full bg-white flex items-center justify-center">
      <section
        className="
          w-full max-w-[360px] px-6 py-12
          flex flex-col items-center text-center
        "
        aria-busy="true"
        aria-live="polite"
      >
     
        <h2 className="text-[25px] leading-snug font-semibold text-gray-800 mb-6">
          이전에 입력했던
          <br />
          정보를 불러오는중…
        </h2>

        
        <img
          src={loadingIcon}
          alt="로딩중"
          className=" animate-spin select-none"
          draggable="false"
        />
      </section>
    </main>
  );
}