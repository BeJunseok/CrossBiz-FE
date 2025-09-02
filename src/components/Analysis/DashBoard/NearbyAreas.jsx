import { useState, useEffect } from 'react';
import Map from '@/assets/svg/analysis/Map.svg?react';
import Export from '@/assets/svg/analysis/Export.svg?react';
import { getDistrictGrade } from '@/api/analysis/AnalysisApi';
import { useTranslation } from 'react-i18next';
import { getDongI18nKey } from '@/utils/dongNameMap';

const GradeIndicator = ({ grade }) => {
  const { t } = useTranslation();
  const getGradeColor = (grade) => {
    switch (grade) {
      case 1:
        return '#00C58A';
      case 2:
        return '#5AB61C';
      case 3:
        return '#D4AF1C';
      case 4:
        return '#FF6600';
      case 5:
        return '#9C1010';
      default:
        return '#6B7280';
    }
  };

  return (
    <div
      className="mt-1.5 inline-flex items-center px-2.5 py-1 rounded-full"
      style={{ backgroundColor: getGradeColor(grade) }}
    >
      <span className="text-white text-[10px] font-bold ">
        {t('analysis.nearbyAreas.gradeLabel', { grade })}
      </span>
    </div>
  );
};

export default function NearbyAreas({ topDongByPpl }) {
  const { t } = useTranslation();
  const [areasWithGrade, setAreasWithGrade] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!topDongByPpl || topDongByPpl.length === 0) {
      setLoading(false);
      return;
    }

    const fetchGrades = async () => {
      setLoading(true);
      try {
        const gradePromises = topDongByPpl.map((area) =>
          getDistrictGrade(area.dong)
        );
        const gradeResults = await Promise.all(gradePromises);

        const combinedData = topDongByPpl.map((area, index) => ({
          ...area,
          grade: gradeResults[index].grade, // API 응답에서 grade 값을 추가
        }));

        setAreasWithGrade(combinedData);
      } catch (error) {
        console.error('Failed to fetch district grades:', error);

        setAreasWithGrade(topDongByPpl);
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [topDongByPpl]);

  if (loading) {
    return (
      <section className="px-4 py-6 my-4 bg-white">
        <div className="text-center p-4">
          {t('analysis.nearbyAreas.loading')}
        </div>
      </section>
    );
  }

  if (areasWithGrade.length === 0) {
    return null;
  }

  return (
    <section className="px-4 py-6 my-4 bg-white">
      <h2 className="text-lg font-bold text-gray-800 mb-4">
        {t('analysis.nearbyAreas.title')}
      </h2>
      <div className="space-y-3">
        {areasWithGrade.map((area, index) => {
          const dongI18nKey = getDongI18nKey(area.dong);

          return (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-md shadow-gray-200/50"
            >
              <div className="flex items-center gap-3">
                <Map className="w-10 h-10 text-gray-400" />
                <div>
                  <p className="text-xs">
                    {t('analysis.nearbyAreas.locationPrefix')}{' '}
                    {t(`analysis.districts.${dongI18nKey}`)}
                  </p>
                  <GradeIndicator grade={area.grade} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-lg font-semibold text-blue-600">
                    {area.totalPpl.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">
                    {t('analysis.nearbyAreas.populationUnit')}
                  </span>
                </div>
                <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                  <Export className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
