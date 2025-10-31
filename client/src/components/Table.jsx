import styles from "../styles/dashboard.module.css";

export default function Table({ columns = [], rows = [] }) {
  return (
    <div className={styles.card}>
      <table className={styles.table}>
        <thead>
          <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c) => <td key={c}>{r[c.toLowerCase()]}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}