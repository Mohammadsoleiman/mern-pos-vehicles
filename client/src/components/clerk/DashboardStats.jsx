// src/components/clerk/DashboardStats.jsx
import React from "react";
import "../../styles/clerk/dashboard.css";

export default function DashboardStats({ stats }) {
  return (
    <div className="dashboard-stats">
      <div className="stat-card"><h3>{stats.totalVehicles}</h3><p>Total Vehicles</p></div>
      <div className="stat-card"><h3>{stats.soldToday}</h3><p>Sold Today</p></div>
      <div className="stat-card"><h3>{stats.totalSales}</h3><p>Total Sales</p></div>
      <div className="stat-card"><h3>${stats.revenue}</h3><p>Total Revenue</p></div>
    </div>
  );
}
