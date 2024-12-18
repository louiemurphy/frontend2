  import React from 'react';
  import { useNavigate, useLocation, Link } from 'react-router-dom';
  import { FaHistory } from 'react-icons/fa';
  import { 
    FaTachometerAlt, 
    FaUserFriends, 
    FaListAlt, 
    FaWarehouse, 
    FaPlus, 
    FaSignOutAlt, 
    FaChartLine, 
    FaTable 
  } from 'react-icons/fa';
  import './Sidebar.css';

  function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // Helper function to determine if a path is active
    const isActive = (path) => location.pathname === path ? 'active' : '';

    // Sidebar menu item component
    const MenuItem = ({ icon, text, path, onClick }) => (
      <li 
        className={`menu-item ${isActive(path)}`}
        onClick={() => onClick(path)}
      >
        {React.cloneElement(icon, { className: 'menu-icon' })}
        {text}
      </li>
    );

    // Sidebar section component
    const SidebarSection = ({ title, children }) => (
      <div className="sidebar-section">
        <h4 className="section-title">{title}</h4>
        <ul className="section-menu">
          {children}
        </ul>
      </div>
    );

    return (
      <div className="sidebar">
        <h3 className="sidebar-title">Dashboard</h3>

        <SidebarSection title="Admin">
          <MenuItem 
            icon={<FaTachometerAlt />} 
            text="Dashboard" 
            path="/dashboard"
            onClick={navigate}
          />
          <MenuItem 
            icon={<FaUserFriends />} 
            text="Evaluators Profile" 
            path="/profiles"
            onClick={navigate}
          />
          <MenuItem 
            icon={<FaListAlt />} 
            text="Request List" 
            path="/all-requests"
            onClick={navigate}
          />
        </SidebarSection>

        <SidebarSection title="Supplier">
          <MenuItem 
            icon={<FaPlus />} 
            text="Create List" 
            path="/supplier-master-list"
            onClick={navigate}
          />
          <MenuItem 
            icon={<FaWarehouse />} 
            text="Supplier List" 
            path="/list"
            onClick={navigate}
          />
        </SidebarSection>

        <SidebarSection title="Monitoring">
          <MenuItem 
            icon={<FaChartLine />} 
            text="Create Pi Entry" 
            path="/pi-monitoring"
            onClick={navigate}
          />
          <MenuItem 
            icon={<FaTable />} 
            text="Monitoring List" 
            path="/monitoring-tables"
            onClick={navigate}
          />
            <MenuItem 
            icon={<FaHistory />} 
            text="Monitoring Logs" 
            path="/monitoring-logs"
            onClick={navigate}
          />
        </SidebarSection>

        <div className="sidebar-logout">
          <li className="menu-item2">
            <FaSignOutAlt className="icon" />
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              Logout
            </Link>
          </li>
        </div>
        

      </div>
    );
  }

  export default Sidebar;