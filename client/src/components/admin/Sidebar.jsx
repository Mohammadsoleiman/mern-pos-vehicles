import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import styles from "../../styles/dashboard.module.css";

export default function Sidebar() {
  const { user } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* 🍔 Burger Menu للموبايل */}
      <button className={styles.burgerMenu} onClick={toggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* 🎯 Sidebar */}
      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.brand}>
          {settings.profilePic ? (
            <img src={settings.profilePic} className={styles.avatarImage} alt="Profile" />
          ) : (
            <div className={styles.avatar}>
              {(user?.name?.charAt(0) || "A").toUpperCase()}
            </div>
          )}
          <span className={styles.name}>{user?.name || "Admin"}</span>
        </div>

        <nav className={styles.nav}>
          <NavLink end to="/admin/dashboard" onClick={() => setIsOpen(false)}>
            <span className={styles.navIcon}>📊</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/admin/users" onClick={() => setIsOpen(false)}>
            <span className={styles.navIcon}>👥</span>
            <span>Users</span>
          </NavLink>
          <NavLink to="/admin/vehicles" onClick={() => setIsOpen(false)}>
            <span className={styles.navIcon}>🚗</span>
            <span>Vehicles</span>
          </NavLink>
          <NavLink to="/admin/reports" onClick={() => setIsOpen(false)}>
            <span className={styles.navIcon}>📈</span>
            <span>Reports</span>
          </NavLink>
          <NavLink to="/admin/settings" onClick={() => setIsOpen(false)}>
            <span className={styles.navIcon}>⚙️</span>
            <span>Settings</span>
          </NavLink>
        </nav>

        <button className={styles.logoutBtn} onClick={handleLogout}>
          <div className={styles.garageDoor}>
            <div className={styles.door}></div>
            <div className={styles.car}>🚗</div>
          </div>
          <span className={styles.logoutText}>Logout</span>
        </button>
      </aside>

      {/* 🌑 Overlay للموبايل */}
      {isOpen && <div className={styles.overlay} onClick={toggleSidebar}></div>}
    </>
  );
}