// Components/AppLayout.js
import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function AppLayout() {
  const location = useLocation();

  return (
    <div className="app">
      {/* Conditionally render Sidebar only if not on "/all-requests" */}
      {location.pathname !== '/all-requests' && <Sidebar />}

      {/* Main content area */}
      <div className={location.pathname === '/all-requests' ? "full-screen-content" : "main-content"}>
        <Outlet />
      </div>
    </div>
  );
}

export default AppLayout;
