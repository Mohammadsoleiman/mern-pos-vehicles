import React, { useContext, useState, useEffect } from "react";
import { VehicleContext } from "../../context/clerk/VehicleContext";
import { SalesContext } from "../../context/clerk/SalesContext";
import { CustomerContext } from "../../context/clerk/CustomerContext";
import { LowStockContext } from "../../context/clerk/LowStockContext";
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
  const { lowStockVehicles, loading: lowStockLoading, error } =
    useContext(LowStockContext);

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

  // ==============================
  // 🧮 STATS CALCULATION
  // ==============================
  useEffect(() => {
    if (!vehiclesLoading && !salesLoading) calculateStats();
  }, [vehicles, sales, customers]);

  const calculateStats = () => {
    const totalRevenue = sales.reduce(
      (sum, sale) => sum + (Number(sale.totalAmount) || 0),
      0
    );

    const lowStockCount = vehicles.filter((v) => (v.stock || 0) < 5).length;

    const today = new Date().toISOString().split("T")[0];
    const todaySales = sales.filter((s) => {
      const date =
        s.createdAt || s.updatedAt || s.date || new Date().toISOString();
      return String(date).startsWith(today);
    }).length;

    const monthlyGrowth = 12.5; // mock % growth for demo

    const vehicleSales = {};
    sales.forEach((sale) => {
      if (!sale.vehicleId) return;
      const id =
        typeof sale.vehicleId === "object"
          ? sale.vehicleId._id || sale.vehicleId.id
          : sale.vehicleId;
      if (id) vehicleSales[id] = (vehicleSales[id] || 0) + 1;
    });

    const topVehicleId = Object.keys(vehicleSales).reduce(
      (a, b) => (vehicleSales[a] > vehicleSales[b] ? a : b),
      null
    );

    const topSellingVehicle = vehicles.find(
      (v) => String(v._id) === String(topVehicleId)
    );

    setStats({
      totalSales: sales.length,
      totalRevenue,
      totalVehicles: vehicles.length,
      totalCustomers: customers.length,
      lowStockVehicles: lowStockCount,
      todaySales,
      monthlyGrowth,
      topSellingVehicle,
    });
  };

  // ==============================
  // 📊 REUSABLE STAT CARD
  // ==============================
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

  // ==============================
  // ⚠️ ALERT CARD
  // ==============================
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

  // ==============================
  // 💰 RECENT SALE CARD (SAFE FIX)
  // ==============================
  const RecentSale = ({ sale }) => {
    // ✅ Safe access for vehicleId and customerId
    const vehicleId =
      sale.vehicleId && typeof sale.vehicleId === "object"
        ? sale.vehicleId._id || sale.vehicleId.id
        : sale.vehicleId || null;

    const vehicle = vehicles.find(
      (v) => v && String(v._id) === String(vehicleId)
    );

    const customerId =
      sale.customerId && typeof sale.customerId === "object"
        ? sale.customerId._id || sale.customerId.id
        : sale.customerId || null;

    const customer = customers.find(
      (c) => c && String(c._id) === String(customerId)
    );

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

  // ==============================
  // 🌀 LOADING STATE
  // ==============================
  if (vehiclesLoading || salesLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  // ==============================
  // 🌟 MAIN RENDER
  // ==============================
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

        {/* Stats */}
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

        {/* Main Grid */}
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
            {/* Low Stock */}
            <div className="low-stock-card">
              <div className="card-header">
                <h2>Low Stock Alerts</h2>
                <p>Vehicles running low</p>
              </div>
              <div className="low-stock-list">
                {lowStockLoading ? (
                  <p>Loading low stock vehicles...</p>
                ) : error ? (
                  <p className="error-text">⚠️ {error}</p>
                ) : lowStockVehicles.length > 0 ? (
                  lowStockVehicles.slice(0, 3).map((vehicle) => (
                    <AlertCard key={vehicle._id || vehicle.id} vehicle={vehicle} />
                  ))
                ) : (
                  <div className="empty-state">
                    <Package size={48} />
                    <p>All vehicles well stocked</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Seller */}
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
