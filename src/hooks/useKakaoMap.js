import { useEffect, useState } from "react";

export function useKakaoMap(containerId, center) {
  const [map, setMap] = useState(null);

  useEffect(() => {
    const load = () => window.kakao.maps.load(() => {
      const m = new window.kakao.maps.Map(
        document.getElementById(containerId),
        { center: new window.kakao.maps.LatLng(center.lat, center.lng), level: 4 }
      );
      setMap(m);
    });

    if (!window.kakao || !window.kakao.maps) {
      const s = document.createElement("script");
      s.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_JS_KEY}&autoload=false`;
      s.onload = load;
      document.head.appendChild(s);
    } else {
      load();
    }
  }, [containerId, center.lat, center.lng]);

  return map;
}