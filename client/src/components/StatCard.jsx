import styles from "../styles/dashboard.module.css";

export default function StatCard({ title, value }) {
  return (
    <div className={styles.card}>
      <h4>{title}</h4>
      <div className={styles.metric}>{value}</div>
    </div>
  );
}