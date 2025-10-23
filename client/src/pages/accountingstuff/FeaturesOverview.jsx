import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/accountant/overview.css";
import { TransactionContext } from "../../context/ACCOUNTANT/TransactionContext.jsx";
import { VehicleContext } from "../../context/ACCOUNTANT/VehicleContext.jsx";
import { ExpenseContext } from "../../context/ACCOUNTANT/ExpenseContext.jsx";
import StatCard from "../../components/accountantpartials/StatCard.jsx";
import IncomeExpensesChart from "../../components/chartsA/IncomeExpensesChart.jsx";

export default function FeaturesOverview() {
  const { transactions, totalIncome, totalExpenses } = useContext(TransactionContext);
  const { expenses } = useContext(ExpenseContext);
  const { vehicles, totalValue } = useContext(VehicleContext);
  const navigate = useNavigate();

  // Calculate metrics
  const totalTransactions = transactions.length;
  const totalVehicles = vehicles.length;
  const profit = totalIncome - totalExpenses;
  const profitMargin = totalIncome ? ((profit / totalIncome) * 100).toFixed(1) : 0;

  // Quick access features
  const features = [
    {
      id: 1,
      title: "Transactions",
      icon: "💳",
      description: "Manage income and expenses",
      count: totalTransactions,
      route: "/accounting/transactions",
      color: "blue"
    },
    {
      id: 2,
      title: "Reports",
      icon: "📊",
      description: "Generate and export reports",
      count: "4 Reports",
      route: "/accounting/reports",
      color: "purple"
    },
    {
      id: 3,
      title: "Accounts",
      icon: "💰",
      description: "View financial dashboard",
      count: `$${totalIncome.toLocaleString()}`,
      route: "/accounting/accounts",
      color: "green"
    },
    {
      id: 4,
      title: "Vehicles",
      icon: "🚗",
      description: "Inventory management",
      count: totalVehicles,
      route: "/accounting/vehicles",
      color: "orange"
    },
    {
      id: 5,
      title: "Taxes",
      icon: "🧮",
      description: "Calculate tax liability",
      count: "Sales & Income",
      route: "/accounting/taxes",
      color: "red"
    }
  ];

  return (
    <div className="overview-container">
      {/* Header */}
      <div className="overview-header">
        <h1>📊 Accounting Dashboard</h1>
        <p>Complete overview of your car dealer finances</p>
      </div>

      {/* Top Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary" onClick={() => navigate("/accounting/transactions")}>
          <div className="stat-header">
            <h3>Total Income</h3>
            <span className="icon">💰</span>
          </div>
          <p className="stat-value">${totalIncome.toLocaleString()}</p>
          <span className="stat-subtitle">From sales</span>
        </div>

        <div className="stat-card secondary" onClick={() => navigate("/accounting/transactions")}>
          <div className="stat-header">
            <h3>Total Expenses</h3>
            <span className="icon">💸</span>
          </div>
          <p className="stat-value">${totalExpenses.toLocaleString()}</p>
          <span className="stat-subtitle">Operating costs</span>
        </div>

        <div className={`stat-card ${profit >= 0 ? 'success' : 'danger'}`} onClick={() => navigate("/accounting/accounts")}>
          <div className="stat-header">
            <h3>Profit/Loss</h3>
            <span className="icon">{profit >= 0 ? '✅' : '⚠️'}</span>
          </div>
          <p className="stat-value" style={{ color: profit >= 0 ? '#10b981' : '#ef4444' }}>
            ${profit.toLocaleString()}
          </p>
          <span className="stat-subtitle">{profitMargin}% margin</span>
        </div>

        <div className="stat-card accent" onClick={() => navigate("/accounting/vehicles")}>
          <div className="stat-header">
            <h3>Inventory Value</h3>
            <span className="icon">🚗</span>
          </div>
          <p className="stat-value">${totalValue.toLocaleString()}</p>
          <span className="stat-subtitle">{totalVehicles} vehicles</span>
        </div>
      </div>

      {/* Quick Access Features */}
      <div className="features-section">
        <h2>Quick Access</h2>
        <div className="features-grid">
          {features.map((feature) => (
            <div
              key={feature.id}
              className={`feature-card feature-${feature.color}`}
              onClick={() => navigate(feature.route)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-content">
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-badge">{feature.count}</div>
              </div>
              <div className="feature-arrow">→</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <h2>Financial Overview</h2>
        <div className="chart-container">
          <h3>Income vs Expenses Trend</h3>
          <IncomeExpensesChart timeframe="monthly" />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-grid">
          <div className="activity-card">
            <div className="activity-icon">📝</div>
            <div className="activity-content">
              <h4>Latest Transaction</h4>
              <p>{transactions.length > 0 ? `$${transactions[0]?.amount || 0}` : 'No transactions'}</p>
            </div>
          </div>
          <div className="activity-card">
            <div className="activity-icon">💸</div>
            <div className="activity-content">
              <h4>Latest Expense</h4>
              <p>{expenses.length > 0 ? `$${expenses[0]?.amount || 0}` : 'No expenses'}</p>
            </div>
          </div>
          <div className="activity-card">
            <div className="activity-icon">🚗</div>
            <div className="activity-content">
              <h4>Latest Vehicle</h4>
              <p>{vehicles.length > 0 ? vehicles[0]?.make || 'N/A' : 'No vehicles'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}