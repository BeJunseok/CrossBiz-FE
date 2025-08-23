// 백엔드 API 완성 전까지 사용할 목업 데이터
export const mockDistrictGrades = {
  용강동: {
    grade: 3,
    name: '용강동',
  },
  대흥동: {
    grade: 2,
    name: '대흥동',
  },
  염리동: {
    grade: 1,
    name: '염리동',
  },
  신수동: {
    grade: 4,
    name: '신수동',
  },
  서교동: {
    grade: 1,
    name: '서교동',
  },
  합정동: {
    grade: 2,
    name: '합정동',
  },
  망원1동: {
    grade: 4,
    name: '망원1동',
  },
  망원2동: {
    grade: 2,
    name: '망원2동',
  },
  연남동: {
    grade: 5,
    name: '연남동',
  },
  성산1동: {
    grade: 4,
    name: '성산1동',
  },
  성산2동: {
    grade: 2,
    name: '성산2동',
  },
  상암동: {
    grade: 1,
    name: '상암동',
  },
  도화동: {
    grade: 2,
    name: '도화동',
  },
  서강동: {
    grade: 3,
    name: '서강동',
  },
  공덕동: {
    grade: 5,
    name: '공덕동',
  },
  아현동: {
    grade: 4,
    name: '아현동',
  },
};

// API 호출 시뮬레이션 함수
export const fetchDistrictGrades = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockDistrictGrades);
    }, 1000);
  });
};
