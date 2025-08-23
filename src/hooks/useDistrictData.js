import { useState, useEffect, useCallback } from 'react';
import { boundaryData } from '@/data/boundary';
import { fetchDistrictGrades } from '@/data/mockData';

export const useDistrictData = () => {
  const [districts, setDistricts] = useState([]);
  const [gradeData, setGradeData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 행정구역 경계 데이터와 상권등급 데이터를 매칭
  const processDistrictData = useCallback((boundaryFeatures, gradesData) => {
    const processedData = boundaryFeatures.map((feature) => {
      const districtName = feature.properties.adm_nm;
      const gradeInfo = gradesData[districtName];

      return {
        id: feature.properties.adm_cd,
        name: districtName,
        geometry: feature.geometry,
        properties: feature.properties,
        grade: gradeInfo?.grade || 3, // 기본값 3등급
      };
    });

    return processedData;
  }, []);

  // 데이터 로드
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // 상권등급 데이터 가져오기 (백엔드 API 호출 대신 목업 데이터 사용)
      const grades = await fetchDistrictGrades();

      // 경계 데이터와 등급 데이터 매칭
      const processedDistricts = processDistrictData(
        boundaryData.features,
        grades
      );

      setDistricts(processedDistricts);
      setGradeData(grades);
    } catch (err) {
      console.error('Failed to load district data:', err);
      setError(err.message);

      // 에러 발생 시 경계 데이터만 사용 (기본 등급 적용)
      const fallbackDistricts = processDistrictData(boundaryData.features, {});
      setDistricts(fallbackDistricts);
    } finally {
      setIsLoading(false);
    }
  }, [processDistrictData]);

  // 특정 행정구역 정보 가져오기
  const getDistrictByName = useCallback(
    (name) => {
      return districts.find((district) => district.name === name);
    },
    [districts]
  );

  // 등급별 행정구역 필터링
  const getDistrictsByGrade = useCallback(
    (grade) => {
      return districts.filter((district) => district.grade === grade);
    },
    [districts]
  );

  // 데이터 새로고침
  const refreshData = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    districts,
    gradeData,
    isLoading,
    error,
    getDistrictByName,
    getDistrictsByGrade,
    refreshData,
  };
};
