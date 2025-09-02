import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { calculatePolygonCenter } from '@/utils/mapUtils';
import { boundaryData } from '@/data/boundary';

import DashboardHeader from '@/components/Analysis/DashBoard/DashboardHeader';
import BusinessDistribution from '@/components/Analysis/DashBoard/BusinessDistribution';
import OpenCloseAnalysis from '@/components/Analysis/DashBoard/OpenCloseAnalysis';
import RevenueChart from '@/components/Analysis/DashBoard/RevenueChart';
import TrafficAnalysis from '@/components/Analysis/DashBoard/TrafficAnalysis';
import DemographicsSection from '@/components/Analysis/DashBoard/DemographicsSection';
import NearbyAreas from '@/components/Analysis/DashBoard/NearbyAreas';

import {
  getBusinessDistribution,
  getOpenCloseRatio,
  getCommercialDistrictType,
  getDailyFootfall,
  getAgeGroupFootfall,
  getGenderFootfall,
  getTimeBasedFootfall,
  getTopNDistrictsByFootfall,
  getQuarterlyFootfall,
  getDistrictGrade,
  getCategorySalesRanking,
} from '@/api/analysis/AnalysisApi';
import {
  calculatePeakTime,
  formatWeeklyTraffic,
  formatTimeTraffic,
  formatQuarterlyFootfall,
} from '@/utils/analysisDataFormatter';
import { useTranslation } from 'react-i18next';
import { getDongI18nKey } from '@/utils/dongNameMap';

const CENTERS_CACHE_KEY = 'district_centers';

export default function LocationTrackingPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const [analysisData, setAnalysisData] = useState(null);
  const [districtCenter, setDistrictCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError(t('analysis.locationTracking.noCodeError'));
      setLoading(false);
      return;
    }

    const fetchAnalysisData = async () => {
      try {
        setLoading(true);
        setError(null);

        const districtFeature = boundaryData.features.find(
          (feature) => feature.properties.adm_cd === id
        );

        if (!districtFeature) {
          throw new Error(t('analysis.locationTracking.noDistrictError'));
        }

        // 구역의 중심점을 로컬스토리지에서 가져옴
        const allCenters =
          JSON.parse(localStorage.getItem(CENTERS_CACHE_KEY)) || {};
        let center = allCenters[districtFeature.properties.adm_cd];

        // 로컬스토리지에 없으면 직접 계산
        if (!center) {
          center = calculatePolygonCenter(
            districtFeature.geometry.coordinates[0][0]
          );

          const updatedCenters = {
            ...allCenters,
            [districtFeature.properties.adm_cd]: center,
          };
          localStorage.setItem(
            CENTERS_CACHE_KEY,
            JSON.stringify(updatedCenters)
          );
        }

        setDistrictCenter(center);

        const dong = districtFeature.properties.adm_nm;
        const dongI18nKey = getDongI18nKey(dong);

        const [
          distribution,
          ratio,
          type,
          grade,
          daily,
          age,
          gender,
          time,
          top,
          quarterly,
          salesRanking,
        ] = await Promise.all([
          getBusinessDistribution(dong),
          getOpenCloseRatio(dong),
          getCommercialDistrictType(dong),
          getDistrictGrade(dong),
          getDailyFootfall(dong),
          getAgeGroupFootfall(dong),
          getGenderFootfall(dong),
          getTimeBasedFootfall(dong),
          getTopNDistrictsByFootfall(),
          getQuarterlyFootfall(dong),
          getCategorySalesRanking(dong),
        ]);

        setAnalysisData({
          location: {
            dong: type.dong, // 백엔드 호출에 이용할 한국어 동 이름
            dongI18nKey: dongI18nKey, // UI 표시에 사용할 i18n 키
            type: type.label,
            rank: grade.grade,
          },
          businessDistribution: distribution,
          openCloseRatio: ratio,
          categorySalesRanking: salesRanking,
          demographics: { age, gender },
          timeTraffic: formatTimeTraffic(time),
          weeklyTraffic: formatWeeklyTraffic(daily),
          quarterlyFootfall: formatQuarterlyFootfall(quarterly),
          topDistricts: top,
          peakTime: calculatePeakTime(daily, time),
        });
      } catch (err) {
        console.error(t('analysis.locationTracking.dataLoadError'), err);
        setError(err.message || t('analysis.locationTracking.dataFetchError'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [id, t]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {t('analysis.locationTracking.loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {t('analysis.locationTracking.error', { error: error })}
      </div>
    );
  }

  if (!analysisData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader
        locationData={analysisData.location}
        districtCenter={districtCenter}
      />

      <div className="max-w-6xl mx-auto pb-8">
        <BusinessDistribution
          businessTypes={analysisData.businessDistribution}
          businessType={analysisData.location.type}
        />

        <RevenueChart monthlyRevenue={analysisData.categorySalesRanking} />

        <OpenCloseAnalysis
          openCloseRate={analysisData.openCloseRatio}
          dong={analysisData.location.dong}
        />

        <TrafficAnalysis footTraffic={analysisData.quarterlyFootfall} />

        <DemographicsSection
          demographics={analysisData.demographics}
          timeTraffic={analysisData.timeTraffic}
          weeklyTraffic={analysisData.weeklyTraffic}
          peak={analysisData.peakTime}
        />

        <NearbyAreas topDongByPpl={analysisData.topDistricts.slice(0, 3)} />
      </div>

      <div className="px-4 pb-8 ">
        <button
          className="w-full text-white font-bold py-3 px-4 rounded-lg transition-opacity hover:opacity-90"
          style={{
            background: 'linear-gradient(0deg, #191D24 0%, #2E2D39 100%)',
          }}
          onClick={() =>
            alert(t('analysis.locationTracking.featureComingSoon'))
          }
        >
          {t('analysis.locationTracking.compareButton')}
        </button>
      </div>
    </div>
  );
}
