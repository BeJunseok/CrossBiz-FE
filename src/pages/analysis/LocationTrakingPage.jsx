import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

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
import { boundaryData } from '@/data/boundary';

export default function LocationTrackingPage() {
  const { id } = useParams();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError('지역 코드가 URL에 없습니다.');
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
          throw new Error('해당 지역 정보를 찾을 수 없습니다.');
        }

        const dong = districtFeature.properties.adm_nm;

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
            dong: type.dong,
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
        console.error('상권 분석 데이터 로딩 실패:', err);
        setError(err.message || '데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysisData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        데이터를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        에러: {error}
      </div>
    );
  }

  if (!analysisData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <DashboardHeader locationData={analysisData.location} />

      <div className="max-w-6xl mx-auto pb-8">
        <BusinessDistribution
          businessTypes={analysisData.businessDistribution}
          businessType={analysisData.location.type}
        />

        <RevenueChart monthlyRevenue={analysisData.categorySalesRanking} />

        <OpenCloseAnalysis openCloseRate={analysisData.openCloseRatio} />

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
          onClick={() => alert('기능을 준비 중입니다')}
        >
          상권 한눈에 비교하기
        </button>
      </div>
    </div>
  );
}
