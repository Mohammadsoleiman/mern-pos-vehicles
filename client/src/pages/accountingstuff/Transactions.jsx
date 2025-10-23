import React, { useContext, useState, useMemo } from "react";
import { TransactionContext } from "../../context/ACCOUNTANT/TransactionContext.jsx";
import "../../styles/accountant/transactions.css";

export default function Transactions() {
  const { transactions, addTransaction, deleteTransaction, totalIncome, totalExpenses } = useContext(TransactionContext);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: "Sale",
    amount: "",
    category: "",
    paymentMethod: "",
    description: "",
    reference: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTransaction = {
      ...formData,
      id: "T" + Date.now(),
      amount: formData.type === "Expense" || formData.type === "Refund" 
        ? -Math.abs(parseFloat(formData.amount))
        : parseFloat(formData.amount)
    };
    addTransaction(newTransaction);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: "Sale",
      amount: "",
      category: "",
      paymentMethod: "",
      description: "",
      reference: ""
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      // Type filter
      if (filterType !== "all") {
        if (filterType === "income" && tx.amount <= 0) return false;
        if (filterType === "expense" && tx.amount >= 0) return false;
        if (filterType !== "income" && filterType !== "expense" && tx.type !== filterType) return false;
      }
      
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesId = tx.id.toLowerCase().includes(search);
        const matchesType = tx.type.toLowerCase().includes(search);
        const matchesDescription = tx.description?.toLowerCase().includes(search);
        const matchesCategory = tx.category?.toLowerCase().includes(search);
        if (!matchesId && !matchesType && !matchesDescription && !matchesCategory) return false;
      }
      
      // Date filter
      if (dateFilter.start && new Date(tx.date) < new Date(dateFilter.start)) return false;
      if (dateFilter.end && new Date(tx.date) > new Date(dateFilter.end)) return false;
      
      return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, filterType, searchTerm, dateFilter]);

  // Calculate filtered totals
  const filteredIncome = filteredTransactions
    .filter(tx => tx.amount > 0)
    .reduce((sum, tx) => sum + tx.amount, 0);
  
  const filteredExpenses = filteredTransactions
    .filter(tx => tx.amount < 0)
    .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  
  const netBalance = filteredIncome - filteredExpenses;

  // Get transaction counts by type
  const salesCount = transactions.filter(tx => tx.type === "Sale").length;
  const expensesCount = transactions.filter(tx => tx.type === "Expense").length;
  const refundsCount = transactions.filter(tx => tx.type === "Refund").length;

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h1>💰 Transactions</h1>
          <p>Track all income, expenses, and financial activities</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add Transaction"}
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="transaction-stats">
        <div className="stat-card-transaction income">
          <div className="stat-icon">📈</div>
          <div className="stat-details">
            <h3>Total Income</h3>
            <p className="stat-value">${totalIncome.toLocaleString()}</p>
            <span className="stat-label">{salesCount} Sales</span>
          </div>
        </div>
        
        <div className="stat-card-transaction expense">
          <div className="stat-icon">📉</div>
          <div className="stat-details">
            <h3>Total Expenses</h3>
            <p className="stat-value">${totalExpenses.toLocaleString()}</p>
            <span className="stat-label">{expensesCount} Expenses</span>
          </div>
        </div>
        
        <div className="stat-card-transaction balance">
          <div className="stat-icon">💵</div>
          <div className="stat-details">
            <h3>Net Balance</h3>
            <p className="stat-value">${(totalIncome - totalExpenses).toLocaleString()}</p>
            <span className="stat-label">Profit/Loss</span>
          </div>
        </div>
        
        <div className="stat-card-transaction total">
          <div className="stat-icon">📊</div>
          <div className="stat-details">
            <h3>Total Transactions</h3>
            <p className="stat-value">{transactions.length}</p>
            <span className="stat-label">{refundsCount} Refunds</span>
          </div>
        </div>
      </div>

      {/* Add Transaction Form */}
      {showForm && (
        <div className="transaction-form-card">
          <h3>Add New Transaction</h3>
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Type *</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="Sale">Sale (Income)</option>
                  <option value="Expense">Expense</option>
                  <option value="Refund">Refund</option>
                  <option value="Payment">Payment Received</option>
                  <option value="Purchase">Purchase</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="">Select Category</option>
                  <option value="Vehicle Sales">Vehicle Sales</option>
                  <option value="Service">Service</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Fuel">Fuel</option>
                  <option value="Insurance">Insurance</option>
                  <option value="Salary">Salary</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Payment Method</label>
                <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                  <option value="">Select Method</option>
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Check">Check</option>
                  <option value="Mobile Payment">Mobile Payment</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Reference Number</label>
                <input
                  type="text"
                  name="reference"
                  value={formData.reference}
                  onChange={handleChange}
                  placeholder="INV-001, REF-123, etc."
                />
              </div>
              
              <div className="form-group full-width">
                <label>Description</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add transaction details..."
                />
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">Add Transaction</button>
              <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-group">
          <label>🔍 Search</label>
          <input
            type="text"
            placeholder="Search by ID, type, category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-group">
          <label>📋 Filter by Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
            <option value="all">All Transactions</option>
            <option value="income">Income Only</option>
            <option value="expense">Expenses Only</option>
            <option value="Sale">Sales</option>
            <option value="Expense">Expenses</option>
            <option value="Refund">Refunds</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>📅 Start Date</label>
          <input
            type="date"
            value={dateFilter.start}
            onChange={(e) => setDateFilter({...dateFilter, start: e.target.value})}
            className="date-input"
          />
        </div>
        
        <div className="filter-group">
          <label>📅 End Date</label>
          <input
            type="date"
            value={dateFilter.end}
            onChange={(e) => setDateFilter({...dateFilter, end: e.target.value})}
            className="date-input"
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
            Clear Filters
          </button>
        )}
      </div>

      {/* Filtered Summary */}
      {(filterType !== "all" || searchTerm || dateFilter.start || dateFilter.end) && (
        <div className="filtered-summary">
          <h4>📊 Filtered Results</h4>
          <div className="filtered-stats">
            <div className="filtered-stat">
              <span className="label">Income:</span>
              <span className="value income">${filteredIncome.toLocaleString()}</span>
            </div>
            <div className="filtered-stat">
              <span className="label">Expenses:</span>
              <span className="value expense">${filteredExpenses.toLocaleString()}</span>
            </div>
            <div className="filtered-stat">
              <span className="label">Net:</span>
              <span className={`value ${netBalance >= 0 ? 'income' : 'expense'}`}>
                ${netBalance.toLocaleString()}
              </span>
            </div>
            <div className="filtered-stat">
              <span className="label">Count:</span>
              <span className="value">{filteredTransactions.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="transactions-table-container">
        <h3>Transaction History</h3>
        {filteredTransactions.length === 0 ? (
          <p className="empty-state">
            {searchTerm || filterType !== "all" || dateFilter.start || dateFilter.end
              ? "No transactions match your filters."
              : "No transactions yet. Click 'Add Transaction' to get started."}
          </p>
        ) : (
          <div className="table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Payment Method</th>
                  <th>Reference</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td><span className="transaction-id">{tx.id}</span></td>
                    <td>{new Date(tx.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge-type type-${tx.type.toLowerCase()}`}>
                        {tx.type}
                      </span>
                    </td>
                    <td>{tx.category || <span className="text-muted">-</span>}</td>
                    <td>{tx.paymentMethod || <span className="text-muted">-</span>}</td>
                    <td>{tx.reference || <span className="text-muted">-</span>}</td>
                    <td className="description-cell">{tx.description || <span className="text-muted">-</span>}</td>
                    <td>
                      <span className={`amount ${tx.amount >= 0 ? 'positive' : 'negative'}`}>
                        {tx.amount >= 0 ? '+' : '-'}${Math.abs(tx.amount).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-delete"
                        onClick={() => {
                          if (window.confirm(`Delete transaction ${tx.id}?`)) {
                            deleteTransaction(tx.id);
                          }
                        }}
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