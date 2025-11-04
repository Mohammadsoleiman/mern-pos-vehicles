import React, { createContext, useEffect, useState, useCallback } from "react";
import axiosClient from "../../api/axiosClient";

export const TransactionSummaryContext = createContext();

export const TransactionSummaryProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTransactionsData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [{ data: summaryData }, { data: historyData }] = await Promise.all([
        axiosClient.get("/transactions/summary"),
        axiosClient.get("/transactions/history"),
      ]);
      setSummary(summaryData || { totalIncome: 0, totalExpenses: 0, netBalance: 0 });
      // Ensure newest first just like your table sorting
      const sorted = Array.isArray(historyData)
        ? [...historyData].sort((a, b) => new Date(b.date) - new Date(a.date))
        : [];
      setTransactions(sorted);
    } catch (e) {
      console.error("❌ Error fetching transaction summary:", e?.message || e);
      setError("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

  return (
    <TransactionSummaryContext.Provider
      value={{ transactions, summary, loading, error, refresh: fetchTransactionsData }}
    >
      {children}
    </TransactionSummaryContext.Provider>
  );
};
