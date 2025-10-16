import { FaBell, FaCog } from "react-icons/fa";

export default function Topbar({ title = "Dashboard" }) {
  return (
    <div className="topbar">
      <h1>{title}</h1>
      <div className="actions">
        <FaBell size={18} />
        <FaCog size={18} />
      </div>
    </div>
  );
}
