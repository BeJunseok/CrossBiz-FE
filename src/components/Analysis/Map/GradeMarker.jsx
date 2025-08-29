const GradeMarker = ({ grade }) => {
  const gradeStyle = {
    1: { background: 'rgba(86, 185, 154, 1)' },
    2: { background: 'rgba(128, 207, 76, 1)' },
    3: { background: 'rgba(241, 209, 80, 1)' },
    4: { background: 'rgba(255, 145, 72, 1)' },
    5: { background: 'rgba(255, 103, 103, 1)' },
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
