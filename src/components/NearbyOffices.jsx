import { useEffect, useState, useMemo } from 'react';
import { Map, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';
import { searchNearbyKeyword } from '../api/kakaoLocal';
import MapIcon from '../assets/Map.svg'; // ← 아이콘

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

export default function NearbyOffices() {
  const [scriptLoading, scriptError] = useKakaoLoader({
    appkey: KAKAO_API_KEY,
  });

  const [pos, setPos] = useState(null); // { lat, lng }
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  const [map, setMap] = useState(null);

  // km 포맷터 (m → km, 소수 1자리)
  const toKm = (mStr) => {
    if (!mStr && mStr !== 0) return null;
    const m = Number(mStr);
    if (Number.isNaN(m)) return null;
    return (m / 1000).toFixed(m >= 1000 ? 1 : 2); // 1km 미만이면 소수 둘째자리
  };

  // 현재 위치
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (p) => setPos({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setPos({ lat: 37.5665, lng: 126.978 }) // 실패 시 서울시청
    );
  }, []);

  // 검색
  useEffect(() => {
    if (!pos) return;
    (async () => {
      try {
        const docs = await searchNearbyKeyword({
          query: '출입국외국인청',
          lat: pos.lat,
          lng: pos.lng,
          radius: 100000,
        });
        setItems(docs);
      } catch (e) {
        setErr(String(e));
      }
    })();
  }, [pos]);

  // 마커
  useEffect(() => {
    if (!map || items.length === 0) return;
    const bounds = new window.kakao.maps.LatLngBounds();
    items.forEach((item) => {
      bounds.extend(new window.kakao.maps.LatLng(item.y, item.x));
    });
    map.setBounds(bounds);
  }, [map, items]);

  const error = err || scriptError;

  return (
    <section className="mt-6">
      {/* 타이틀: 박스 바깥 */}
      <div className="flex items-center gap-2 px-1">
        <img src={MapIcon} alt="지도" className="w-5 h-5" />
        <h2 className="text-[15px] font-semibold">주변 관할기관</h2>
      </div>

      {/* 카드 박스 */}
      <div className="mt-2 rounded-2xl border border-gray-200 overflow-hidden bg-white">
        {/* 지도: 기존 h-56(224px) → 1.5배 ≈ 336px */}
        <Map
          center={pos || { lat: 37.5665, lng: 126.978 }}
          style={{ width: '100%', height: '336px' }}
          onCreate={setMap}
        >
          {/* 4. items를 순회하며 MapMarker를 선언적으로 렌더링 */}
          {items.map((item) => (
            <MapMarker
              key={item.id}
              position={{ lat: item.y, lng: item.x }}
              title={item.place_name}
            />
          ))}
        </Map>

        {error && (
          <p className="px-4 py-3 text-sm text-red-600 break-words">
            에러: {String(error)}
          </p>
        )}

        {/* 리스트: 3개 높이만 보이게 스크롤 (대략 3*88px = 264px 뷰포트) */}
        <ul className="divide-y max-h-[264px] overflow-y-auto">
          {items.map((p) => {
            const km = toKm(p.distance);
            return (
              <li key={p.id} className="p-4">
                <p className="text-[15px] font-semibold">{p.place_name}</p>
                <p className="text-sm text-gray-500">
                  {p.road_address_name || p.address_name}
                </p>
                <div className="mt-1 text-xs text-gray-400">
                  {km ? `${km}km` : ''} · {p.phone || '전화번호 없음'}
                </div>
              </li>
            );
          })}
          {items.length === 0 && !error && (
            <li className="p-4 text-sm text-gray-500">주변에 결과가 없어요.</li>
          )}
        </ul>
      </div>
    </section>
  );
}
