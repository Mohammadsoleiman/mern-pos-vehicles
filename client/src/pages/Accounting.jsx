import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/accountantpartials/Sidebar.jsx";
import { useSettings } from "../context/SettingsContext";
import "../styles/accountant/dashboard.css";

export default function Accounting() {
  const { settings } = useSettings();
  const themeClass = settings.theme === "dark" ? "theme-dark" : "theme-light";

  return (
    <div className={`accounting-page ${themeClass}`}>
      <Sidebar />

      {/* ✅ نحمّل المحتوى بكسل شفاف بدل ما يفرغ */}
      <div className="accounting-content">
        <Suspense fallback={<div className="loading-screen">Loading...</div>}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}
