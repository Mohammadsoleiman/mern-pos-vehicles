import React, { createContext, useState, useEffect, useCallback } from "react";

export const CustomerContext = createContext();

export const ClerkCustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:5000/api/customers";

  // ==========================================================
  // 🔹 FETCH ALL CUSTOMERS
  // ==========================================================
  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to load customers");

      const data = await res.json();
      setCustomers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching customers:", err);
      setError(err.message);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==========================================================
  // 🔹 ADD NEW CUSTOMER
  // ==========================================================
  const addCustomer = async (newCustomer) => {
    try {
      setError(null);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to add customer");

      // ✅ Add instantly in frontend
      setCustomers((prev) => [data, ...prev]);
      return data;
    } catch (err) {
      console.error("❌ Error adding customer:", err);
      setError(err.message);
      alert("Failed to add customer. Check the console for details.");
      return null;
    }
  };

  // ==========================================================
  // 🔹 UPDATE EXISTING CUSTOMER
  // ==========================================================
  const updateCustomer = async (id, updatedData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update customer");

      setCustomers((prev) =>
        prev.map((c) => (c._id === id || c.id === id ? data : c))
      );
      return data;
    } catch (err) {
      console.error("❌ Error updating customer:", err);
      setError(err.message);
      return null;
    }
  };

  // ==========================================================
  // 🔹 DELETE CUSTOMER
  // ==========================================================
  const deleteCustomer = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete customer");

      setCustomers((prev) => prev.filter((c) => c._id !== id && c.id !== id));
      return true;
    } catch (err) {
      console.error("❌ Error deleting customer:", err);
      setError(err.message);
      return false;
    }
  };

  // ==========================================================
  // 🔹 REFRESH TOTALS (used after sales)
  // ==========================================================
  const refreshCustomerTotals = async (customerId) => {
    try {
      // 1️⃣ Ask backend to recalculate totals
      const res = await fetch(`${API_URL}/updateTotals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to refresh totals");

      // 2️⃣ Fetch updated customers
      await fetchCustomers();
      console.log(`✅ Totals updated for customer ${customerId}`);
    } catch (err) {
      console.error("❌ Error refreshing customer totals:", err);
    }
  };

  // ==========================================================
  // 🔹 GET CUSTOMER BY ID
  // ==========================================================
  const getCustomerById = (id) =>
    customers.find(
      (c) => String(c._id) === String(id) || String(c.id) === String(id)
    );

  // ==========================================================
  // 🔹 INITIAL FETCH
  // ==========================================================
  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // ==========================================================
  // 🔹 CONTEXT VALUE
  // ==========================================================
  const value = {
    customers,
    loading,
    error,
    fetchCustomers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    refreshCustomerTotals,
    getCustomerById,
    setCustomers,
  };

  return (
    <CustomerContext.Provider value={value}>
      {children}
    </CustomerContext.Provider>
  );
};
