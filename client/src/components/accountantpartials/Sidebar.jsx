import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BarChart2,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  Users,
  Truck,
  Layers,
  ChevronDown,
  ChevronUp,
} from "react-feather";
import "../../styles/accountant/sidebar.css";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login"); // redirect to login page
  };

  return (
    <aside className="accountant-sidebar">
      {/* -------- Header -------- */}
      <div className="sidebar-header">
        <h2>
          Auto<span>POS</span>
        </h2>
        <p>Accountant Panel</p>
      </div>

      {/* -------- Navigation -------- */}
      <nav className="sidebar-nav">
        {/* Dashboard */}
        <NavLink to="/accounting/featuresoverview" className="sidebar-link">
          <BarChart2 className="icon" />
          <span>Dashboard</span>
        </NavLink>

        {/* Transactions Dropdown */}
        <div className="sidebar-group">
          <button
            className={`sidebar-link ${openMenu === "transactions" ? "active" : ""}`}
            onClick={() => toggleMenu("transactions")}
          >
            <DollarSign className="icon" />
            <span>Transactions</span>
            {openMenu === "transactions" ? (
              <ChevronUp className="chevron" />
            ) : (
              <ChevronDown className="chevron" />
            )}
          </button>

          {openMenu === "transactions" && (
            <div className="submenu">
              <NavLink to="/accounting/transactions" className="submenu-link">
                All Transactions
              </NavLink>
              <NavLink to="/accounting/income" className="submenu-link">
                Income
              </NavLink>
              <NavLink to="/accounting/expenses" className="submenu-link">
                Expenses
              </NavLink>
            </div>
          )}
        </div>

        {/* Reports */}
        <NavLink to="/accounting/reports" className="sidebar-link">
          <FileText className="icon" />
          <span>Reports</span>
        </NavLink>

        {/* Accounts */}
        <NavLink to="/accounting/accounts" className="sidebar-link">
          <Layers className="icon" />
          <span>Accounts</span>
        </NavLink>

        {/* Employees */}
        <NavLink to="/accounting/employees" className="sidebar-link">
          <Users className="icon" />
          <span>Employees</span>
        </NavLink>

        {/* Vehicles */}
        <NavLink to="/accounting/vehicles" className="sidebar-link">
          <Truck className="icon" />
          <span>Vehicles</span>
        </NavLink>

        {/* Settings */}
        <NavLink to="/accounting/settings" className="sidebar-link">
          <Settings className="icon" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* -------- Footer -------- */}
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut className="icon" />
          <span>Logout</span>
        </button>
        <p className="version">v1.0.0</p>
      </div>
    </aside>
  );
}
