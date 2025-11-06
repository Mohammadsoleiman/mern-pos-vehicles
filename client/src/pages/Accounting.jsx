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

  // ✅ لو الصفحات اشتغلت قبل تحميل الإعدادات → نمنع الكراش
  if (!settings) {
    return <div className="loading-screen">Loading settings...</div>;
  }

  // ✅ Theme Class
  const themeClass = settings.theme === "dark" ? "theme-dark" : "theme-light";

  return (
    <div className={`accounting-page ${themeClass}`}>
      <Sidebar />
      <div className="accounting-content">
        <Outlet />
      </div>
    </div>
  );
}
