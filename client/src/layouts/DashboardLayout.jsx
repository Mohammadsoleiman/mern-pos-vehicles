import { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();

    // وقت بسيط للأنيميشن قبل الرجوع
    setTimeout(() => navigate("/"), 900);
  };

  return (
    <div className={`dashboard-shell ${sidebarOpen ? "sidebar-open" : ""}`}>
      <aside className={`sidebar ${sidebarOpen ? "show" : ""}`}>
        <div className="brand">
          <div className="avatar">A</div>
          <span className="name">Admin</span>
        </div>

        <nav className="nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/users">Users</Link>
          <Link to="/roles">Roles</Link>
          <Link to="/vehicles">Vehicles</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/settings">Settings</Link>

          {/* 🚗 Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>
            <div className="garage-door">
              <div className="door"></div>
              <div className="car">🚗</div>
            </div>
            <span className="logout-text">Logout</span>
          </button>
        </nav>
      </aside>

      <main className="main">
        <div className="topbar">
          <div className="left">
            <button className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            <h1>Admin Panel</h1>
          </div>
          <div className="actions">
            <i>🔔</i>
            <i>⚙️</i>
          </div>
        </div>

        <Outlet />
      </main>
    </div>
  );
}
