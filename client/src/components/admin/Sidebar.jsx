import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="avatar">A</div>
        <span className="name">Admin</span>
      </div>

      <nav className="nav">
        <NavLink end to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/vehicles">Vehicles</NavLink>
        <NavLink to="/admin/reports">Reports</NavLink>
        <NavLink to="/admin/settings">Settings</NavLink>
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        <div className="garage-door">
          <div className="door"></div>
          <div className="car">🚗</div>
        </div>
        <span className="logout-text">Logout</span>
      </button>
    </aside>
  );
}
