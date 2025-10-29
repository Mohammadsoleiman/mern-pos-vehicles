import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import Sidebar from "../../components/accountantpartials/Sidebar";
import "../../styles/accountant/reports.css";

export default function Reports() {
  const [period, setPeriod] = useState("monthly");

  // 🔹 Dummy data — replace later with backend API data
  const monthlyData = [
    { name: "Jan", income: 18000, expense: 10000 },
    { name: "Feb", income: 23000, expense: 15000 },
    { name: "Mar", income: 20000, expense: 14000 },
    { name: "Apr", income: 26000, expense: 18000 },
  ];

  const yearlyData = [
    { name: "2022", income: 180000, expense: 120000 },
    { name: "2023", income: 210000, expense: 160000 },
    { name: "2024", income: 250000, expense: 180000 },
    { name: "2025", income: 290000, expense: 210000 },
  ];

  const data = period === "yearly" ? yearlyData : monthlyData;

  const totalIncome = data.reduce((sum, d) => sum + d.income, 0);
  const totalExpenses = data.reduce((sum, d) => sum + d.expense, 0);
  const netProfit = totalIncome - totalExpenses;

  const currency = "$";

  return (
    <div className="reports-page">
      <Sidebar />

      <div className="reports-container">
        <header className="reports-header">
          <h1>Financial Reports</h1>
          <p>View summarized financial data and visual performance analysis.</p>
        </header>

        {/* ===== Summary Cards ===== */}
        <div className="reports-summary">
          <div className="report-card income">
            <div className="report-card-header">
              <span className="icon">💰</span>
              <h3>Total Income</h3>
            </div>
            <p className="report-value">
              {currency}
              {totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="report-card expense">
            <div className="report-card-header">
              <span className="icon">💸</span>
              <h3>Total Expenses</h3>
            </div>
            <p className="report-value">
              {currency}
              {totalExpenses.toLocaleString()}
            </p>
          </div>

          <div className="report-card profit">
            <div className="report-card-header">
              <span className="icon">📈</span>
              <h3>Net Profit</h3>
            </div>
            <p className="report-value">
              {currency}
              {netProfit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ===== Chart Section ===== */}
        <section className="chart-section">
          <div className="chart-header">
            <h2>Income vs Expenses ({period})</h2>
            <div className="period-toggle">
              <button
                className={period === "monthly" ? "active" : ""}
                onClick={() => setPeriod("monthly")}
              >
                Monthly
              </button>
              <button
                className={period === "yearly" ? "active" : ""}
                onClick={() => setPeriod("yearly")}
              >
                Yearly
              </button>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={data}
              margin={{ top: 40, right: 30, left: 0, bottom: 10 }}
              barSize={45}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip
                formatter={(value) => `${currency}${value.toLocaleString()}`}
                contentStyle={{
                  background: "#fff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
              />
              <Legend />

              {/* Income Bar */}
              <Bar dataKey="income" fill="#22c55e" radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="income"
                  position="top"
                  fill="#22c55e"
                  fontSize={13}
                  formatter={(val) => `${currency}${val.toLocaleString()}`}
                />
              </Bar>

              {/* Expense Bar */}
              <Bar dataKey="expense" fill="#ef4444" radius={[6, 6, 0, 0]}>
                <LabelList
                  dataKey="expense"
                  position="top"
                  fill="#ef4444"
                  fontSize={13}
                  formatter={(val) => `${currency}${val.toLocaleString()}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* ===== Summary Section ===== */}
        <section className="reports-summary-text">
          <h2>Analysis</h2>
          <p>
            During the selected period, your total income was{" "}
            <strong>
              {currency}
              {totalIncome.toLocaleString()}
            </strong>
            , while your total expenses reached{" "}
            <strong>
              {currency}
              {totalExpenses.toLocaleString()}
            </strong>
            . This results in a net profit of{" "}
            <strong>
              {currency}
              {netProfit.toLocaleString()}
            </strong>
            .
          </p>
          <p>
            The green bars represent income and red bars represent expenses.
            The difference between the two shows your dealership’s financial
            performance across time.
          </p>
        </section>
      </div>
    </div>
  );
}
