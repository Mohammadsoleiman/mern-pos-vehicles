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
    <div className="accounts-unique-page">
      <Sidebar />
      <div className="accounts-unique-content">
        <h2 className="accounts-main-title">Financial Dashboard</h2>

        {/* Summary cards */}
        <div className="accounts-stats-container">
          <div className="accounts-stats-card">
            <h3 className="card-label">Total Income</h3>
            <p className="card-value">${totalIncome.toLocaleString()}</p>
          </div>
          <div className="accounts-stats-card">
            <h3 className="card-label">Total Expenses</h3>
            <p className="card-value">${totalExpenses.toLocaleString()}</p>
          </div>
          <div className="accounts-stats-card">
            <h3 className="card-label">Profit/Loss</h3>
            <p className="card-value" style={{ color: profit >= 0 ? "#10b981" : "#ef4444" }}>
              ${profit.toLocaleString()}
            </p>
          </div>
          <div className="accounts-stats-card">
            <h3 className="card-label">Total Vehicles Value</h3>
            <p className="card-value">${totalValue.toLocaleString()}</p>
          </div>
        </div>

        {/* Timeframe selector */}
        <div className="accounts-timeframe-controls">
          <button 
            className={`timeframe-btn ${timeframe === 'daily' ? 'active' : ''}`}
            onClick={() => setTimeframe("daily")}
          >
            Daily
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeframe("monthly")}
          >
            Monthly
          </button>
          <button 
            className={`timeframe-btn ${timeframe === 'yearly' ? 'active' : ''}`}
            onClick={() => setTimeframe("yearly")}
          >
            Yearly
          </button>
        </div>

        {/* Charts */}
        <div className="accounts-charts-container">
          <IncomeExpensesChart timeframe={timeframe} />
          <ProfitChart timeframe={timeframe} />
        </div>

        {/* Employee Table */}
        <h3 className="accounts-section-title">Employee Salaries</h3>
        <div className="accounts-employee-wrapper">
          <EmployeeTable />
        </div>
      </div>
    </div>
  );
}