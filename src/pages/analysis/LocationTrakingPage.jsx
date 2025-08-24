import DashboardHeader from '@/components/Analysis/DashBoard/DashboardHeader';
import BusinessDistribution from '@/components/Analysis/DashBoard/BusinessDistribution';
import RevenueChart from '@/components/Analysis/DashBoard/RevenueChart';
import OpenCloseAnalysis from '@/components/Analysis/DashBoard/OpenCloseAnalysis';
import TrafficAnalysis from '@/components/Analysis/DashBoard/TrafficAnalysis';
import DemographicsSection from '@/components/Analysis/DashBoard/DemographicsSection';
import NearbyAreas from '@/components/Analysis/DashBoard/NearbyAreas';
import { mockDashboardData } from '@/data/dashboardData';

export default function LocationTrackingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 및 위치 정보 */}
      <DashboardHeader locationData={mockDashboardData.location} />

      <div className="max-w-6xl mx-auto pb-8">
        {/* 업종 분포 섹션 */}
        <BusinessDistribution
          businessTypes={mockDashboardData.businessTypes}
          businessType={mockDashboardData.location.type}
        />

        {/* 업종별 매출 차트 */}
        <RevenueChart monthlyRevenue={mockDashboardData.monthlyRevenue} />

        {/* 개폐업률 분석 */}
        <OpenCloseAnalysis openCloseRate={mockDashboardData.openCloseRate} />

        {/* 유동인구 분석(3개년) */}
        <TrafficAnalysis
          timeTraffic={mockDashboardData.timeTraffic}
          weeklyTraffic={mockDashboardData.weeklyTraffic}
          footTraffic={mockDashboardData.footTraffic}
        />

        {/* 유동인구 통계  */}
        <DemographicsSection
          demographics={mockDashboardData.demographics}
          timeTraffic={mockDashboardData.timeTraffic}
          weeklyTraffic={mockDashboardData.weeklyTraffic}
          peak={mockDashboardData.peak}
        />

        {/* 동 자치구 내 유동인구 */}
        <NearbyAreas topDongByPpl={mockDashboardData.topDongByPpl} />
      </div>

      {/* 상권 한눈에 비교 버튼 */}
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
