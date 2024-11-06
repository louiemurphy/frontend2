// Components/Sidebar.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; 
import { FaTachometerAlt, FaUserFriends, FaListAlt } from 'react-icons/fa'; 
import './Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); 

  return (
    <div className="sidebar">
      <h3 className="sidebar-title">MENU</h3>
      <ul className="menu-list">
        <li
          className={`menu-item ${location.pathname === '/dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <FaTachometerAlt className="menu-icon" />
          DASHBOARD
        </li>
        <li
          className={`menu-item ${location.pathname === '/profiles' ? 'active' : ''}`}
          onClick={() => navigate('/profiles')}
        >
          <FaUserFriends className="menu-icon" />
          ALL PROFILES
        </li>
        <li
          className={`menu-item ${location.pathname === '/all-requests' ? 'active' : ''}`}
          onClick={() => navigate('/all-requests')}
        >
          <FaListAlt className="menu-icon" />
          ALL REQUESTS
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
