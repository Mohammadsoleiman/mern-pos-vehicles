import styles from "../../styles/dashboard.module.css";
import { useSettings } from "../../context/SettingsContext";

export default function Topbar() {
  const { settings } = useSettings();
  const title = (settings?.dashboardName || "Admin Panel").trim();

  return (
    <div className={styles.topbar}>
      <h1>{title}</h1>
      <div className={styles.actions}>
        <i>🔔</i>
        <i>⚙️</i>
      </div>
    </div>
  );
}
