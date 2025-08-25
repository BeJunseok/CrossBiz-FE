// components/SaveToast.jsx
import { useEffect, useMemo } from "react";

export default function SaveToast({
  open,
  onClose,
  autoHideMs = 2000,
  imageSrc,                // Save.svg
  width = 351,             // Save.svg 실제 px 폭 (피그마/파일 기준)
  height = 46,             // Save.svg 실제 px 높이
  bottom = 24,             // 바닥에서 띄우는 간격(px)
  xButton = { top: 6, right: 6, w: 36, h: 36 }, // X 핫스팟
}) {
  // 비율 유지용 스타일 (모바일에선 뷰포트 기준 축소)
  const boxStyle = useMemo(() => {
    const maxW = Math.min(width, window?.innerWidth ? window.innerWidth * 0.92 : width);
    const scale = maxW / width;
    return {
      width: `${width}px`,
      height: `${height}px`,
      transformOrigin: "bottom center",
      // open/close 트랜지션은 className에서 제어
      // 실제 렌더 폭은 scale로 조정(픽셀 비율 유지)
      scale,
      WebkitTapHighlightColor: "transparent",
    };
  }, [width, height]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => onClose?.(), autoHideMs);
    return () => clearTimeout(t);
  }, [open, autoHideMs, onClose]);

  return (
    <div
      className={`
        fixed inset-0 z-[70] flex items-end justify-center
        pointer-events-none
      `}
      aria-hidden={!open}
    >
      <div
        className={`
          pointer-events-auto relative
          rounded-2xl shadow-lg
          bg-no-repeat bg-center bg-contain
          transition-all duration-300 ease-out will-change-transform opacity-0
          translate-y-[140%]   /* 닫힘: 화면 아래로 완전히 내려 보내기 */
          ${open ? "!opacity-100 !translate-y-0" : ""}
        `}
        style={{
          ...boxStyle,
          marginBottom: `calc(${bottom}px + env(safe-area-inset-bottom))`,
          backgroundImage: `url(${imageSrc})`,
        }}
        role="dialog"
        aria-live="polite"
      >
        {/* X 투명 버튼 (이미지의 X 자리에 딱 맞게) */}
        <button
          aria-label="닫기"
          onClick={onClose}
          className="absolute"
          style={{
            top: xButton.top,
            right: xButton.right,
            width: xButton.w,
            height: xButton.h,
          }}
        />
      </div>
    </div>
  );
}