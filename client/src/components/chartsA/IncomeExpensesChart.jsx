import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";

// 🔹 Sample data (replace with backend data later)
const dailyData = [
  { date: "2025-10-01", income: 1200, expense: 500 },
  { date: "2025-10-02", income: 900, expense: 300 },
  { date: "2025-10-03", income: 1500, expense: 700 },
  { date: "2025-10-04", income: 800, expense: 400 },
];

const monthlyData = [
  { date: "Jan", income: 18000, expense: 9000 },
  { date: "Feb", income: 20000, expense: 11000 },
  { date: "Mar", income: 25000, expense: 15000 },
  { date: "Apr", income: 27000, expense: 18000 },
];

const yearlyData = [
  { date: "2022", income: 150000, expense: 110000 },
  { date: "2023", income: 210000, expense: 160000 },
  { date: "2024", income: 270000, expense: 190000 },
  { date: "2025", income: 310000, expense: 240000 },
];

export default function IncomeExpensesChart() {
  const [period, setPeriod] = useState("monthly");

  const data =
    period === "daily" ? dailyData : period === "yearly" ? yearlyData : monthlyData;

  const currency = "AED";

  const buttonStyle = {
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    padding: "6px 10px",
    marginRight: "8px",
    background: "#ffffff",
    cursor: "pointer",
    fontWeight: 500,
    color: "#374151",
    transition: "all 0.2s ease",
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: "#2563eb",
    color: "#ffffff",
    borderColor: "#2563eb",
  };

  return (
    <div style={{ width: "100%", height: 340, background: "#fff", borderRadius: "10px", padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>
          Income vs Expenses ({period.charAt(0).toUpperCase() + period.slice(1)})
        </h3>
        <div>
          <button
            style={period === "daily" ? activeButtonStyle : buttonStyle}
            onClick={() => setPeriod("daily")}
          >
            Daily
          </button>
          <button
            style={period === "monthly" ? activeButtonStyle : buttonStyle}
            onClick={() => setPeriod("monthly")}
          >
            Monthly
          </button>
          <button
            style={period === "yearly" ? activeButtonStyle : buttonStyle}
            onClick={() => setPeriod("yearly")}
          >
            Yearly
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            formatter={(value) => `${value.toLocaleString()} ${currency}`}
            contentStyle={{ background: "#fff", borderRadius: "6px", border: "1px solid #e5e7eb" }}
          />
          <Legend />

          {/* Income Line */}
          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          >
            <LabelList
              dataKey="income"
              position="top"
              formatter={(val) => `${val.toLocaleString()} ${currency}`}
              fill="#16a34a"
            />
          </Line>

          {/* Expense Line */}
          <Line
            type="monotone"
            dataKey="expense"
            stroke="#ef4444"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          >
            <LabelList
              dataKey="expense"
              position="top"
              formatter={(val) => `${val.toLocaleString()} ${currency}`}
              fill="#b91c1c"
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
