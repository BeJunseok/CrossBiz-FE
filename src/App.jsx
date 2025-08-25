import './App.css';
import MainLayout from './layouts/MainLayout';
import React from 'react';
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import VisaRecommend from './pages/Visa/VisaRecommend';
import ConfirmCheck from './pages/Visa/ConfirmCheck';
import ConfirmMore from './pages/Visa/ConfirmMore';
import ConfirmVisa from './pages/Visa/ConfirmVisa';
import LoadingPreviousInfo from './pages/Visa/LoadingPreviousInfo';
import VisaLoading from './pages/Visa/VisaLoading';
import VisaInfo from './pages/Visa/VisaInfo';
import VisaHistory from './pages/Visa/VisaHistory';
import HistoryMatch from './pages/Visa/HistoryMatch';
import VisaHome from './pages/Visa/VisaHome';
import ScrollToTop from './components/scrollTop';

function App() {
  return (
  <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route index path='/' element={<VisaHome />} />
          <Route path='/confirm-more' element={<ConfirmMore />} />
          <Route path='/confirm-visa' element={<ConfirmVisa />} />
          <Route path='/confirm-check' element={<ConfirmCheck />} />
          <Route path='/loading-prev' element={<LoadingPreviousInfo />} />
          <Route path='/visa-loading' element={<VisaLoading />} />
          <Route path='/visa-recommend' element={<VisaRecommend />} />
          <Route path='/visa-info' element={<VisaInfo />} />
          <Route path='/visa-history' element={<VisaHistory />} />
          <Route path='/history-match' element={<HistoryMatch />} />
        </Route>
      </Routes>
  </BrowserRouter>
);
}

export default App;
