import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaShieldAlt, FaCarSide, FaChartBar, FaCog } from "react-icons/fa";

export default function Sidebar() {
  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { to: "/users",     label: "Users",     icon: <FaUsers /> },
    { to: "/roles",     label: "Roles",     icon: <FaShieldAlt /> },
    { to: "/vehicles",  label: "Vehicles",  icon: <FaCarSide /> },
    { to: "/reports",   label: "Reports",   icon: <FaChartBar /> },
    { to: "/settings",  label: "Settings",  icon: <FaCog /> },
  ];

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="avatar">A</div>
        <div className="name">Admin</div>
      </div>

      <nav className="nav">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({isActive}) => isActive ? "active" : ""}>
            {l.icon}<span>{l.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
