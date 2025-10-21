import React, { createContext, useState } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([
    { id: "T001", date: "2025-10-01", type: "Sale", amount: 1200 },
    { id: "T002", date: "2025-04-05", type: "Refund", amount: -200 },
    { id: "T003", date: "2025-02-07", type: "Sale", amount: 800 },
    { id: "T004", date: "2025-10-10", type: "Expense", amount: -350 },
    { id: "T005", date: "2024-12-12", type: "Sale", amount: 1500 },
  ]);

  // Add a new transaction
  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  // Edit existing transaction by ID
  const editTransaction = (id, updatedTransaction) => {
    setTransactions(
      transactions.map((tx) => (tx.id === id ? updatedTransaction : tx))
    );
  };

  // Delete transaction by ID
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  // Calculate total income (positive amounts)
  const totalIncome = transactions
    .filter((tx) => tx.amount > 0)
    .reduce((acc, tx) => acc + tx.amount, 0);

  // Calculate total expenses (negative amounts)
  const totalExpenses = transactions
    .filter((tx) => tx.amount < 0)
    .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction,
        editTransaction,
        deleteTransaction,
        totalIncome,
        totalExpenses,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
