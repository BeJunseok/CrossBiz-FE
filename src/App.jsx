import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import LayoutWithNavbar from '@/layouts/LayoutWithNavbar';

import OnboardingPage from '@/pages/onboarding/Onboarding';
import LoginPage from '@/pages/login/Login';
import CommunityPage from '@/pages/Community/CommunityPage';
import SearchPage from '@/pages/community/SearchPage';
import PostDetailPage from '@/pages/community/PostDetailPgae';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Navbar가 없는 페이지 */}
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/community/search" element={<SearchPage />} />
        <Route path="/community/post/:id" element={<PostDetailPage />} />

        {/* Navbar가 있는 페이지 */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/community" element={<CommunityPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
