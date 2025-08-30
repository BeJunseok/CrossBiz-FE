import { useState, useMemo } from 'react';
import {
  Map,
  Polygon,
  CustomOverlayMap,
  useKakaoLoader,
} from 'react-kakao-maps-sdk';
import { useDistrictData } from '@/hooks/useDistrictData';
import {
  calculatePolygonCenter,
  createPolygonStyle,
  calculateMapBounds,
} from '@/utils/mapUtils';
import Loading from '@/components/common/Loading';
import GradeMarker from '@/components/Analysis/Map/GradeMarker';

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_MAP_API_KEY;
const CENTERS_CACHE_KEY = 'district_centers';

const KakaoMap = ({ onDistrictClick, className = '', selectedGrade }) => {
  const [scriptLoading, scriptError] = useKakaoLoader({
    appkey: KAKAO_API_KEY,
  });

  const [map, setMap] = useState(null);
  const [showMarkers, setShowMarkers] = useState(false);
  const {
    districts,
    isLoading: dataLoading,
    error: dataError,
  } = useDistrictData();

  const initialMapState = useMemo(() => {
    if (districts.length > 0) {
      const { center, bounds } = calculateMapBounds(districts);
      return { center, level: 7 };
    }

    return {
      center: { lat: 37.5502295, lng: 126.9246317 }, // 기본값(홍익대 T동)
      level: 6,
    };
  }, [districts]);

  // 드롭다운에서 선택된 구역만 지도에 표시
  const filteredDistricts = useMemo(() => {
    if (!selectedGrade || selectedGrade === 'all') {
      return districts;
    }
    const gradeNumber = parseInt(selectedGrade, 10);
    return districts.filter((district) => district.grade === gradeNumber);
  }, [districts, selectedGrade]);

  // 로컬스토리지 저장 기능이 포함된 폴리곤 중심점 계산
  const districtCenters = useMemo(() => {
    if (districts.length === 0) return {};

    const cachedCenters =
      JSON.parse(localStorage.getItem(CENTERS_CACHE_KEY)) || {};
    const newCenters = { ...cachedCenters };
    let needsCacheUpdate = false;

    districts.forEach((district) => {
      if (!newCenters[district.id]) {
        newCenters[district.id] = calculatePolygonCenter(
          district.geometry.coordinates[0][0]
        );
        needsCacheUpdate = true;
      }
    });

    if (needsCacheUpdate) {
      localStorage.setItem(CENTERS_CACHE_KEY, JSON.stringify(newCenters));
    }

    return newCenters;
  }, [districts]);

  // 지도 줌에 따라 마커를 표시
  const handleZoomChange = () => {
    const level = map.getLevel();
    setShowMarkers(level <= 6);
  };

  const isLoading = scriptLoading || dataLoading;
  const hasError = scriptError || dataError;

  if (hasError) {
    return (
      <div className={`relative ${className} w-full h-full`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-4">
            <h3 className="text-lg font-semibold text-red-600 mb-2">
              지도를 불러올 수 없습니다
            </h3>
            <p className="text-gray-600">{String(hasError)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} w-full h-full`}>
      {!isLoading && (
        <Map
          center={initialMapState.center}
          level={initialMapState.level}
          style={{ width: '100%', height: '100%' }}
          onCreate={setMap}
          onZoomChanged={handleZoomChange}
        >
          {filteredDistricts.map((district) => {
            const style = createPolygonStyle(district.grade);
            const path = district.geometry.coordinates[0][0].map((coord) => ({
              lat: coord[1],
              lng: coord[0],
            }));

            return (
              <Polygon
                key={district.id}
                path={path}
                strokeWeight={style.strokeWeight}
                strokeColor={style.strokeColor}
                strokeOpacity={style.strokeOpacity}
                fillColor={style.fillColor}
                fillOpacity={style.fillOpacity}
                onClick={() => onDistrictClick(district)}
                onMouseover={(polygon) =>
                  polygon.setOptions({ fillOpacity: style.fillOpacity + 0.2 })
                }
                onMouseout={(polygon) =>
                  polygon.setOptions({ fillOpacity: style.fillOpacity })
                }
              />
            );
          })}

          {showMarkers &&
            filteredDistricts.map((district) => {
              const center = districtCenters[district.id];
              return (
                <CustomOverlayMap key={district.id} position={center}>
                  <div onClick={() => onDistrictClick(district)}>
                    <GradeMarker grade={district.grade} />
                  </div>
                </CustomOverlayMap>
              );
            })}
        </Map>
      )}

      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <Loading message="지도를 불러오는 중..." />
        </div>
      )}
    </div>
  );
};

export default KakaoMap;
