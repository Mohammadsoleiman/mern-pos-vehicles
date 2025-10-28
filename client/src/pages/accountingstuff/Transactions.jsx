// src/pages/accountant/AccountantTransactions.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign, TrendingUp, TrendingDown, Calendar,
  Users, Wrench, Building, FileText, ShieldAlert,
  Car, Package, CreditCard, ArrowUpRight,
  ArrowDownRight, PieChart, Eye, Download
} from "lucide-react";
import "../../styles/accountant/transactions.css";

export default function AccountantTransactions() {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState("month");

  const financialData = {
    totalIncome: 485750,
    totalExpenses: 312400,
    netProfit: 173350,
    profitMargin: 35.7,
    expenses: {
      employeeSalaries: 125000,
      vehicleRelated: 87500,
      officeAdmin: 65400,
      miscellaneous: 34500
    },
    income: {
      vehicleSales: 325000,
      servicesMaintenance: 98750,
      otherServices: 47000,
      taxesFees: 15000
    }
  };

  const expenseCategories = [
    {
      name: "Employee Salaries",
      amount: 125000,
      percentage: 40,
      icon: <Users size={24} />,
      color: "#3b82f6",
      subcategories: ["Monthly Salary", "Bonuses", "Benefits", "Overtime"]
    },
    {
      name: "Vehicle-Related Costs",
      amount: 87500,
      percentage: 28,
      icon: <Wrench size={24} />,
      color: "#8b5cf6",
      subcategories: ["Tools & Equipment", "Spare Parts"]
    },
    {
      name: "Office & Administrative",
      amount: 65400,
      percentage: 21,
      icon: <Building size={24} />,
      color: "#10b981",
      subcategories: ["Rent", "Office Supplies", "Subscriptions", "Utilities"]
    },
    {
      name: "Miscellaneous",
      amount: 34500,
      percentage: 11,
      icon: <ShieldAlert size={24} />,
      color: "#f59e0b",
      subcategories: ["Insurance", "Taxes"]
    }
  ];

  const incomeCategories = [
    {
      name: "Vehicle Sales",
      amount: 325000,
      percentage: 67,
      icon: <Car size={24} />,
      color: "#10b981",
      subcategories: ["New Vehicles", "Used Vehicles"]
    },
    {
      name: "Service & Maintenance",
      amount: 98750,
      percentage: 20,
      icon: <Wrench size={24} />, // ✅ كان Tool واستبدلناه بـ Wrench
      color: "#3b82f6",
      subcategories: ["Repairs", "Oil Change", "Tire Services"]
    },
    {
      name: "Other Services",
      amount: 47000,
      percentage: 10,
      icon: <Package size={24} />,
      color: "#8b5cf6",
      subcategories: ["Vehicle Registration", "Parts & Accessories"]
    },
    {
      name: "Taxes & Fees",
      amount: 15000,
      percentage: 3,
      icon: <CreditCard size={24} />,
      color: "#f59e0b",
      subcategories: ["Late Payments", "Delivery", "Shipping"]
    }
  ];

  const exportReport = () => {
    const csvContent = [
      ["Financial Summary Report - " + new Date().toLocaleDateString()],
      [""],
      ["Income Summary"],
      ["Category", "Amount", "Percentage"],
      ...incomeCategories.map(c => [c.name, `$${c.amount.toLocaleString()}`, `${c.percentage}%`]),
      ["Total Income", `$${financialData.totalIncome.toLocaleString()}`, "100%"],
      [""],
      ["Expense Summary"],
      ["Category", "Amount", "Percentage"],
      ...expenseCategories.map(c => [c.name, `$${c.amount.toLocaleString()}`, `${c.percentage}%`]),
      ["Total Expenses", `$${financialData.totalExpenses.toLocaleString()}`, "100%"],
      [""],
      ["Net Profit", `$${financialData.netProfit.toLocaleString()}`],
      ["Profit Margin", `${financialData.profitMargin}%`]
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `financial-summary-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        <header className="transactions-header">
          <div className="header-content">
            <h1>
              <DollarSign size={36} />
              Financial Transactions
            </h1>
            <p>Overview of income and expenses summary</p>
          </div>
          <div className="header-actions">
            <select
              className="date-range-select"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button className="btn-export" onClick={exportReport}>
              <Download size={18} />
              Export Report
            </button>
          </div>
        </header>

        <div className="metrics-grid">
          <div className="metric-card metric-income">
            <div className="metric-icon">
              <TrendingUp size={28} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Total Income</p>
              <h2 className="metric-value">${financialData.totalIncome.toLocaleString()}</h2>
              <div className="metric-trend up">
                <ArrowUpRight size={16} />
                <span>12.5% from last month</span>
              </div>
            </div>
          </div>

          <div className="metric-card metric-expense">
            <div className="metric-icon">
              <TrendingDown size={28} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Total Expenses</p>
              <h2 className="metric-value">${financialData.totalExpenses.toLocaleString()}</h2>
              <div className="metric-trend down">
                <ArrowDownRight size={16} />
                <span>3.2% from last month</span>
              </div>
            </div>
          </div>

          <div className="metric-card metric-profit">
            <div className="metric-icon">
              <DollarSign size={28} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Net Profit</p>
              <h2 className="metric-value">${financialData.netProfit.toLocaleString()}</h2>
              <div className="metric-trend up">
                <ArrowUpRight size={16} />
                <span>18.7% from last month</span>
              </div>
            </div>
          </div>

          <div className="metric-card metric-margin">
            <div className="metric-icon">
              <PieChart size={28} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Profit Margin</p>
              <h2 className="metric-value">{financialData.profitMargin}%</h2>
              <div className="metric-trend up">
                <ArrowUpRight size={16} />
                <span>2.1% from last month</span>
              </div>
            </div>
          </div>
        </div>

        <section className="summary-section">
          <div className="section-header">
            <div>
              <h2>
                <TrendingUp size={24} />
                Income Summary
              </h2>
              <p>Breakdown of all revenue sources</p>
            </div>
            <button
              className="btn-view-details"
              onClick={() => navigate('/accounting/income')}
            >
              <Eye size={18} />
              View Details
            </button>
          </div>

          <div className="categories-grid">
            {incomeCategories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-header">
                  <div
                    className="category-icon"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p className="category-amount">${category.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="category-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                  <span className="progress-label">{category.percentage}% of total</span>
                </div>

                <div className="category-subcategories">
                  {category.subcategories.map((sub, idx) => (
                    <span key={idx} className="subcategory-tag">{sub}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="summary-section">
          <div className="section-header">
            <div>
              <h2>
                <TrendingDown size={24} />
                Expenses Summary
              </h2>
              <p>Breakdown of all business expenses</p>
            </div>
            <button
              className="btn-view-details"
              onClick={() => navigate('/accounting/expenses')}
            >
              <Eye size={18} />
              View Details
            </button>
          </div>

          <div className="categories-grid">
            {expenseCategories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-header">
                  <div
                    className="category-icon"
                    style={{ backgroundColor: category.color }}
                  >
                    {category.icon}
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    <p className="category-amount">${category.amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="category-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${category.percentage}%`,
                        backgroundColor: category.color
                      }}
                    />
                  </div>
                  <span className="progress-label">{category.percentage}% of total</span>
                </div>

                <div className="category-subcategories">
                  {category.subcategories.map((sub, idx) => (
                    <span key={idx} className="subcategory-tag">{sub}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
