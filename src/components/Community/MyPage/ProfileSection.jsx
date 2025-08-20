const ProfileSection = ({ profileData }) => {
  return (
    <div className="flex flex-col items-center pt-14 pb-14">
      {/* 프로필 이미지 */}
      <div className="w-28 h-28 rounded-full bg-gray-200 mb-3 overflow-hidden">
        <img
          src={profileData.profileImage || '/api/placeholder/112/112'}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </div>

      {/* 이름과 상태 */}
      <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold text-black mb-1">
          {profileData.name}
        </h2>
        <span className="text-sm font-semibold text-gray-500">
          {profileData.businessInfo}
        </span>
      </div>
    </div>
  );
};

export default ProfileSection;
