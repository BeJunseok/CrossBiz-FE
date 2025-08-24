const GradeMarker = ({ grade }) => {
  const gradeStyle = {
    1: { background: 'rgba(17, 205, 92, 0.40)' },
    2: { background: 'rgba(92, 195, 22, 0.35)' },
    3: { background: 'rgba(255, 102, 0, 0.35)' },
    4: { background: 'rgba(255, 102, 0, 0.35)' },
    5: { background: 'rgba(255, 0, 0, 0.35)' },
  };

  const defaultStyle = { background: 'rgb(107,114,128}' };

  return (
    <div
      className={
        'w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-white'
      }
      style={gradeStyle[grade] || defaultStyle}
    >
      {grade}
    </div>
  );
};

export default GradeMarker;
