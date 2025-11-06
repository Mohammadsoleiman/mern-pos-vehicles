// src/context/clerk/ClerkDashboardContext.jsx
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ClerkDashboardContext = createContext();

export const ClerkDashboardProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [sales, setSales] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [lowStockVehicles, setLowStockVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [vehiclesRes, salesRes, customersRes, lowStockRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/vehicles"),
          axios.get("http://localhost:5000/api/sales"),
          axios.get("http://localhost:5000/api/customers"),
          axios.get("http://localhost:5000/api/vehicles/lowstock"),
        ]);

      setVehicles(vehiclesRes.data || []);
      setSales(salesRes.data.sales || salesRes.data || []);
      setCustomers(customersRes.data || []);
      setLowStockVehicles(lowStockRes.data.vehicles || []);
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // 🔁 Auto refresh every minute
    const interval = setInterval(fetchAllData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ClerkDashboardContext.Provider
      value={{
        vehicles,
        sales,
        customers,
        lowStockVehicles,
        loading,
        error,
        refresh: fetchAllData,
      }}
    >
      {children}
    </ClerkDashboardContext.Provider>
  );
};
