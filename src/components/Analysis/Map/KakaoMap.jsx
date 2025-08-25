import React, { useRef, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { useKakaoMap } from '@/hooks/useKakaoMap';
import { useDistrictData } from '@/hooks/useDistrictData';
import { calculatePolygonCenter } from '@/utils/mapUtils';
import DistrictPolygon from '@/components/Analysis/Map/DistrictPolygon';
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

    gradeOverlaysRef.current.forEach((overlay) => overlay.setMap(null));
    gradeOverlaysRef.current = [];

    districts.forEach((district) => {
      const center = calculatePolygonCenter(district.geometry);
      if (!center) return;

      const position = new window.kakao.maps.LatLng(center.lat, center.lng);

      const contentNode = document.createElement('div');
      const root = ReactDOM.createRoot(contentNode);
      root.render(<GradeMarker grade={district.grade} />);

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: contentNode,
        map: null,
      });

      gradeOverlaysRef.current.push(customOverlay);
    });

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
  }, [map, districts]);

  const handlePolygonClick = (district) => {
    if (onDistrictClick) {
      onDistrictClick(district);
    }
  };

  useEffect(() => {
    if (map && districts.length > 0) {
      clearPolygons();
    }
  }, [map, districts, clearPolygons]);

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

      {map &&
        districts.map((district) => (
          <DistrictPolygon
            key={district.id}
            district={district}
            map={map}
            onPolygonClick={handlePolygonClick}
            addPolygon={addPolygon}
          />
        ))}

      {!isLoading && districts.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3 z-10">
          <div className="text-sm text-gray-600">
            총 <span className="font-semibold">{districts.length}</span>개
            행정구역
          </div>
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
