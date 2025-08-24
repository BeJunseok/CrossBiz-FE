import MyPageHeader from '@/components/community/MyPage/MyPageHeader';
import ProfileSection from '@/components/community/MyPage/ProfileSection';
import PersonalInfoForm from '@/components/community/MyPage/PersonalInfoForm';
import MyPostSection from '@/components/community/MyPage/MyPostSection';
import LogoutSection from '@/components/community/MyPage/LogoutSection';
import { useMyPageData } from '@/hooks/useMyPageData';

const MyPage = () => {
  const {
    formData,
    errors,
    myPosts,
    loading,
    error, // 에러 상태 추가
    handleFieldChange,
    handleSave,
    handleLogout,
  } = useMyPageData();

  // 로딩 중일 때 표시할 UI
  if (loading) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 발생 시 표시할 UI
  if (error) {
    return (
      <div className="min-h-screen w-full bg-white flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-white">
      <MyPageHeader onSave={handleSave} />

      {/* formData가 존재할 때만 렌더링. */}
      {formData && (
        <>
          <ProfileSection profileData={formData} />
          <PersonalInfoForm
            formData={formData}
            errors={errors}
            onFieldChange={handleFieldChange}
          />
          <MyPostSection posts={myPosts} />
          <LogoutSection onLogout={handleLogout} />
        </>
      )}
    </div>
  );
};

export default MyPage;
