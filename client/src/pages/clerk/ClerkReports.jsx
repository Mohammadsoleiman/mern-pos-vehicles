import React, { useContext, useMemo } from "react";
import { SalesContext } from "../../context/clerk/SalesContext";
import { VehicleContext } from "../../context/clerk/VehicleContext";
import "../../styles/clerk/clerkReports.css";
import { Package, Users, DollarSign, TrendingUp } from "lucide-react";

const ClerkReports = () => {
  const { sales, loading, error } = useContext(SalesContext);
  const { vehicles } = useContext(VehicleContext);

  // ==============================
  // 📊 BASIC STATS
  // ==============================
  const stats = useMemo(() => {
    if (!Array.isArray(sales))
      return { totalSales: 0, totalRevenue: 0, totalCustomers: 0, totalVehicles: 0 };

    const totalSales = sales.length;
    const totalRevenue = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const uniqueCustomers = new Set(
      sales.map((s) => (s.customerId?._id || s.customerId || ""))
    ).size;
    const uniqueVehicles = new Set(
      sales.map((s) =>
        s.vehicleId && typeof s.vehicleId === "object"
          ? s.vehicleId._id || s.vehicleId.id
          : s.vehicleId || ""
      )
    ).size;

    return { totalSales, totalRevenue, totalCustomers: uniqueCustomers, totalVehicles: uniqueVehicles };
  }, [sales]);

  // ==============================
  // 👥 TOP CUSTOMERS
  // ==============================
  const topCustomers = useMemo(() => {
    const map = {};
    sales.forEach((s) => {
      const name = s.customerId?.name || "Unknown";
      if (!map[name]) map[name] = { name, purchases: 0, totalSpent: 0 };
      map[name].purchases += 1;
      map[name].totalSpent += s.totalAmount || 0;
    });
    return Object.values(map).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
  }, [sales]);

  // ==============================
  // 🚗 TOP VEHICLES (SAFE FIX)
  // ==============================
  const topVehicles = useMemo(() => {
    const map = {};
    sales.forEach((s) => {
      if (!s.vehicleId) return; // skip null / undefined

      const vehicleId =
        typeof s.vehicleId === "object"
          ? s.vehicleId._id || s.vehicleId.id || ""
          : s.vehicleId || "";

      if (!vehicleId) return; // skip empty ids

      const foundVehicle =
        typeof s.vehicleId === "object"
          ? s.vehicleId
          : vehicles.find((v) => v && String(v._id) === String(vehicleId));

      const label = foundVehicle
        ? `${foundVehicle.make || "Unknown"} ${foundVehicle.model || ""}`
        : "Unknown Vehicle";

      if (!map[vehicleId]) map[vehicleId] = { label, count: 0, total: 0 };
      map[vehicleId].count += s.quantity || 1;
      map[vehicleId].total += s.totalAmount || 0;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 5);
  }, [sales, vehicles]);

  // ==============================
  // 💵 RECENT TRANSACTIONS
  // ==============================
  const recentTransactions = useMemo(() => {
    return [...sales]
      .sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      )
      .slice(0, 5);
  }, [sales]);

  // ==============================
  // 🌀 LOADING / ERROR STATES
  // ==============================
  if (loading) return <p className="reports-loading">Loading reports...</p>;
  if (error) return <p className="reports-error">Error: {error}</p>;

  // ==============================
  // 🧾 MAIN RETURN
  // ==============================
  return (
    <div className="clerk-reports-page">
      <h1 className="reports-title">Sales Reports Overview</h1>

      {/* ======= Summary Stats ======= */}
      <div className="reports-stats-grid">
        <div className="stat-card">
          <DollarSign className="stat-icon" />
          <div>
            <h2>${stats.totalRevenue.toLocaleString()}</h2>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp className="stat-icon" />
          <div>
            <h2>{stats.totalSales}</h2>
            <p>Total Sales</p>
          </div>
        </div>
        <div className="stat-card">
          <Users className="stat-icon" />
          <div>
            <h2>{stats.totalCustomers}</h2>
            <p>Unique Customers</p>
          </div>
        </div>
        <div className="stat-card">
          <Package className="stat-icon" />
          <div>
            <h2>{stats.totalVehicles}</h2>
            <p>Vehicles Sold</p>
          </div>
        </div>
      </div>

      {/* ======= Top Vehicles ======= */}
      <div className="reports-section">
        <h2>Top Selling Vehicles</h2>
        {topVehicles.length > 0 ? (
          <table className="reports-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Vehicle</th>
                <th>Units Sold</th>
                <th>Total Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topVehicles.map((v, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{v.label}</td>
                  <td>{v.count}</td>
                  <td>${v.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No vehicle sales found</p>
        )}
      </div>

      {/* ======= Top Customers ======= */}
      <div className="reports-section">
        <h2>Top Customers</h2>
        {topCustomers.length > 0 ? (
          <table className="reports-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Customer</th>
                <th>Purchases</th>
                <th>Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {topCustomers.map((c, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{c.name}</td>
                  <td>{c.purchases}</td>
                  <td>${c.totalSpent.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No customer data available</p>
        )}
      </div>

      {/* ======= Recent Transactions ======= */}
      <div className="reports-section">
        <h2>Recent Transactions</h2>
        {recentTransactions.length > 0 ? (
          <table className="reports-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Amount</th>
                <th>Method</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((t, idx) => {
                // ✅ Safe handling for null / undefined IDs
                const vehicleId =
                  t.vehicleId && typeof t.vehicleId === "object"
                    ? t.vehicleId._id || t.vehicleId.id || ""
                    : t.vehicleId || "";

                const foundVehicle =
                  t.vehicleId && typeof t.vehicleId === "object"
                    ? t.vehicleId
                    : vehicles.find(
                        (v) => v && String(v._id) === String(vehicleId)
                      );

                const vehicleLabel = foundVehicle
                  ? `${foundVehicle.make || "Unknown"} ${
                      foundVehicle.model || ""
                    }`
                  : "Unknown Vehicle";

                return (
                  <tr key={idx}>
                    <td>
                      {new Date(t.createdAt || t.date).toLocaleDateString()}
                    </td>
                    <td>{t.customerId?.name || "Unknown"}</td>
                    <td>{vehicleLabel}</td>
                    <td>${t.totalAmount?.toLocaleString()}</td>
                    <td>{t.paymentMethod || "N/A"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p className="no-data">No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default ClerkReports;
