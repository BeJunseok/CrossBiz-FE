const commercialTypeMap = {
  '복합형 상권': 'complex',
  '균형형 상권': 'balanced',
};

export const getCommercialTypeI18nKey = (typeName) =>
  commercialTypeMap[typeName] || typeName;

const distributionCategoryMap = {
  한식음식점: 'koreanFood',
  '커피-음료': 'coffeeShop',
  편의점: 'convenienceStore',
  일반의원: 'clinic',
  '호프-간이주점': 'bar',
  슈퍼마켓: 'supermarket',
  의약품: 'pharmacy',
  일반교습학원: 'generalAcademy',
  청과상: 'fruitAndVegetable',
  육류판매: 'meatStore',
  가전제품: 'homeAppliances',
  조명용품: 'lighting',
  반찬가게: 'sideDishStore',
  양식음식점: 'westernFood',
  일식음식점: 'japaneseFood',
  의료기기: 'medicalDevices',
  예술학원: 'artAcademy',
  문구: 'stationery',
  '운동/경기용품': 'sportsEquipment',
  치과의원: 'dentalClinic',
  일반의류: 'clothing',
  가구: 'furniture',
  컴퓨터및주변장치판매: 'computerSales',
  게스트하우스: 'guesthouse',
  미용실: 'beautySalon',
  부동산중개업: 'realEstate',
  사진관: 'photoStudio',
  세무사사무소: 'taxOffice',
  수산물판매: 'seafood',
  여행사: 'travelAgency',
  전자상거래업: 'eCommerce',
  제과점: 'bakery',
  화장품: 'cosmetics',
};

export const getDistributionCategoryI18nKey = (categoryName) =>
  distributionCategoryMap[categoryName] || categoryName;
