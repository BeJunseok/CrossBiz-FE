import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  getCommercialTypeI18nKey,
  getDistributionCategoryI18nKey,
} from '@/utils/industryNameMap';

const MultiLineText = ({ text }) => {
  return (
    <>
      {text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))}
    </>
  );
};

export default function BusinessDistribution({ businessTypes, businessType }) {
  const { t } = useTranslation();
  if (!businessTypes || businessTypes.length === 0) {
    return (
      <section className="px-4 py-6 bg-white">
        <h2 className="text-sm font-semibold text-gray-900 mb-6">
          {'t(analysis.businessDistribution.title'}
        </h2>
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700">
            {t('analysis.businessDistribution.noData')}
          </p>
        </div>
      </section>
    );
  }

  const commercialTypeKey = getCommercialTypeI18nKey(businessType);
  const translatedCommercialType = t(
    `analysis.businessDistribution.commercialTypes.${commercialTypeKey}`
  );

  return (
    <section className="px-4 py-6 bg-white">
      <h2 className="text-base font-semibold text-gray-900 mb-6">
        {t('analysis.businessDistribution.title')}
      </h2>

      <div className="max-w-xs mx-auto">
        <div className="grid grid-cols-3 gap-x-8 gap-y-2 mb-6">
          {businessTypes.map((business, index) => {
            const categoryKey = getDistributionCategoryI18nKey(
              business.category
            );
            const translatedCategory = t(
              `analysis.businessDistribution.distributionCategories.${categoryKey}`
            );

            return (
              <div
                key={index}
                className="flex items-center justify-center space-x-2"
              >
                <span className="text-xs text-gray-700 w-16">
                  {translatedCategory}
                </span>
                <span className="text-base font-bold text-blue-600 ">
                  {business.count.toString().padStart(2, '0')}
                </span>
              </div>
            );
          })}
        </div>

        <div className="text-center p-4 rounded-lg">
          <p className="text-sm text-gray-900">
            <span className="text-gray-600">
              {t('analysis.businessDistribution.districtPrefix')}
            </span>{' '}
            <span className="font-bold text-base text-blue-600">
              <MultiLineText text={translatedCommercialType} />
            </span>{' '}
            <span className="text-gray-600">
              {t('analysis.businessDistribution.districtSuffix')}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
