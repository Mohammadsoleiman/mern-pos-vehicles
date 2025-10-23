import React from "react";
import "../../styles/accountant/table.css";

export default function TransactionsTable({ transactions }) {
  return (
    <table className="transactions-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Date</th>
          <th>Type</th>
          <th>Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr key={tx.id}>
            <td>{tx.id}</td>
            <td>{tx.date}</td>
            <td>{tx.type}</td>
            <td>{tx.amount}</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
