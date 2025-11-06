// src/pages/Accounting.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/accountantpartials/Sidebar.jsx";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import "../styles/accountant/dashboard.css";

export default function Accounting() {
  const { user } = useAuth();
  const { settings } = useSettings();

  // ✅ لو مش أدمن → دايمًا Light

  const themeClass = settings.theme === "dark" ? "dark-theme" : "light-theme";

  return (
    <div className={`accounting-page ${themeClass}`}>
      <Sidebar />
      <div className="accounting-content">
        <Outlet />
      </div>
    </div>
  );
}
