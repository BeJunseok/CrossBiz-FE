import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LayoutWithNavbar from './layouts/LayoutWithNavbar';

import CommunityPage from '@/pages/Community/CommunityPage';
import SearchPage from '@/pages/community/SearchPage';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Navbar가 없는 페이지 */}
        <Route path="/community/search" element={<SearchPage />} />
        {/* Navbar가 있는 페이지 */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/community" element={<CommunityPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
