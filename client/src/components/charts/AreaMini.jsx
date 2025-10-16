import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const data = [
  { name: "Jan", sales: 30 },
  { name: "Feb", sales: 50 },
  { name: "Mar", sales: 40 },
  { name: "Apr", sales: 70 },
  { name: "May", sales: 60 },
  { name: "Jun", sales: 90 },
  { name: "Jul", sales: 80 },
  { name: "Aug", sales: 100 },
];

export default function AreaMini() {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="10%" stopColor="#2563eb" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.05}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e8eef6" />
        <XAxis dataKey="name" tick={{ fill: "#64748b" }} />
        <YAxis tick={{ fill: "#64748b" }} />
        <Tooltip />
        <Area type="monotone" dataKey="sales" stroke="#2563eb" fill="url(#colorSales)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
