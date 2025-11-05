// client/src/context/clerk/CustomerContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const CustomerContext = createContext();

export const ClerkCustomerProvider = ({ children }) => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch all customers from backend
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/customers");
      if (!res.ok) throw new Error("Failed to load customers");
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error("❌ Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add new customer
  const addCustomer = async (newCustomer) => {
    try {
      const res = await fetch("http://localhost:5000/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCustomer),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Add customer failed: ${errText}`);
      }

      const data = await res.json();
      setCustomers((prev) => [data, ...prev]); // Instant UI update
      return data;
    } catch (err) {
      console.error("❌ Error adding customer:", err);
      alert("Failed to add customer — check console for details.");
    }
  };

  // ✅ Refresh totals (used after a sale)
  const refreshCustomerTotals = async (customerId) => {
    try {
      const res = await fetch("http://localhost:5000/api/customers");
      const data = await res.json();
      const updated = data.find((c) => c._id === customerId);
      if (updated) {
        setCustomers((prev) =>
          prev.map((c) => (c._id === customerId ? updated : c))
        );
      }
    } catch (err) {
      console.error("Error refreshing customer totals:", err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <CustomerContext.Provider
      value={{
        customers,
        loading,
        addCustomer,
        fetchCustomers,
        refreshCustomerTotals,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};
