import React, { createContext, useState, useEffect, useCallback } from "react";

export const SalesContext = createContext();

export const ClerkSalesProvider = ({ children }) => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api/sales";

  /* ==========================================================
     🔹 FETCH ALL SALES
  ========================================================== */
  const fetchSales = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL);
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch sales");

      // ✅ Normalize backend response shape
      const salesArray = Array.isArray(data.sales)
        ? data.sales
        : Array.isArray(data)
        ? data
        : [];

      // ✅ Sort by newest first
      salesArray.sort(
        (a, b) =>
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
      );

      setSales(salesArray);
    } catch (err) {
      console.error("❌ Error fetching sales:", err);
      setError(err.message || "Failed to load sales");
      setSales([]); // Prevent render errors
    } finally {
      setLoading(false);
    }
  }, []);

  /* ==========================================================
     🔹 ADD SALE
  ========================================================== */
  const addSale = async (saleData) => {
    try {
      setError(null);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add sale");

      // ✅ The backend returns { message, sale }
      const newSale = data.sale || data;

      // ✅ Update the UI immediately
      setSales((prev) => [newSale, ...prev]);

      return newSale;
    } catch (err) {
      console.error("❌ Error adding sale:", err);
      setError(err.message);
      return null;
    }
  };

  /* ==========================================================
     🔹 GET SALE BY ID
  ========================================================== */
  const getSaleById = (id) =>
    sales.find(
      (s) => String(s._id) === String(id) || String(s.id) === String(id)
    );

  /* ==========================================================
     🔹 DELETE SALE
  ========================================================== */
  const deleteSale = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete sale");

      setSales((prev) => prev.filter((s) => s._id !== id && s.id !== id));
      return true;
    } catch (err) {
      console.error("❌ Error deleting sale:", err);
      setError(err.message);
      return false;
    }
  };

  /* ==========================================================
     🔹 INITIAL FETCH
  ========================================================== */
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  /* ==========================================================
     🔹 CONTEXT VALUE
  ========================================================== */
  const value = {
    sales,
    loading,
    error,
    fetchSales,
    addSale,
    deleteSale,
    getSaleById,
    setSales,
  };

  return (
    <SalesContext.Provider value={value}>
      {children}
    </SalesContext.Provider>
  );
};
