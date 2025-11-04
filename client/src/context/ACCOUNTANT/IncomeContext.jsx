import React, { createContext, useState, useEffect, useMemo } from "react";
import axios from "axios";

export const IncomeContext = createContext();

export const IncomeProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/incomes";

  // 🧩 Fetch all income records from backend
  const fetchIncomes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setIncomes(res.data);
    } catch (err) {
      console.error("❌ Error fetching incomes:", err);
    } finally {
      setLoading(false);
    }
  };

  // ➕ Add new income
  const addIncome = async (incomeData) => {
    try {
      const res = await axios.post(API_URL, incomeData);
      setIncomes((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error("❌ Error adding income:", err);
    }
  };

  // ✏️ Edit income
  const editIncome = async (id, updatedData) => {
    try {
      const res = await axios.put(`${API_URL}/${id}`, updatedData);
      setIncomes((prev) =>
        prev.map((i) => (i._id === id ? res.data : i))
      );
    } catch (err) {
      console.error("❌ Error editing income:", err);
    }
  };

  // 🗑️ Delete income
  const deleteIncome = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setIncomes((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("❌ Error deleting income:", err);
    }
  };

  // ⚙️ Compute total income and categories
  const totalIncome = useMemo(
    () => incomes.reduce((sum, i) => sum + parseFloat(i.cost || 0), 0),
    [incomes]
  );

  const categoryTotals = useMemo(() => {
    const totals = {};
    incomes.forEach((i) => {
      const cat = i.category || "Other";
      totals[cat] = (totals[cat] || 0) + parseFloat(i.cost || 0);
    });
    return totals;
  }, [incomes]);

  // Load incomes once when app starts
  useEffect(() => {
    fetchIncomes();
  }, []);

  return (
    <IncomeContext.Provider
      value={{
        incomes,
        totalIncome,
        categoryTotals,
        loading,
        fetchIncomes,
        addIncome,
        editIncome,
        deleteIncome,
      }}
    >
      {children}
    </IncomeContext.Provider>
  );
};
