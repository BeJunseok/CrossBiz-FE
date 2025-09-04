const dongNameMap = {
  용강동: 'yonggang',
  대흥동: 'daeheung',
  염리동: 'yeomri',
  신수동: 'sinsu',
  서교동: 'seogyo',
  합정동: 'hapjeong',
  망원1동: 'mangwon1',
  망원2동: 'mangwon2',
  연남동: 'yeonnam',
  성산1동: 'seongsan1',
  성산2동: 'seongsan2',
  상암동: 'sangam',
  도화동: 'dohwa',
  서강동: 'seogang',
  공덕동: 'gongdeok',
  아현동: 'ahyeon',
};

// 한국어 동 이름을 i18n 키로 변환
export const getDongI18nKey = (dongName) => dongNameMap[dongName] || dongName;
