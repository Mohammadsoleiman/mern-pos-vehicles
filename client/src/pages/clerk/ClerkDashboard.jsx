// src/pages/clerk/ClerkDashboard.jsx
import React, { useContext, useState, useEffect } from "react";
import { VehicleContext } from "../../context/clerk/VehicleContext";
import { SalesContext } from "../../context/clerk/SalesContext";
import { CustomerContext } from "../../context/clerk/CustomerContext";
import {
  TrendingUp,
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  ShoppingCart,
  Calendar,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import "../../styles/clerk/ClerkDashboard.css";

const ClerkDashboard = () => {
  const { vehicles, loading: vehiclesLoading } = useContext(VehicleContext);
  const { sales, loading: salesLoading } = useContext(SalesContext);
  const { customers } = useContext(CustomerContext);

  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    totalVehicles: 0,
    totalCustomers: 0,
    lowStockVehicles: 0,
    todaySales: 0,
    monthlyGrowth: 0,
    topSellingVehicle: null,
  });

  // ✅ Helper to normalize IDs
  const getId = (obj) => String(obj?._id || obj?.id || obj || "");

  useEffect(() => {
    if (!vehiclesLoading && !salesLoading) calculateStats();
  }, [vehicles, sales, customers]);

  const calculateStats = () => {
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + (Number(sale.totalAmount) || 0),
      0
    );

    const lowStockVehicles = vehicles.filter((v) => (v.stock || 0) < 5).length;

    const today = new Date().toISOString().split("T")[0];
    const todaySales = sales.filter((s) => {
      const date =
        s.createdAt ||
        s.updatedAt ||
        s.date ||
        new Date().toISOString();
      return String(date).startsWith(today);
    }).length;

    const monthlyGrowth = 12.5;

    // ✅ Count vehicle sales properly
    const vehicleSales = {};
    sales.forEach((sale) => {
      const vehicleId = getId(sale.vehicleId);
      if (!vehicleId) return;
      vehicleSales[vehicleId] = (vehicleSales[vehicleId] || 0) + 1;
    });

    // ✅ Determine top-selling vehicle
    const topVehicleId = Object.keys(vehicleSales).reduce((a, b) =>
      vehicleSales[a] > vehicleSales[b] ? a : b,
      null
    );

    const topSellingVehicle = vehicles.find(
      (v) => getId(v) === String(topVehicleId)
    );

    setStats({
      totalSales: sales.length,
      totalRevenue,
      totalVehicles: vehicles.length,
      totalCustomers: customers.length,
      lowStockVehicles,
      todaySales,
      monthlyGrowth,
      topSellingVehicle,
    });
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend, trendUp }) => (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-info">
          <p className="stat-card-title">{title}</p>
          <h3 className="stat-card-value">{value}</h3>
          {subtitle && (
            <div className="stat-card-footer">
              <span className="stat-card-subtitle">{subtitle}</span>
              {trend && (
                <span
                  className={`stat-card-trend ${
                    trendUp ? "trend-up" : "trend-down"
                  }`}
                >
                  {trendUp ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {trend}%
                </span>
              )}
            </div>
          )}
        </div>
        <div
          className={`stat-card-icon ${
            title.includes("Revenue")
              ? "green-bg"
              : title.includes("Sales")
              ? "blue-bg"
              : title.includes("Vehicles")
              ? "purple-bg"
              : "orange-bg"
          }`}
        >
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  const AlertCard = ({ vehicle }) => (
    <div className="alert-item">
      <AlertTriangle className="alert-icon" size={24} />
      <div className="alert-content">
        <h4>
          {vehicle.make} {vehicle.model}
        </h4>
        <p>Only {vehicle.stock || 0} units left in stock</p>
      </div>
      <span className="alert-badge">Low Stock</span>
    </div>
  );

  const RecentSale = ({ sale }) => {
    const vehicle = vehicles.find((v) => getId(v) === getId(sale.vehicleId));
    const customer = customers.find((c) => getId(c) === getId(sale.customerId));

    return (
      <div className="recent-sale-item">
        <div className="recent-sale-left">
          <div className="recent-sale-icon">
            <ShoppingCart size={20} />
          </div>
          <div className="recent-sale-details">
            <h4>
              {vehicle
                ? `${vehicle.make || ""} ${vehicle.model || ""}`
                : "Unknown Vehicle"}
            </h4>
            <p>{customer?.name || "Unknown Customer"}</p>
          </div>
        </div>
        <div className="recent-sale-right">
          <p className="recent-sale-amount">
            ${sale.totalAmount?.toLocaleString() || 0}
          </p>
          <p className="recent-sale-date">
            {new Date(
              sale.createdAt || sale.updatedAt || sale.date || Date.now()
            ).toLocaleDateString()}
          </p>
        </div>
      </div>
    );
  };

  if (vehiclesLoading || salesLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="clerk-dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-header-content">
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
          <div className="dashboard-date-badge">
            <Calendar size={20} />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon={DollarSign}
            title="Total Revenue"
            value={`$${stats.totalRevenue.toLocaleString()}`}
            subtitle="This month"
            trend={stats.monthlyGrowth}
            trendUp={true}
          />
          <StatCard
            icon={TrendingUp}
            title="Total Sales"
            value={stats.totalSales}
            subtitle={`${stats.todaySales} sales today`}
          />
          <StatCard
            icon={Package}
            title="Vehicle Inventory"
            value={stats.totalVehicles}
            subtitle={`${stats.lowStockVehicles} low stock`}
          />
          <StatCard
            icon={Users}
            title="Total Customers"
            value={stats.totalCustomers}
            subtitle="Active customers"
          />
        </div>

        {/* Main Content Grid */}
        <div className="dashboard-main-grid">
          {/* Recent Sales */}
          <div className="recent-sales-card">
            <div className="card-header">
              <h2>Recent Sales</h2>
              <p>Latest transactions</p>
            </div>
            <div className="recent-sales-list">
              {sales.slice(0, 5).map((sale) => (
                <RecentSale key={sale._id || sale.id} sale={sale} />
              ))}
            </div>
            {sales.length === 0 && (
              <div className="empty-state">
                <ShoppingCart size={48} />
                <p>No sales recorded yet</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="dashboard-sidebar">
            {/* Low Stock Alerts */}
            <div className="low-stock-card">
              <div className="card-header">
                <h2>Low Stock Alerts</h2>
                <p>Vehicles running low</p>
              </div>
              <div className="low-stock-list">
                {vehicles
                  .filter((v) => (v.stock || 0) < 5)
                  .slice(0, 3)
                  .map((vehicle) => (
                    <AlertCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
                  ))}
                {vehicles.filter((v) => (v.stock || 0) < 5).length === 0 && (
                  <div className="empty-state">
                    <Package size={48} />
                    <p>All vehicles well stocked</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Selling Vehicle */}
            {stats.topSellingVehicle && (
              <div className="top-seller-card">
                <h3>🏆 Top Seller</h3>
                <h2>
                  {stats.topSellingVehicle.make}{" "}
                  {stats.topSellingVehicle.model}
                </h2>
                <p className="subtitle">Most popular vehicle this month</p>
                <div className="top-seller-divider">
                  <div className="top-seller-price">
                    <span className="top-seller-price-label">Price</span>
                    <span className="top-seller-price-value">
                      ${stats.topSellingVehicle.price?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClerkDashboard;
