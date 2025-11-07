import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#1d4ed8", "#3b82f6", "#93c5fd", "#60a5fa", "#bfdbfe"];

export default function DonutMini({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: "20px", textAlign: "center", fontSize: "14px", opacity: 0.7 }}>
        No Vehicle Data Available
      </div>
    );
  }

  const formattedData = data.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
  }));

  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          dataKey="value"
        >
          {formattedData.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
