import React, { useContext, useState, useMemo } from "react";
import { TransactionContext } from "../../context/ACCOUNTANT/TransactionContext.jsx";
import "../../styles/accountant/transactions.css";

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction, totalIncome, totalExpenses } =
    useContext(TransactionContext);

  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "Income",
    category: "",
    amount: "",
    paymentMethod: "",
    description: "",
    reference: "",
  });

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      ...formData,
      id: "T" + Date.now(),
      amount:
        formData.type === "Expense"
          ? -Math.abs(parseFloat(formData.amount))
          : parseFloat(formData.amount),
    };
    addTransaction(newTransaction);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split("T")[0],
      type: "Income",
      category: "",
      amount: "",
      paymentMethod: "",
      description: "",
      reference: "",
    });
    setShowForm(false);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Filter & search
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((tx) => {
        if (filterType !== "all") {
          if (filterType === "income" && tx.amount <= 0) return false;
          if (filterType === "expense" && tx.amount >= 0) return false;
        }
        if (searchTerm) {
          const search = searchTerm.toLowerCase();
          if (
            !(
              tx.id.toLowerCase().includes(search) ||
              tx.type.toLowerCase().includes(search) ||
              tx.description?.toLowerCase().includes(search) ||
              tx.category?.toLowerCase().includes(search)
            )
          )
            return false;
        }
        if (dateFilter.start && new Date(tx.date) < new Date(dateFilter.start)) return false;
        if (dateFilter.end && new Date(tx.date) > new Date(dateFilter.end)) return false;
        return true;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filterType, searchTerm, dateFilter]);

  // Totals
  const filteredIncome = filteredTransactions
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  const filteredExpenses = filteredTransactions
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  const netBalance = filteredIncome - filteredExpenses;

  // Print
  const handlePrint = () => window.print();

  return (
    <div className="transactions-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>💼 Financial Overview</h1>
          <p>Monitor Income, Expenses, and Purchases in your POS system</p>
        </div>
        <div className="header-buttons">
          <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? "✕ Cancel" : "+ Add Transaction"}
          </button>
          <button className="btn-secondary" onClick={handlePrint}>
            🖨️ Print Overview
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="transaction-stats">
        <div className="stat-card-transaction income">
          <h3>Total Income</h3>
          <p className="stat-value">${totalIncome.toLocaleString()}</p>
        </div>
        <div className="stat-card-transaction expense">
          <h3>Total Expenses</h3>
          <p className="stat-value">${totalExpenses.toLocaleString()}</p>
        </div>
        <div className="stat-card-transaction balance">
          <h3>Net Balance</h3>
          <p className="stat-value">${Math.abs(netBalance).toLocaleString()}</p>
          <span className={netBalance >= 0 ? "positive" : "negative"}>
            {netBalance >= 0 ? "Profit" : "Loss"}
          </span>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="transaction-form-card">
          <h3>Add Transaction</h3>
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                </select>
              </div>
              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select Category</option>
                  <optgroup label="Income">
                    <option value="Vehicle Sales">Vehicle Sales</option>
                    <option value="Service & Maintenance">Service & Maintenance</option>
                    <option value="Other Services">Other Services</option>
                    <option value="Taxes Income">Taxes / Delivery</option>
                  </optgroup>
                  <optgroup label="Expenses">
                    <option value="Employee Salary">Employee Salary</option>
                    <option value="Vehicle Costs">Vehicle Parts & Accessories</option>
                    <option value="Office & Admin">Office & Admin</option>
                    <option value="Miscellaneous">Insurance / Misc</option>
                  </optgroup>
                </select>
              </div>
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                </select>
              </div>
              <div className="form-group">
                <label>Reference</label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="INV-001 / REF-1001"
                />
              </div>
              <div className="form-group full-width">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Short note"
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Save
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search by ID, type, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Filter by Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
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
            onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
          />
        </div>

        <div className="filter-group">
          <label>End Date</label>
          <input
            type="date"
            value={dateFilter.end}
            onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
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

      {/* Transactions Table */}
      <div className="transactions-table-container">
        <h3>All Transactions</h3>
        {filteredTransactions.length === 0 ? (
          <p className="empty-state">No transactions found.</p>
        ) : (
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Payment</th>
                  <th>Reference</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td>{tx.id}</td>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>{tx.type}</td>
                    <td>{tx.category}</td>
                    <td>{tx.paymentMethod || "-"}</td>
                    <td>{tx.reference || "-"}</td>
                    <td>{tx.description || "-"}</td>
                    <td className={tx.amount >= 0 ? "positive" : "negative"}>
                      {tx.amount >= 0 ? "+" : "-"}${Math.abs(tx.amount).toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn-delete"
                        onClick={() => window.confirm(`Delete ${tx.id}?`) && deleteTransaction(tx.id)}
                      >
                        🗑️
                      </button>
                    </td>
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
