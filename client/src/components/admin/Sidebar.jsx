import { NavLink, useNavigate } from "react-router-dom";
import styles from "../../styles/dashboard.module.css";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.avatar}>A</div>
        <span className={styles.name}>Admin</span>
      </div>

      <nav className={styles.nav}>
        <NavLink end to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/vehicles">Vehicles</NavLink>
        <NavLink to="/admin/reports">Reports</NavLink>
        <NavLink to="/admin/settings">Settings</NavLink>
      </nav>

      <button className={styles.logoutBtn} onClick={handleLogout}>
        <div className={styles.garageDoor}>
          {/* 👇 استخدم styles هون! */}
          <div className={styles.door}></div>
          <div className={styles.car}>🚗</div>
        </div>
        <span className={styles.logoutText}>Logout</span>
      </button>
    </aside>
  );
}