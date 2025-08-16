import { Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';

import CommunityPage from '@/pages/Community/CommunityPage';

function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/community" element={<CommunityPage />} />
      </Routes>
    </MainLayout>
  );
}

export default App;
