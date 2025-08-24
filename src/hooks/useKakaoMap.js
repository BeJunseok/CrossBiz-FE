import { useState, useEffect, useRef, useCallback } from 'react';
import { loadKakaoMapScript, calculateMapBounds } from '@/utils/mapUtils';

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;

export const useKakaoMap = (containerRef) => {
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const polygonsRef = useRef([]);

  // 지도 초기화
  const initializeMap = useCallback(async () => {
    try {
      setIsLoading(true);
      await loadKakaoMapScript(KAKAO_APP_KEY);

      if (!containerRef.current) {
        throw new Error('Map container not found');
      }

      const options = {
        center: new window.kakao.maps.LatLng(37.5502295, 126.9246317), // 홍익대 T동
        level: 6,
      };

      const mapInstance = new window.kakao.maps.Map(
        containerRef.current,
        options
      );
      setMap(mapInstance);
      setError(null);
    } catch (err) {
      console.error('Failed to initialize map:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [containerRef]);

  // 폴리곤 추가
  const addPolygon = useCallback(
    (path, style, clickHandler) => {
      if (!map) return null;

      const polygon = new window.kakao.maps.Polygon({
        map,
        path,
        ...style,
      });

      // 클릭 이벤트 추가
      if (clickHandler) {
        window.kakao.maps.event.addListener(polygon, 'click', () => {
          clickHandler();
        });
      }

      // 마우스오버 이벤트 (호버 효과)
      window.kakao.maps.event.addListener(polygon, 'mouseover', () => {
        polygon.setOptions({
          fillOpacity: style.fillOpacity + 0.2,
          strokeWeight: style.strokeWeight + 1,
        });
      });

      // 마우스아웃 이벤트
      window.kakao.maps.event.addListener(polygon, 'mouseout', () => {
        polygon.setOptions({
          fillOpacity: style.fillOpacity,
          strokeWeight: style.strokeWeight,
        });
      });

      polygonsRef.current.push(polygon);
      return polygon;
    },
    [map]
  );

  // 모든 폴리곤 제거
  const clearPolygons = useCallback(() => {
    polygonsRef.current.forEach((polygon) => {
      polygon.setMap(null);
    });
    polygonsRef.current = [];
  }, []);

  // 지도 중심과 줌 레벨 조정
  const fitBounds = useCallback(
    (features) => {
      if (!map || !features.length) return;

      const { bounds } = calculateMapBounds(features);
      map.setBounds(bounds);
    },
    [map]
  );

  // 특정 위치로 지도 이동
  const panTo = useCallback(
    (lat, lng, level) => {
      if (!map) return;

      const moveLatLng = new window.kakao.maps.LatLng(lat, lng);
      map.panTo(moveLatLng);

      if (level) {
        map.setLevel(level);
      }
    },
    [map]
  );

  useEffect(() => {
    initializeMap();

    return () => {
      clearPolygons();
    };
  }, [initializeMap, clearPolygons]);

  return {
    map,
    isLoading,
    error,
    addPolygon,
    clearPolygons,
    fitBounds,
    panTo,
    reinitialize: initializeMap,
  };
};
