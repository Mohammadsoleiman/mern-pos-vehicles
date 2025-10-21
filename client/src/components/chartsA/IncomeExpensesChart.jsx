import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";

// Sample data for daily, monthly, yearly
const dailyData = [
  { date: "2025-10-01", income: 1200, expense: 500 },
  { date: "2025-10-02", income: 900, expense: 300 },
  { date: "2025-10-03", income: 1500, expense: 700 },
  { date: "2025-10-04", income: 800, expense: 400 },
];

export default function IncomeExpensesChart() {
  const [period, setPeriod] = useState("daily");
  const data = dailyData; // replace with monthly/yearly logic if needed

  return (
    <div style={{ width: "100%", height: 250 }}>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setPeriod("daily")}>Daily</button>
        <button onClick={() => setPeriod("monthly")}>Monthly</button>
        <button onClick={() => setPeriod("yearly")}>Yearly</button>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#00ff00" />
          <Line type="monotone" dataKey="expense" stroke="#ff0000" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
