import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

// Sample profit data (could be calculated dynamically in real app)
const sampleData = [
  { date: "2025-10-01", profit: 1200 },
  { date: "2025-10-02", profit: 900 },
  { date: "2025-10-03", profit: -500 },
  { date: "2025-10-04", profit: 1500 },
  { date: "2025-10-05", profit: -200 },
  { date: "2025-10-06", profit: 800 },
];

export default function ProfitChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={sampleData}>
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#0000ff"
          strokeWidth={3}
          dot={{ r: 4 }}
          strokeDasharray=""
          isAnimationActive={true}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
