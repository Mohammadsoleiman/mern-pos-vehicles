import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

export default function DashboardLayout({ title, children }) {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="main">
        <Topbar title={title} />
        {children}
      </main>
    </div>
  );
}
