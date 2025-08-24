import { gradeColors, defaultPolygonStyle } from '../data/gradeConfig';

/**
 * 카카오 지도 API 스크립트 로드
 */
export const loadKakaoMapScript = (appKey) => {
  return new Promise((resolve, reject) => {
    if (window.kakao && window.kakao.maps) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        resolve();
      });
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

/**
 * 좌표 배열을 카카오맵 LatLng 객체 배열로 변환
 */
export const convertToKakaoLatLng = (coordinates) => {
  return coordinates.map(
    (coord) => new window.kakao.maps.LatLng(coord[1], coord[0])
  );
};

/**
 * 폴리곤의 중심점 계산
 */
export const calculatePolygonCenter = (geometry) => {
  const { type, coordinates } = geometry;

  if (
    !coordinates ||
    coordinates.length === 0 ||
    !coordinates[0] ||
    coordinates[0].length === 0
  ) {
    console.error('Invalid coordinates data received:', coordinates);
    return null;
  }

  let mainPolygon;
  const isMultiPolygon = type === 'MultiPolygon';

  if (isMultiPolygon) {
    let maxArea = 0;
    mainPolygon = coordinates[0];
    coordinates.forEach((polygon) => {
      const currentArea = polygonArea(polygon[0]);
      if (currentArea > maxArea) {
        maxArea = currentArea;
        mainPolygon = polygon;
      }
    });
  } else {
    mainPolygon = coordinates;
  }

  // 폴리곤의 모든 꼭지점의 평균 좌표로 중심점 계산
  const centerPoint = calculateCentroid(mainPolygon[0]);

  return {
    lat: centerPoint[1],
    lng: centerPoint[0],
  };
};

/**
 * 폴리곤의 중심점(centroid) 계산 - 간단한 평균 좌표 방식
 */
const calculateCentroid = (ring) => {
  let sumX = 0;
  let sumY = 0;
  const count = ring.length - 1; // 마지막 점은 첫 번째 점과 같으므로 제외

  for (let i = 0; i < count; i++) {
    const [x, y] = ring[i];
    sumX += x;
    sumY += y;
  }

  return [sumX / count, sumY / count];
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
  let minLat = Infinity,
    maxLat = -Infinity;
  let minLng = Infinity,
    maxLng = -Infinity;

  features.forEach((feature) => {
    // MultiPolygon을 고려하여 모든 좌표를 순회
    const polygons =
      feature.geometry.type === 'Polygon'
        ? feature.geometry.coordinates
        : feature.geometry.coordinates.flat(1);

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

  const sw = new window.kakao.maps.LatLng(minLat, minLng);
  const ne = new window.kakao.maps.LatLng(maxLat, maxLng);

  return {
    center: {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    },
    bounds: new window.kakao.maps.LatLngBounds(sw, ne),
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

// 폴리곤의 면적을 계산하는 헬퍼 함수 (Shoelace formula)
const polygonArea = (ring) => {
  let area = 0;
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    area += ring[i][0] * ring[j][1];
    area -= ring[j][0] * ring[i][1];
  }

  return Math.abs(area / 2);
};
