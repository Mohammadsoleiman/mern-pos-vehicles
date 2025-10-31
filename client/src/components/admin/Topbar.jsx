import styles from "../../styles/dashboard.module.css";

export default function Topbar() {
  return (
    <div className={styles.topbar}>
      <div className="left">
        <h1>Admin Panel</h1>
      </div>
      <div className="actions">
        <i>🔔</i>
        <i>⚙️</i>
      </div>
    </div>
  );
}