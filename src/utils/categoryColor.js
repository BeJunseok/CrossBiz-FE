export const getCategoryColor = (category) => {
  const colorMap = {
    'Q&A': '#FF6F00',
    Discussion: '#8A38F5',
    Help: '#E06161',
    Tips: '#00C725',
  };
  return colorMap[category] || '#d1d5db';
};
