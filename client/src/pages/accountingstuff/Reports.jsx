import React, { useState, useEffect } from "react";
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
import { fetchSummary, fetchTrend } from "../../api/reportsApi";

export default function Reports() {
  const [period, setPeriod] = useState("monthly");
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0, // this will now be the GRAND TOTAL
    netProfit: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const currency = "$";

  // 🧠 Fetch summary + chart data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [summaryData, trendData] = await Promise.all([
          fetchSummary(),
          fetchTrend(period),
        ]);
        setSummary(summaryData);
        setChartData(trendData);
      } catch (error) {
        console.error("❌ Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [period]);

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
              {summary.totalIncome.toLocaleString()}
            </p>
          </div>

          <div className="report-card expense">
            <div className="report-card-header">
              <span className="icon">💸</span>
              <h3>Grand Total (All Expenses)</h3>
            </div>
            <p className="report-value">
              {currency}
              {summary.totalExpenses.toLocaleString()}
            </p>
          </div>

          <div className="report-card profit">
            <div className="report-card-header">
              <span className="icon">📈</span>
              <h3>Net Profit</h3>
            </div>
            <p className="report-value">
              {currency}
              {summary.netProfit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ===== Chart Section ===== */}
        <section className="chart-section">
          <div className="chart-header">
            <h2>Income vs Grand Total ({period})</h2>
            <div className="period-toggle">
              <button
                className={period === "daily" ? "active" : ""}
                onClick={() => setPeriod("daily")}
              >
                Daily
              </button>
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

          {loading ? (
            <p style={{ padding: "20px", color: "#6b7280" }}>Loading chart...</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart
                data={chartData}
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
          )}
        </section>

        {/* ===== Summary Text ===== */}
        <section className="reports-summary-text">
          <h2>Analysis</h2>
          <p>
            During the selected period, your total income was{" "}
            <strong>
              {currency}
              {summary.totalIncome.toLocaleString()}
            </strong>
            , while your total spending (expenses, purchases, payroll) reached{" "}
            <strong>
              {currency}
              {summary.totalExpenses.toLocaleString()}
            </strong>
            . This results in a net profit of{" "}
            <strong>
              {currency}
              {summary.netProfit.toLocaleString()}
            </strong>
            .
          </p>
          <p>
            Green bars = income, red bars = total expenses. Switch between
            Daily, Monthly, and Yearly to view detailed insights.
          </p>
        </section>
      </div>
    </div>
  );
}
