import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import CommunityPage from '@/pages/Community/CommunityPage';
import LayoutWithNavbar from './layouts/LayoutWithNavbar';

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Navbar가 없는 페이지 */}

        {/* Navbar가 있는 페이지 */}
        <Route element={<LayoutWithNavbar />}>
          <Route path="/community" element={<CommunityPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
