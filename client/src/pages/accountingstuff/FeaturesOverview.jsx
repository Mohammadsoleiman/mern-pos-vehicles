import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/accountant/overview.css";

// Live transaction summary (NEW)
import { TransactionSummaryContext } from "../../context/ACCOUNTANT/TransactionSummaryContext.jsx";

// Existing contexts
import { VehicleContext } from "../../context/ACCOUNTANT/VehicleContext.jsx";
import { ExpenseContext } from "../../context/ACCOUNTANT/ExpenseContext.jsx";

// Chart
import IncomeExpensesChart from "../../components/chartsA/IncomeExpensesChart.jsx";

export default function FeaturesOverview() {
  const navigate = useNavigate();

  // ✅ Live transactions & totals from backend
  const { transactions, summary, loading, refresh } = useContext(TransactionSummaryContext);
  // Vehicles / Expenses from existing contexts
  const { vehicles, totalValue } = useContext(VehicleContext);
  const { expenses } = useContext(ExpenseContext);

  useEffect(() => {
    // make sure we have the latest when landing here
    if (refresh) refresh();
  }, [refresh]);

  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);

  // 🔢 Live calculations
  const totalTransactions = transactions.length;
  const totalIncome = summary.totalIncome || 0;
  const totalExpenses = summary.totalExpenses || 0;
  const netBalance = summary.netBalance || 0; // profit/loss
  const profitMargin = totalIncome ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

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
      count: vehicles.length,
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

      {/* Topbar Summary */}
      <div className="topbar-summary">
        <div className="summary-card">
          <h4>Profit / Loss</h4>
          <p>{loading ? "…" : formatUSD(netBalance)}</p>
        </div>
        <div className="summary-card">
          <h4>Profit Margin</h4>
          <p>{loading ? "…" : `${profitMargin}%`}</p>
        </div>
        <div className="summary-card">
          <h4>Vehicles</h4>
          <p>{vehicles.length}</p>
        </div>
        <div className="summary-card">
          <h4>Transactions</h4>
          <p>{loading ? "…" : totalTransactions}</p>
        </div>
      </div>

      {/* Main Stats */}
      <div className="overview-stats">
        <div className="stat-card primary" onClick={() => navigate("/accounting/transactions")}>
          <div className="stat-header">
            <span>💰</span>
            <h3>Total Income</h3>
          </div>
          <p className="stat-value">{loading ? "Loading…" : formatUSD(totalIncome)}</p>
          <p className="stat-subtitle">From all sales & services</p>
        </div>

        <div className="stat-card secondary" onClick={() => navigate("/accounting/transactions")}>
          <div className="stat-header">
            <span>💸</span>
            <h3>Total Expenses</h3>
          </div>
          <p className="stat-value">{loading ? "Loading…" : formatUSD(totalExpenses)}</p>
          <p className="stat-subtitle">Business operations</p>
        </div>

        <div
          className={`stat-card ${netBalance >= 0 ? "success" : "danger"}`}
          onClick={() => navigate("/accounting/reports")}
        >
          <div className="stat-header">
            <span>{netBalance >= 0 ? "📈" : "📉"}</span>
            <h3>{netBalance >= 0 ? "Net Profit" : "Net Loss"}</h3>
          </div>
          <p className="stat-value">{loading ? "Loading…" : formatUSD(netBalance)}</p>
          <p className="stat-subtitle">{loading ? "…" : `${profitMargin}% margin`}</p>
        </div>

        <div className="stat-card accent" onClick={() => navigate("/accounting/vehicles")}>
          <div className="stat-header">
            <span>🚗</span>
            <h3>Inventory Value</h3>
          </div>
          <p className="stat-value">{formatUSD(totalValue)}</p>
          <p className="stat-subtitle">{vehicles.length} vehicles</p>
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

      {/* Financial Chart (can also be wired to summary if you prefer) */}
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
                {loading
                  ? "Loading…"
                  : transactions.length
                    ? `${transactions[0]?.type} • ${formatUSD(transactions[0]?.amount)}`
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
              <p>{vehicles.length ? (vehicles[0]?.model || vehicles[0]?.make || "Unknown") : "No vehicles yet"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
