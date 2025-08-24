import KakaoMap from '@/components/Analysis/Map/KakaoMap';
import MapHeader from '@/components/Analysis/Map/MapHeader';
import { useNavigate } from 'react-router-dom';

const MapView = () => {
  const nav = useNavigate();

  const handleDistrictClick = (district) => {
    if (district && district.id) {
      nav(`/analysis/${district.id}`);
    } else {
      console.error('클릭된 지역의 ID를 찾을 수 없습니다:', district);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col">
      <MapHeader />

      <main className="flex-1">
        <KakaoMap
          onDistrictClick={handleDistrictClick}
          className="w-full h-full"
        />
      </main>
    </div>
  );
};

export default MapView;
