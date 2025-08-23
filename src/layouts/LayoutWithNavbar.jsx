import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavbar from './BottomNavbar';

const LayoutWithNavbar = () => {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>

      <div className="sticky bottom-0 mt-auto z-50">
        <BottomNavbar />
      </div>
    </div>
  );
};

export default LayoutWithNavbar;
