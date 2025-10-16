import { useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/StatCard";
import Table from "../components/Table";
import AreaMini from "../components/charts/AreaMini";
import DonutMini from "../components/charts/DonutMini";
import "../styles/dashboard.css"; // تأكد أنك رابط ملف الستايل المعدل

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`dashboard-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      {/* ===== Sidebar ===== */}
      <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="brand">
          <div className="avatar">A</div>
          <span className="name">Admin</span>
        </div>

        <nav className="nav">
          <a href="#" className="active">Dashboard</a>
          <a href="#">Users</a>
          <a href="#">Roles</a>
          <a href="#">Vehicles</a>
          <a href="#">Reports</a>
          <a href="#">Settings</a>
        </nav>
      </aside>

      {/* ===== Main Area ===== */}
      <main className="main">
        <div className="topbar">
          <div className="left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <h1>Dashboard</h1>
          </div>
          <div className="actions">
            <i>🔔</i>
            <i>⚙️</i>
          </div>
        </div>

        {/* ===== Cards ===== */}
        <div className="cards">
          <StatCard title="Total Vehicles" value="150" />
          <StatCard title="Total Sales" value="$120K" />
          <StatCard title="Revenue Growth" value="5.2%" />
          <StatCard title="Employees" value="24" />
        </div>

        {/* ===== Charts ===== */}
        <div className="split">
          <div className="card widget">
            <h4>Sales Over Time</h4>
            <AreaMini />
          </div>
          <div className="card widget">
            <h4>Vehicle Type Distribution</h4>
            <DonutMini />
          </div>
        </div>

        {/* ===== Tables ===== */}
        <div className="grid-2">
          <Table
            columns={["User", "Action", "Vehicle", "Date"]}
            rows={[
              { user: "Anna", action: "Added", vehicle: "Vehicle", date: "2024-04-01" },
              { user: "John", action: "Edited", vehicle: "Vehicle", date: "2024-04-02" },
            ]}
          />
          <Table
            columns={["User", "Action", "Date"]}
            rows={[
              { user: "Anna", action: "Added", date: "2024-04-01" },
              { user: "John", action: "Deleted", date: "2024-04-03" },
            ]}
          />
        </div>
      </main>
    </div>
  );
}
