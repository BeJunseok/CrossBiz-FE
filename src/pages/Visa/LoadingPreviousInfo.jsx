import React from "react";
import loadingIcon from "../../assets/loading.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export default function LoadingPreviousInfo() {
  const nav = useNavigate();
  const location = useLocation();
  

  useEffect(()=>{
    const t = setTimeout(()=>{
    nav("/confirm-check",{replace: true, state:location.state,});
  },2000);
  return () => clearTimeout(t);
},[nav,location.state])

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