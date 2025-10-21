import React from "react";
import "../../styles/accountant/dashboard.css";

export default function ReportSummary() {
  const summary = {
    month: "October 2025",
    income: 12800,
    expenses: 9400,
    profit: 3400,
  };

  return (
    <div className="report-summary-card">
      <h3>{summary.month} Summary</h3>
      <p><strong>Income:</strong> ${summary.income.toLocaleString()}</p>
      <p><strong>Expenses:</strong> ${summary.expenses.toLocaleString()}</p>
      <p
        style={{
          color: summary.profit >= 0 ? "green" : "red",
          fontWeight: "bold",
        }}
      >
        Profit: ${summary.profit.toLocaleString()}
      </p>
    </div>
  );
}
