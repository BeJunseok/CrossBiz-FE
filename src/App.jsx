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

function App() {
  return (
  <BrowserRouter>
   
      <Routes>
        <Route element={<MainLayout />}>
          <Route index path='/' element={<HistoryMatch />} />
        </Route>
      </Routes>
  </BrowserRouter>
);
}

export default App;
