import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Cars", value: 50 },
  { name: "Boats", value: 25 },
  { name: "Motorcycles", value: 25 },
];

const COLORS = ["#1d4ed8", "#3b82f6", "#93c5fd"];

export default function DonutMini() {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}
