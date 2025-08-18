import './App.css';
import MainLayout from './layouts/MainLayout';
import Tax from './pages/Tax';
import React from 'react';
import { BrowserRouter, Navigate, Route, Router,Routes } from 'react-router-dom';
import RecommendPage from './pages/RecommendPage';
import NewSchedulePage from './pages/NewSchedulePage';


function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to="/tax" replace /> } />
        <Route path='/tax' element={<Tax />} />
        <Route path='/recommend' element={<RecommendPage />} />
        <Route path='/schedule/new' element={<NewSchedulePage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
}

export default App;
