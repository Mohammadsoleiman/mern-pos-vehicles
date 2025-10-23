import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/accountant/sidebar.css";

export default function Sidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      {/* User info at top */}
      <div className="sidebar-user">
        <div className="user-avatar">
          <span className="avatar-icon">👤</span>
        </div>
        <div className="user-info">
          <p className="user-name">{user?.name || "User"}</p>
          <p className="user-role">Accountant</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/accounting" end className={({ isActive }) => (isActive ? "active" : "")}>
              Overview
            </NavLink>
          </li>
          <li>
            <NavLink to="/accounting/transactions" className={({ isActive }) => (isActive ? "active" : "")}>
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink to="/accounting/reports" className={({ isActive }) => (isActive ? "active" : "")}>
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink to="/accounting/accounts" className={({ isActive }) => (isActive ? "active" : "")}>
              Accounts
            </NavLink>
          </li>
          <li>
            <NavLink to="/accounting/vehicles" className={({ isActive }) => (isActive ? "active" : "")}>
              Vehicles
            </NavLink>
          </li>
          <li>
            <NavLink to="/accounting/employees" className={({ isActive }) => (isActive ? "active" : "")}>
              Taxes
            </NavLink>
          </li>
          <li>
            <NavLink to="/accounting/settings" className={({ isActive }) => (isActive ? "active" : "")}>
              Settings
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Logout button at bottom */}
      <div className="sidebar-logout" onClick={handleLogout}>
        <span>🚪</span>
        <span>Logout</span>
      </div>
    </aside>
  );
}