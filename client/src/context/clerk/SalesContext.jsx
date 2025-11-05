import React, { createContext, useState, useEffect } from "react";

export const SalesContext = createContext();

export const ClerkSalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all sales from backend
  const fetchSales = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sales");
      const data = await res.json();

      // ✅ Always ensure sales is an array to prevent reduce() errors
      const salesArray = Array.isArray(data)
        ? data
        : Array.isArray(data.sales)
        ? data.sales
        : [];

      setSales(salesArray);
    } catch (err) {
      console.error("Failed to fetch sales:", err);
      setSales([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new sale
  const addSale = async (saleData) => {
    try {
      const res = await fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });
      const newSale = await res.json();

      // ✅ Safely handle server errors
      if (!res.ok) {
        console.error("Failed to add sale:", newSale.message);
        return null;
      }

      // ✅ Instant update for dashboard
      setSales((prev) => [newSale, ...prev]);
      return newSale;
    } catch (err) {
      console.error("Failed to add sale:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <SalesContext.Provider value={{ sales, addSale, fetchSales, loading }}>
      {children}
    </SalesContext.Provider>
  );
};
