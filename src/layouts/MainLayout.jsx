import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export function MainLayout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrap">
        <TopNavbar />
        <Outlet />
      </div>
    </div>
  );
}
