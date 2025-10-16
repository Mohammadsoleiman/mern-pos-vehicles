export default function Table({ columns = [], rows = [] }) {
  return (
    <div className="card">
      <table className="table">
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
