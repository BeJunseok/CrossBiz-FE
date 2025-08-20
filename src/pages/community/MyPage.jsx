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
    handleFieldChange,
    handleSave,
    handleLogout,
  } = useMyPageData();

  return (
    <div className="min-h-screen w-full bg-white">
      <MyPageHeader onSave={handleSave} />

      <ProfileSection profileData={formData} />

      <PersonalInfoForm
        formData={formData}
        errors={errors}
        onFieldChange={handleFieldChange}
      />

      <MyPostSection posts={myPosts} />

      <LogoutSection onLogout={handleLogout} />

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">저장하는 중...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPage;
