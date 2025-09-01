import { Route, Routes } from 'react-router-dom';
import RequireAuth from '@/router/RequireAuth';
import MainLayout from '@/layouts/MainLayout';
import LayoutWithNavbar from '@/layouts/LayoutWithNavbar';
import OnboardingPage from '@/pages/onboarding/Onboarding';
import LoginPage from '@/pages/login/Login';
import CommunityPage from '@/pages/Community/CommunityPage';
import SearchPage from '@/pages/community/SearchPage';
import PostDetailPage from '@/pages/community/PostDetailPage';
import RegisterPage from '@/pages/register/RegisterPage';
import PersonalInfoPage from '@/pages/register/PersonalInfoPage';
import VisaInfoPage from '@/pages/register/VisaInfoPage';
import Tax from '@/pages/Tax';
import RecommendPage from '@/pages/RecommendPage';
import NewSchedulePage from '@/pages/NewSchedulePage';
import HotPostsPage from '@/pages/community/HotPostsPage';
import NewPostPage from '@/pages/community/NewPostPage';
import MyPage from '@/pages/community/MyPage';
import AdditionalInfoPage from '@/pages/community/AdditionalInfoPage';
import MapView from '@/pages/analysis/MapView';
import LocationTrackingPage from '@/pages/analysis/LocationTrakingPage';
import VisaRecommend from '@/pages/Visa/VisaRecommend';
import ConfirmCheck from '@/pages/Visa/ConfirmCheck.jsx';
import ConfirmMore from '@/pages/Visa/ConfirmMore.jsx';
import ConfirmVisa from '@/pages/Visa/ConfirmVisa.jsx';
import LoadingPreviousInfo from '@/pages/Visa/LoadingPreviousInfo';
import VisaLoading from '@/pages/Visa/VisaLoading';
import VisaInfo from '@/pages/Visa/VisaInfo';
import VisaHistory from '@/pages/Visa/VisaHistory';
import HistoryMatch from '@/pages/Visa/HistoryMatch';
import VisaHome from '@/pages/Visa/VisaHome';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Navbar가 없는 페이지 */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/register/personal-info" element={<PersonalInfoPage />} />
        <Route path="/register/visa-info" element={<VisaInfoPage />} />

        {/* 인증이 필요한 페이지 */}
        <Route element={<RequireAuth />}>
          <Route path="/community/search" element={<SearchPage />} />
          <Route path="/community/post/:id" element={<PostDetailPage />} />
          <Route path="/community/post/new" element={<NewPostPage />} />
          <Route path="/community/hotpost" element={<HotPostsPage />} />
          <Route path="/community/my" element={<MyPage />} />
          <Route path="/community/my/edit" element={<AdditionalInfoPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/schedule/new" element={<NewSchedulePage />} />
          <Route path="/analysis/:id" element={<LocationTrackingPage />} />
          <Route path="/loading-prev" element={<LoadingPreviousInfo />} />
          <Route path="/visa-loading" element={<VisaLoading />} />
          <Route path="/visa-info" element={<VisaInfo />} />
          <Route path="/history-match" element={<HistoryMatch />} />

          {/* Navbar가 있는 페이지 */}
          <Route element={<LayoutWithNavbar />}>
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/tax" element={<Tax />} />
            <Route path="/analysis" element={<MapView />} />
            <Route index path="/" element={<VisaHome />} />
            <Route path="/confirm-more" element={<ConfirmMore />} />
            <Route path="/confirm-visa" element={<ConfirmVisa />} />
            <Route path="/confirm-check" element={<ConfirmCheck />} />
            <Route path="/visa-recommend" element={<VisaRecommend />} />
            <Route path="/visa-history" element={<VisaHistory />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
