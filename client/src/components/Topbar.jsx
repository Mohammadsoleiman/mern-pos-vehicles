import styles from "../../styles/dashboard.module.css";

export default function Topbar() {
  // ✅ نقرأ الإعدادات قبل الـ return
  const settings = JSON.parse(localStorage.getItem("settings"));

  return (
    <div className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <h1>{settings?.dashboardName || "Admin Panel"}</h1>
      </div>

      <div className={styles.actions}>
        <i>🔔</i>
        <i>⚙️</i>
      </div>
    </div>
  );
}
