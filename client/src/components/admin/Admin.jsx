import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import styles from "../../styles/dashboard.module.css";

export default function Admin() {
  return (
    <div className={styles.dashboardShell}>
      <Sidebar />
      <main className={styles.main}>
        <Topbar />
        <div className={styles.pageContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}