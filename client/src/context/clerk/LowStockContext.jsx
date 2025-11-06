import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const LowStockContext = createContext();

export const LowStockProvider = ({ children }) => {
  const [lowStockVehicles, setLowStockVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/vehicles/lowstock");
      setLowStockVehicles(res.data.vehicles || []);
    } catch (err) {
      console.error("❌ Error fetching low stock vehicles:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();

    // 🔁 Optional: Auto refresh every minute
    const interval = setInterval(fetchLowStock, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <LowStockContext.Provider value={{ lowStockVehicles, loading, error }}>
      {children}
    </LowStockContext.Provider>
  );
};
