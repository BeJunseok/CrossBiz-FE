import { useState, useEffect, useCallback } from 'react';
import { boundaryData } from '@/data/boundary';
import { getAllDistrictGrades } from '@/api/analysis/AnalysisApi';

const processDistrictData = (boundaryFeatures, gradesData) => {
  const gradesMap = new Map(gradesData.map((item) => [item.dong, item.grade]));

  const processedData = boundaryFeatures.map((feature) => {
    const districtName = feature.properties.adm_nm;
    const grade = gradesMap.get(districtName) || 3; // API에 등급 정보가 없으면 기본값 3등급

    return {
      id: feature.properties.adm_cd,
      name: districtName,
      geometry: feature.geometry,
      properties: feature.properties,
      grade: grade,
    };
  });

  return processedData;
};

export const useDistrictData = () => {
  const [districts, setDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const grades = await getAllDistrictGrades();

      // 경계 데이터와 등급 데이터 매칭
      const processedDistricts = processDistrictData(
        boundaryData.features,
        grades
      );

      setDistricts(processedDistricts);
    } catch (err) {
      console.error('Failed to load district data:', err);
      setError(err.message);
      // 에러 발생 시 경계 데이터만 사용 (기본 등급 적용)
      const fallbackDistricts = processDistrictData(boundaryData.features, []);
      setDistricts(fallbackDistricts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    districts,
    isLoading,
    error,
  };
};
