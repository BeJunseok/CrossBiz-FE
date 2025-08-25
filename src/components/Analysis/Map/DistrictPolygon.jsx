import { useEffect } from 'react';
import { convertToKakaoLatLng, createPolygonStyle } from '@/utils/mapUtils';

const DistrictPolygon = ({ district, map, onPolygonClick, addPolygon }) => {
  useEffect(() => {
    if (!map || !district || !addPolygon) return;

    
    const isMultiPolygon = district.geometry.type === 'MultiPolygon';
    const coordinates = isMultiPolygon
      ? district.geometry.coordinates[0][0] // MultiPolygon의 경우
      : district.geometry.coordinates[0]; // Polygon의 경우

    // coordinates가 유효하지 않으면 아무것도 하지 않음
    if (!coordinates || coordinates.length === 0) return;

    const path = convertToKakaoLatLng(coordinates);
    const style = createPolygonStyle(district.grade);

    const handleClick = () => {
      if (onPolygonClick) {
        onPolygonClick(district);
      }
    };

    addPolygon(path, style, handleClick);
  }, [district, map, onPolygonClick, addPolygon]);

  return null;
};

export default DistrictPolygon;
