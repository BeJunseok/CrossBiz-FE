import { useEffect } from 'react';
import { convertToKakaoLatLng, createPolygonStyle } from '@/utils/mapUtils';

const DistrictPolygon = ({ district, map, onPolygonClick, addPolygon }) => {
  useEffect(() => {
    if (!map || !district || !addPolygon) return;

    // MultiPolygon의 첫 번째 폴리곤의 외곽 링만 사용
    const coordinates = district.geometry.coordinates[0][0];

    // 좌표를 카카오맵 LatLng 객체로 변환
    const path = convertToKakaoLatLng(coordinates);

    // 등급에 따른 스타일 생성
    const style = createPolygonStyle(district.grade);

    // 클릭 핸들러
    const handleClick = (districtName) => {
      if (onPolygonClick) {
        onPolygonClick(districtName);
      }
    };

    // 폴리곤 추가
    const polygon = addPolygon(path, style, handleClick, district.name);

    return () => {
      // 컴포넌트 언마운트 시 폴리곤 제거는 상위 컴포넌트에서 처리
    };
  }, [district, map, onPolygonClick, addPolygon]);

  // 이 컴포넌트는 렌더링할 DOM 요소가 없음
  return null;
};

export default DistrictPolygon;
