import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/accountant/overview.css";
import { TransactionContext } from "../../context/ACCOUNTANT/TransactionContext.jsx";
import { VehicleContext } from "../../context/ACCOUNTANT/VehicleContext.jsx";
import { ExpenseContext } from "../../context/ACCOUNTANT/ExpenseContext.jsx";
import IncomeExpensesChart from "../../components/chartsA/IncomeExpensesChart.jsx";

export default function FeaturesOverview() {
  const { transactions, totalIncome, totalExpenses } = useContext(TransactionContext);
  const { expenses } = useContext(ExpenseContext);
  const { vehicles, totalValue } = useContext(VehicleContext);
  const navigate = useNavigate();

  // Format as USD currency
  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value || 0);

  // Calculations
  const totalTransactions = transactions.length;
  const totalVehicles = vehicles.length;
  const profit = totalIncome - totalExpenses;
  const profitMargin = totalIncome ? ((profit / totalIncome) * 100).toFixed(1) : 0;

  // Quick Access Features
  const features = [
    {
      id: 1,
      title: "Transactions",
      icon: "💳",
      description: "Manage income and expenses",
      count: totalTransactions,
      route: "/accounting/transactions",
      color: "blue",
    },
    {
      id: 2,
      title: "Reports",
      icon: "📊",
      description: "Generate and export financial reports",
      count: "4 Reports",
      route: "/accounting/reports",
      color: "purple",
    },
    {
      id: 3,
      title: "Employees",
      icon: "👥",
      description: "View and manage employee details",
      count: "Team Members",
      route: "/accounting/employees",
      color: "teal",
    },
    {
      id: 4,
      title: "Vehicles",
      icon: "🚗",
      description: "Manage and track company vehicles",
      count: totalVehicles,
      route: "/accounting/vehicles",
      color: "orange",
    },
  ];

  return (
    <div className="overview-page">
      {/* Header */}
      <header className="overview-header">
        <h1>Accounting Overview</h1>
        <p>Monitor your dealership’s income, expenses, vehicles, and employees — all in one place.</p>
      </header>

      {/* 🔹 Mini Topbar Summary */}
      <div className="topbar-summary">
        <div className="summary-card">
          <h4>Profit Margin</h4>
          <p>{profitMargin}%</p>
        </div>
        <div className="summary-card">
          <h4>Vehicles</h4>
          <p>{totalVehicles}</p>
        </div>
        <div className="summary-card">
          <h4>Transactions</h4>
          <p>{totalTransactions}</p>
        </div>
        <div className="summary-card">
          <h4>Employees</h4>
          <p>Active</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="overview-stats">
        <div className="stat-card primary" onClick={() => navigate("/accounting/transactions")}>
          <div className="stat-header">
            <span>💰</span>
            <h3>Total Income</h3>
          </div>
          <p className="stat-value">{formatUSD(totalIncome)}</p>
          <p className="stat-subtitle">From all sales</p>
        </div>

        <div className="stat-card secondary" onClick={() => navigate("/accounting/transactions")}>
          <div className="stat-header">
            <span>💸</span>
            <h3>Total Expenses</h3>
          </div>
          <p className="stat-value">{formatUSD(totalExpenses)}</p>
          <p className="stat-subtitle">Business operations</p>
        </div>

        <div
          className={`stat-card ${profit >= 0 ? "success" : "danger"}`}
          onClick={() => navigate("/accounting/reports")}
        >
          <div className="stat-header">
            <span>{profit >= 0 ? "📈" : "📉"}</span>
            <h3>{profit >= 0 ? "Net Profit" : "Net Loss"}</h3>
          </div>
          <p className="stat-value">{formatUSD(profit)}</p>
          <p className="stat-subtitle">{profitMargin}% margin</p>
        </div>

        <div className="stat-card accent" onClick={() => navigate("/accounting/vehicles")}>
          <div className="stat-header">
            <span>🚗</span>
            <h3>Inventory Value</h3>
          </div>
          <p className="stat-value">{formatUSD(totalValue)}</p>
          <p className="stat-subtitle">{totalVehicles} vehicles</p>
        </div>
      </div>

      {/* Quick Access */}
      <section className="overview-section">
        <h2>Quick Access</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card ${feature.color}`}
              onClick={() => navigate(feature.route)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-info">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <span className="feature-count">{feature.count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Chart */}
      <section className="overview-section">
        <h2>Financial Overview</h2>
        <div className="chart-box">
          <IncomeExpensesChart timeframe="monthly" />
        </div>
      </section>

      {/* Recent Activity */}
      <section className="overview-section">
        <h2>Recent Activity</h2>
        <div className="activity-grid">
          <div className="activity-card">
            <div className="activity-icon">🧾</div>
            <div className="activity-info">
              <h4>Latest Transaction</h4>
              <p>
                {transactions.length
                  ? formatUSD(transactions[0]?.amount)
                  : "No transactions yet"}
              </p>
            </div>
          </div>

          <div className="activity-card">
            <div className="activity-icon">💸</div>
            <div className="activity-info">
              <h4>Latest Expense</h4>
              <p>
                {expenses.length
                  ? formatUSD(expenses[0]?.amount)
                  : "No expenses yet"}
              </p>
            </div>
          </div>

          <div className="activity-card">
            <div className="activity-icon">🚗</div>
            <div className="activity-info">
              <h4>Latest Vehicle</h4>
              <p>{vehicles.length ? vehicles[0]?.make || "Unknown" : "No vehicles yet"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
