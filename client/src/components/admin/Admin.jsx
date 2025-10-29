import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "../../styles/dashboard.css";

export default function Admin() {
  return (
    <div className="dashboard-shell">
      {/* ثابت: سايدبار الإدمن */}
      <Sidebar />

      {/* المنطقة الرئيسية */}
      <main className="main">
        <Topbar />
        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
