import KakaoMap from '@/components/Analysis/Map/KakaoMap';
import MapHeader from '@/components/Analysis/Map/MapHeader';

const MapView = () => {
  const handleDistrictClick = (districtName) => {
    console.log(`Clicked district: ${districtName}`);
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
