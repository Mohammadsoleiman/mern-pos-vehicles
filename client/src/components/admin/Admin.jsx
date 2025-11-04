import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useSettings } from "../../context/SettingsContext";
import styles from "../../styles/dashboard.module.css";

export default function Admin() {
  const { settings } = useSettings();
  const themeClass = settings.theme === "dark" ? styles.themeDark : styles.themeLight;

  return (
    <div className={`${styles.dashboardShell} ${themeClass}`}>
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
