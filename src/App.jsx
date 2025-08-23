import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LayoutWithNavbar from '@/layouts/LayoutWithNavbar';
import OnboardingPage from '@/pages/onboarding/Onboarding';
import LoginPage from '@/pages/login/Login';
import CommunityPage from '@/pages/Community/CommunityPage';
import SearchPage from '@/pages/community/SearchPage';
import PostDetailPage from '@/pages/community/PostDetailPgae';
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
        <Route path="/community/search" element={<SearchPage />} />
        <Route path="/community/post/:id" element={<PostDetailPage />} />
        <Route path="/community/post/new" element={<NewPostPage />} />
        <Route path="/community/hotpost" element={<HotPostsPage />} />
        <Route path="/community/my" element={<MyPage />} />
        <Route path="/community/my/edit" element={<AdditionalInfoPage />} />
        <Route path="/recommend" element={<RecommendPage />} />
        <Route path="/schedule/new" element={<NewSchedulePage />} />

        {/* Navbar가 있는 페이지 */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/tax" element={<Tax />} />
          <Route path="/analysis" element={<MapView />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
