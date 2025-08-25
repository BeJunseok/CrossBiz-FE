// src/api/kakaoLocal.js
export async function searchNearbyKeyword({ query, lng, lat, radius = 10000 }) {
  // 1) 환경변수 체크
  const REST_KEY = import.meta.env.VITE_KAKAO_REST_KEY;
  if (!REST_KEY) {
    throw new Error("REST 키가 비어있습니다(.env에 VITE_KAKAO_REST_KEY 설정 필요)");
  }

  const url = new URL("https://dapi.kakao.com/v2/local/search/keyword.json");
  url.searchParams.set("query", query);

  // 좌표가 있을 때만 거리 정렬/반경 적용
  if (typeof lng === "number" && typeof lat === "number") {
    url.searchParams.set("x", String(lng));
    url.searchParams.set("y", String(lat));
    url.searchParams.set("radius", String(Math.min(Math.max(radius, 0), 20000)));
    url.searchParams.set("sort", "distance");
  }

  const res = await fetch(url, {
    headers: { Authorization: `KakaoAK ${REST_KEY}` },
  });

  // 응답 파싱
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  if (!res.ok) {
    // 카카오 에러 포맷: { msg, code }
    const msg = data?.msg || data?.message || res.statusText;
    const code = data?.code ? ` (code: ${data.code})` : "";
    throw new Error(`HTTP ${res.status}${code}: ${msg}`);
  }

  return data.documents || [];
}