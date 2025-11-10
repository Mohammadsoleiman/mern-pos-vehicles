import React, { createContext, useState } from "react";

export const ExpenseContext = createContext();

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([
    { id: "E001", date: "2025-10-01", category: "Office Rent", amount: 1000 },
    { id: "E002", date: "2025-10-03", category: "Utilities", amount: 300 },
    { id: "E003", date: "2025-10-05", category: "Supplies", amount: 150 },
    { id: "E004", date: "2025-10-08", category: "Maintenance", amount: 400 },
  ]);

  // ✅ Add a new expense
  const addExpense = (expense) => {
    setExpenses((prev) => [...prev, expense]);
  };

  // ✅ Edit existing expense by ID
  const editExpense = (id, updatedExpense) => {
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e))
    );
  };

  // ✅ Delete expense by ID
  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // ✅ Calculate total expenses
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  // ✅ Group by category for charts/reports
  const categoryTotals = expenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + e.amount;
    return acc;
  }, {});

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        editExpense,
        deleteExpense,
        totalExpenses,
        categoryTotals,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};
