import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useDistrictData } from '@/hooks/useDistrictData';
import {
  calculatePolygonCenter,
  convertToKakaoLatLng,
  createPolygonStyle,
} from '@/utils/mapUtils';
import Loading from '@/components/common/Loading';
import GradeMarker from '@/components/Analysis/Map/GradeMarker';

const KakaoMap = ({ onDistrictClick, className = '' }) => {
  const mapContainer = useRef(null);
  const {
    map,
    isLoading: mapLoading,
    error: mapError,
    addPolygon,
    clearPolygons,
  } = useKakaoMap(mapContainer);

  const {
    districts,
    isLoading: dataLoading,
    error: dataError,
  } = useDistrictData();

  const gradeOverlaysRef = useRef([]);

  useEffect(() => {
    if (!map || districts.length === 0) return;

    // 기존에 그려진 폴리곤과 마커를 지움
    clearPolygons();
    gradeOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    gradeOverlaysRef.current = [];

    districts.forEach((district) => {
      const isMultiPolygon = district.geometry.type === 'MultiPolygon';
      const coordinates = isMultiPolygon
        ? district.geometry.coordinates[0][0]
        : district.geometry.coordinates[0];

      if (coordinates && coordinates.length > 0) {
        const path = convertToKakaoLatLng(coordinates);
        const style = createPolygonStyle(district.grade);
        addPolygon(path, style, () => onDistrictClick(district));
      }

      // CustomOverlay
      const center = calculatePolygonCenter(district.geometry);
      if (center) {
        const position = new window.kakao.maps.LatLng(center.lat, center.lng);
        const contentNode = document.createElement('div');
        const root = ReactDOM.createRoot(contentNode);
        root.render(<GradeMarker grade={district.grade} />);
        const customOverlay = new window.kakao.maps.CustomOverlay({
          position,
          content: contentNode,
          map: null,
        });
        gradeOverlaysRef.current.push(customOverlay);
      }
    });

    // 지도 줌에 따라 마커를 표신
    const handleZoomChange = () => {
      const level = map.getLevel();
      const isZoomedIn = level <= 6;
      gradeOverlaysRef.current.forEach((overlay) => {
        overlay.setMap(isZoomedIn ? map : null);
      });
    };

    const zoomChangeListener = () => handleZoomChange();
    window.kakao.maps.event.addListener(
      map,
      'zoom_changed',
      zoomChangeListener
    );

    handleZoomChange();

    return () => {
      if (map) {
        window.kakao.maps.event.removeListener(
          map,
          'zoom_changed',
          zoomChangeListener
        );
      }
    };
  }, [map, districts, clearPolygons, addPolygon, onDistrictClick]);

  const isLoading = mapLoading || dataLoading;
  const hasError = mapError || dataError;

  if (hasError) {
    return (
      <div className={`relative ${className} w-full h-full`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              지도를 불러올 수 없습니다
            </h3>
            <p className="text-gray-600">{mapError || dataError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} w-full h-full`}>
      <div
        ref={mapContainer}
        className="w-full h-full bg-gray-100"
        style={{ minHeight: '400px' }}
      />

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <Loading message="지도를 불러오는 중..." />
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
