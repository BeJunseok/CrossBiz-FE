const LogoutSection = ({ onLogout }) => {
  return (
    <div className="px-6 pb-8">
      <button
        onClick={onLogout}
        className="w-full py-4 border border-gray-300 rounded-2xl text-gray-600 text-base font-semibold hover:bg-gray-50"
      >
        로그아웃
      </button>
    </div>
  );
};

export default LogoutSection;
