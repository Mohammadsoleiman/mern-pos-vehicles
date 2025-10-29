import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  BarChart2,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Users,
  Truck,
  ChevronDown,
  ChevronUp,
} from "react-feather";
import "../../styles/accountant/sidebar.css";

export default function Sidebar() {
  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className="accountant-sidebar">
      {/* ----------- Header ----------- */}
      <div className="sidebar-header">
        <h2>Auto<span>POS</span></h2>
        <p>Accountant Panel</p>
      </div>

      {/* ----------- Navigation ----------- */}
      <nav className="sidebar-nav">
        <NavLink to="/accounting/FeaturesOverview" className="sidebar-link">
          <BarChart2 className="icon" />
          <span>Dashboard</span>
        </NavLink>

        {/* Transactions with Dropdown */}
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
              <NavLink to="/accounting/Transactions" className="submenu-link">
                All Transactions
              </NavLink>
              <NavLink to="/accounting/Income" className="submenu-link">
                Income
              </NavLink>
              <NavLink to="/accounting/Expenses" className="submenu-link">
                Expenses
              </NavLink>
            </div>
          )}
        </div>

        <NavLink to="/accounting/Reports" className="sidebar-link">
          <FileText className="icon" />
          <span>Reports</span>
        </NavLink>

        <NavLink to="/accounting/Employees" className="sidebar-link">
          <Users className="icon" />
          <span>Employees</span>
        </NavLink>

        <NavLink to="/accounting/vehicles" className="sidebar-link">
          <Truck className="icon" />
          <span>Vehicles</span>
        </NavLink>

        <NavLink to="/accounting/settings" className="sidebar-link">
          <Settings className="icon" />
          <span>Settings</span>
        </NavLink>
      </nav>

      {/* ----------- Footer ----------- */}
      <div className="sidebar-footer">
        <button className="logout-btn">
          <LogOut className="icon" />
          <span>Logout</span>
        </button>
        <p className="version">v1.0.0</p>
      </div>
    </aside>
  );
}
