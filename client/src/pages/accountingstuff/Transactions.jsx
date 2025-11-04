import React, { useState, useEffect, useMemo } from "react";
import axiosClient from "../../api/axiosClient";
import "../../styles/accountant/transactions.css";

export default function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
  });
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [{ data: summaryData }, { data: historyData }] = await Promise.all([
          axiosClient.get("/transactions/summary"),
          axiosClient.get("/transactions/history"),
        ]);
        setSummary(summaryData);
        setTransactions(historyData);
      } catch (err) {
        console.error("❌ Error fetching data:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ---------------- FILTERS ----------------
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (filterType !== "all") {
          if (filterType === "income" && tx.amount <= 0) return false;
          if (filterType === "expense" && tx.amount >= 0) return false;
        }
        if (searchTerm) {
          const s = searchTerm.toLowerCase();
          if (
            !(
              tx.type.toLowerCase().includes(s) ||
              tx.category?.toLowerCase().includes(s) ||
              tx.description?.toLowerCase().includes(s) ||
              tx.source?.toLowerCase().includes(s)
            )
          )
            return false;
        }
        if (dateFilter.start && new Date(tx.date) < new Date(dateFilter.start))
          return false;
        if (dateFilter.end && new Date(tx.date) > new Date(dateFilter.end))
          return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filterType, searchTerm, dateFilter]);

  // ---------------- PRINT ----------------
  const handlePrint = () => window.print();

  // ---------------- UI ----------------
  return (
    <div className="transactions-page">
      {/* ---------- HEADER ---------- */}
      <div className="page-header">
        <div>
          <h1>💼 Financial Overview</h1>
          <p>Track all incomes, expenses, purchases, and payrolls in one place</p>
        </div>
        <div className="header-buttons">
          <button className="btn-secondary" onClick={handlePrint}>
            🖨️ Print Overview
          </button>
        </div>
      </div>

      {/* ---------- SUMMARY ---------- */}
      <div className="transaction-stats">
        <div className="stat-card-transaction income">
          <h3>Total Income</h3>
          <p className="stat-value">${summary.totalIncome.toLocaleString()}</p>
        </div>
        <div className="stat-card-transaction expense">
          <h3>Total Expenses</h3>
          <p className="stat-value">${summary.totalExpenses.toLocaleString()}</p>
        </div>
        <div className="stat-card-transaction balance">
          <h3>Net Balance</h3>
          <p className="stat-value">${summary.netBalance.toLocaleString()}</p>
          <span className={summary.netBalance >= 0 ? "positive" : "negative"}>
            {summary.netBalance >= 0 ? "Profit" : "Loss"}
          </span>
        </div>
      </div>

      {/* ---------- FILTERS ---------- */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by type, category, or source..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Filter by Type</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Start Date</label>
          <input
            type="date"
            value={dateFilter.start}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, start: e.target.value })
            }
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={dateFilter.end}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, end: e.target.value })
            }
          />
        </div>

        {(searchTerm || filterType !== "all" || dateFilter.start || dateFilter.end) && (
          <button
            className="btn-clear-filters"
            onClick={() => {
              setSearchTerm("");
              setFilterType("all");
              setDateFilter({ start: "", end: "" });
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* ---------- TRANSACTIONS TABLE ---------- */}
      <div className="transactions-table-container">
        <h3>All Transactions</h3>
        {loading ? (
          <p className="loading">Loading data...</p>
        ) : filteredTransactions.length === 0 ? (
          <p className="empty-state">No transactions found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Source</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.type}</td>
                    <td>{tx.category}</td>
                    <td>{tx.description}</td>
                    <td
                      className={tx.amount >= 0 ? "positive" : "negative"}
                    >
                      {tx.amount >= 0 ? "+" : "-"}$
                      {Math.abs(tx.amount).toLocaleString()}
                    </td>
                    <td>{tx.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
