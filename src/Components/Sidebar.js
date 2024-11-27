import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';  // Add Link import here
import { FaTachometerAlt, FaUserFriends, FaListAlt, FaWarehouse, FaPlus } from 'react-icons/fa';
import './Sidebar.css';
import { FaSignOutAlt } from "react-icons/fa";

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
          Dashboard
        </li>
        <li
          className={`menu-item ${location.pathname === '/profiles' ? 'active' : ''}`}
          onClick={() => navigate('/profiles')}
        >
          <FaUserFriends className="menu-icon" />
          All Profiles
        </li>
        <li
          className={`menu-item ${location.pathname === '/all-requests' ? 'active' : ''}`}
          onClick={() => navigate('/all-requests')}
        >
          <FaListAlt className="menu-icon" />
          All Request
        </li>
        <li
          className={`menu-item ${location.pathname === '/supplier-master-list' ? 'active' : ''}`}
          onClick={() => navigate('/supplier-master-list')}
        >
          <FaPlus className="menu-icon" />
          Create List
        </li>
        <li
          className={`menu-item ${location.pathname === '/list' ? 'active' : ''}`}
          onClick={() => navigate('/list')}
        >
          <FaWarehouse className="menu-icon" />
          Supplier List
        </li>
        <li className="menu-item2">
  <FaSignOutAlt className="icon" />
  <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
    Logout
  </Link>
</li>

      </ul>
    </div>
  );
}

export default Sidebar;
