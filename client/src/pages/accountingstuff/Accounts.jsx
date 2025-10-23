import React, { useContext, useState } from "react";
import "../../styles/accountant/account.css";
import { TransactionContext } from "../../context/ACCOUNTANT/TransactionContext";
import { ExpenseContext } from "../../context/ACCOUNTANT/ExpenseContext";
import { VehicleContext } from "../../context/ACCOUNTANT/VehicleContext";

// Components
import Sidebar from "../../components/accountantpartials/Sidebar";
import ProfitChart from "../../components/chartsA/ProfitChart";
import EmployeeTable from "../../components/accountantpartials/EmployeeTable";
import IncomeExpensesChart from "../../components/chartsA/IncomeExpensesChart";

export default function Accounts() {
  const { transactions, totalIncome, totalExpenses } = useContext(TransactionContext);
  const { expenses } = useContext(ExpenseContext);
  const { vehicles, totalValue } = useContext(VehicleContext);

  const [timeframe, setTimeframe] = useState("daily"); // daily/monthly/yearly

  // Calculate profit/loss
  const profit = totalIncome - totalExpenses;

  return (
    <div className="accounting-page">
      <Sidebar />
      <div className="accounting-content">
        <h2>Financial Dashboard</h2>

        {/* Summary cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Income</h3>
            <p>${totalIncome}</p>
          </div>
          <div className="stat-card">
            <h3>Total Expenses</h3>
            <p>${totalExpenses}</p>
          </div>
          <div className="stat-card">
            <h3>Profit/Loss</h3>
            <p style={{ color: profit >= 0 ? "green" : "red" }}>
              ${profit}
            </p>
          </div>
          <div className="stat-card">
            <h3>Total Vehicles Value</h3>
            <p>${totalValue}</p>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="timeframe-selector">
          <button onClick={() => setTimeframe("daily")}>Daily</button>
          <button onClick={() => setTimeframe("monthly")}>Monthly</button>
          <button onClick={() => setTimeframe("yearly")}>Yearly</button>
        </div>

        {/* Charts */}
        <div className="charts-grid">
          <IncomeExpensesChart timeframe={timeframe} />
          <ProfitChart timeframe={timeframe} />
        </div>

        {/* Employee Table */}
        <h3>Employee Salaries</h3>
        <EmployeeTable />
      </div>
    </div>
  );
}
