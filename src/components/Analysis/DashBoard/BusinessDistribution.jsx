export default function BusinessDistribution({ businessTypes, businessType }) {
  if (!businessTypes || businessTypes.length === 0) {
    return (
      <section className="px-4 py-6 bg-white">
        <h2 className="text-sm font-semibold text-gray-900 mb-6">업종 분포</h2>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">업종 분포 데이터가 없습니다.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-6 bg-white">
      <h2 className="text-base font-semibold text-gray-900 mb-6">업종 분포</h2>

      <div className="max-w-xs mx-auto">
        <div className="grid grid-cols-3 gap-x-8 gap-y-2 mb-6">
          {businessTypes.map((business, index) => (
            <div key={index} className="flex items-baseline space-x-2">
              <span className="text-xs text-gray-700 w-16">
                {business.category}
              </span>
              <span className="text-base font-bold text-blue-600">
                {business.count.toString().padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center p-4 rounded-lg">
          <p className="text-sm text-gray-900">
            <span className="text-gray-600">선택하신 지역은</span>{' '}
            <span className="font-bold text-base text-blue-600">
              {businessType}
            </span>{' '}
            <span className="text-gray-600">입니다.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
