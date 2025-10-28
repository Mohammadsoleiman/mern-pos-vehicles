import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ClerkSidebar from '../components/clerk/ClerkSidebar';
import ClerkDashboard from './clerk/ClerkDashboard';
import ClerkVehicles from './clerk/ClerkVehicles';
import ClerkSales from './clerk/ClerkSales';
import ClerkCustomers from './clerk/ClerkCustomers';
import ClerkReports from './clerk/ClerkReports';
import ClerkSettings from './clerk/ClerkSettings';
import { Menu, Bell, Search } from 'lucide-react';
import '../styles/clerk/cashier.css';

const Cashier = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Example notifications with links
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New sale completed', read: false, link: '/cashier/sales' },
    { id: 2, message: 'Vehicle stock is low', read: false, link: '/cashier/vehicles' },
    { id: 3, message: 'Customer updated profile', read: false, link: '/cashier/customers' },
  ]);

  const notifRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notif) => {
    // Mark notification as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );

    // Navigate to notification link
    if (notif.link) {
      navigate(notif.link);
    }

    // Close the dropdown
    setNotificationsOpen(false);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="cashier-layout">
      {/* Sidebar */}
      <ClerkSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="cashier-main">
        {/* Top Bar */}
        <header className="cashier-header">
          <div className="header-content">
            {/* Mobile Menu Button */}
            <button onClick={() => setSidebarOpen(true)} className="mobile-menu-btn">
              <Menu size={24} />
            </button>

            {/* Search Bar */}
            <div className="header-search">
              <div className="search-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="Search vehicles, customers, sales..."
                  className="search-input"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="header-actions">
              {/* Notifications */}
              <div className="notification-wrapper" ref={notifRef}>
                <button
                  className="notification-btn"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell size={22} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="notification-dropdown">
                    {notifications.length === 0 && (
                      <p className="empty-state">No notifications</p>
                    )}
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`notification-item ${notif.read ? 'read' : ''}`}
                        onClick={() => handleNotificationClick(notif)}
                      >
                        {notif.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile Badge */}
              <div className="profile-badge">
                <div className="profile-avatar">
                  <span>CK</span>
                </div>
                <span className="profile-name">Clerk</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="cashier-content">
          <Routes>
            <Route path="/" element={<Navigate to="dashboard" replace />} />
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ClerkDashboard />} />
            <Route path="vehicles" element={<ClerkVehicles />} />
            <Route path="sales" element={<ClerkSales />} />
            <Route path="customers" element={<ClerkCustomers />} />
            <Route path="reports" element={<ClerkReports />} />
            <Route path="settings" element={<ClerkSettings />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Cashier;
