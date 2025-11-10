// client/src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

import StatCard from "../components/StatCard";
import AreaMini from "../components/charts/AreaMini";
import DonutMini from "../components/charts/DonutMini";
import Table from "../components/Table";
import styles from "../styles/dashboard.module.css";

export default function Dashboard() {
  const [data, setData] = useState({
    totalVehicles: 0,
    totalSales: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    monthlySales: [],
    vehicleTypes: [],
    recentPurchases: [],
    recentPayments: [],
  });

  useEffect(() => {
    axiosClient.get("/dashboard")
      .then((res) => {
        setData({
          ...res.data,
          recentPurchases: res.data.recentPurchases || [],
          recentPayments: res.data.recentPayments || []
        });
      })
      .catch((err) => console.error("Dashboard Load Error:", err));
  }, []);

  return (
    <div className={styles.pageContent}>

      {/* ✅ Stat Cards */}
      <div className={styles.cards}>
        <StatCard title="Total Vehicles" value={data.totalVehicles} />
        <StatCard title="Total Sales" value={data.totalSales} />
        <StatCard title="Total Revenue" value={`$${data.totalRevenue}`} />
        <StatCard title="Customers" value={data.totalCustomers} />
      </div>

      {/* ✅ Charts Section */}
      <div className={styles.split}>
        <div className={styles.widget}>
          <h4>Sales Over Time</h4>
          <AreaMini data={data.monthlySales} />
        </div>

        <div className={styles.widget}>
          <h4>Vehicle Type Distribution</h4>
          <DonutMini data={data.vehicleTypes} />
        </div>
      </div>

      {/* ✅ Recent Activities Tables */}
      <div className={styles.grid2}>
        
        {/* Recent Purchases */}
        <Table
          columns={["Customer", "Action", "Vehicle", "Date"]}
          rows={data.recentPurchases.map((item) => ({
            customer: item.customerId?.name || "Unknown",
            action: "Bought",
            vehicle: item.vehicleId?.make || item.vehicleId?.model || "N/A",
            date: item.date?.split("T")[0] || item.createdAt?.split("T")[0] || "N/A",
          }))}
        />

        {/* Recent Payments */}
        <Table
          columns={["Customer", "Action", "Date"]}
          rows={data.recentPayments.map((item) => ({
            customer: item.customerId?.name || "Unknown",
            action: "Payment",
            date: item.date?.split("T")[0] || item.createdAt?.split("T")[0] || "N/A",
          }))}
        />

      </div>

    </div>
  );
}
