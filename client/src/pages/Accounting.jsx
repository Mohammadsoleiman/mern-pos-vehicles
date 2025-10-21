import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/accountantpartials/Sidebar.jsx";
import "../styles/accountant/dashboard.css";

export default function Accounting() {
  return (
    <div className="accounting-page">
      <Sidebar />
      <div className="accounting-content">
        {/* This Outlet renders the child routes */}
        <Outlet />
      </div>
    </div>
  );
}