// src/components/clerk/ClerkSidebar.jsx
import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ClerkAuthContext } from '../../context/clerk/ClerkAuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  LogOut,
  User,
  ChevronRight
} from 'lucide-react';
import '../../styles/clerk/ClerkSidebar.css';

const ClerkSidebar = ({ isOpen, onClose }) => {
  const { clerk, logout } = useContext(ClerkAuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const menuItems = [
    { path: '/cashier/dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Overview & stats' },
    { path: '/cashier/vehicles', icon: Package, label: 'Vehicles', description: 'Manage inventory' },
    { path: '/cashier/sales', icon: ShoppingCart, label: 'Sales', description: 'Process transactions' },
    { path: '/cashier/customers', icon: Users, label: 'Customers', description: 'Manage clients' },
    { path: '/cashier/reports', icon: BarChart3, label: 'Reports', description: 'View analytics' },
    { path: '/cashier/settings', icon: Settings, label: 'Settings', description: 'Account settings' }
  ];

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      <aside className={`clerk-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          
          <div className="sidebar-user">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <p className="user-name">{clerk?.name || 'Clerk User'}</p>
              <p className="user-role">{clerk?.role || 'Clerk'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="nav-menu">
            {menuItems.map((item) => (
              <li key={item.path} className="nav-item">
                <NavLink
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose?.()}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={22} className="nav-icon" />
                  <div className="nav-content">
                    <p className="nav-label">{item.label}</p>
                  </div>
                  <ChevronRight size={16} className="nav-arrow" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={22} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default ClerkSidebar;
