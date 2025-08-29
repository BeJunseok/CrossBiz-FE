import { gradeColors, defaultPolygonStyle } from '@/data/gradeConfig';
import { polygonCentroid } from 'd3-polygon';

/**
 * 폴리곤의 중심점 계산
 */
export const calculatePolygonCenter = (polygonCoordinates) => {
  const centerPoint = polygonCentroid(polygonCoordinates);

  return {
    lat: centerPoint[1],
    lng: centerPoint[0],
  };
};

/**
 * 등급에 따른 폴리곤 스타일 생성
 */
export const createPolygonStyle = (grade) => {
  const colors = gradeColors[grade] || gradeColors[3]; // 기본값은 3등급

  return {
    ...defaultPolygonStyle,
    strokeColor: colors.border,
    fillColor: colors.background.replace(/rgba?\(([^)]+)\)/, 'rgb($1)'), // rgba를 rgb로 변환
    fillOpacity: 0.6,
  };
};

/**
 * 지도의 적절한 중심점과 줌 레벨 계산
 */
export const calculateMapBounds = (features) => {
  if (!features || features.length === 0) {
    return {
      center: { lat: 37.5502295, lng: 126.9246317 }, // 기본값(홍익대 T동)
      level: 6,
    };
  }

  let minLat = Infinity,
    maxLat = -Infinity;
  let minLng = Infinity,
    maxLng = -Infinity;

  features.forEach((feature) => {
    const polygons = feature.geometry.coordinates.flat(1);
    polygons.forEach((ring) => {
      ring.forEach((coord) => {
        const [lng, lat] = coord;
        minLat = Math.min(minLat, lat);
        maxLat = Math.max(maxLat, lat);
        minLng = Math.min(minLng, lng);
        maxLng = Math.max(maxLng, lng);
      });
    });
  });

  return {
    center: {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    },
    sw: { lat: minLat, lng: minLng },
    ne: { lat: maxLat, lng: maxLng },
  };
};

/**
 * 디바운스 함수
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
