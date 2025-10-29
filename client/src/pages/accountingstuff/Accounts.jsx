import React, { useContext, useState, useEffect } from "react";
import "../../styles/accountant/accounts.css";
import { TransactionContext } from "../../context/ACCOUNTANT/TransactionContext.jsx";
import { VehicleContext } from "../../context/ACCOUNTANT/VehicleContext.jsx";
import { ExpenseContext } from "../../context/ACCOUNTANT/ExpenseContext.jsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

export default function Accounts() {
  const { totalIncome, totalExpenses } = useContext(TransactionContext);
  const { totalValue } = useContext(VehicleContext);
  const { expenses } = useContext(ExpenseContext);

  // 💵 Format numbers as USD
  const formatUSD = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value || 0);

  // Load or fallback
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem("accounts");
    if (saved) return JSON.parse(saved);
    return [
      { id: 1, account: "Main Bank Account", type: "Asset", balance: 52000 },
      { id: 2, account: "Accounts Payable", type: "Liability", balance: 7800 },
      { id: 3, account: "Owner’s Equity", type: "Equity", balance: 9500 },
    ];
  });

  const [editIndex, setEditIndex] = useState(null);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);

  // Totals
  const totals = accounts.reduce(
    (acc, curr) => {
      acc[curr.type] += parseFloat(curr.balance) || 0;
      return acc;
    },
    { Asset: 0, Liability: 0, Equity: 0 }
  );

  const totalAssets = totals.Asset + totalValue;
  const totalLiabilities = totals.Liability + totalExpenses;
  const netWorth = totalAssets - totalLiabilities;

  const chartData = [
    { name: "Assets", value: totalAssets },
    { name: "Liabilities", value: totalLiabilities },
    { name: "Equity", value: totals.Equity },
  ];

  // 🔧 Functions
  const addAccount = () => {
    const newAcc = {
      id: Date.now(),
      account: "New Account",
      type: "Asset",
      balance: 0,
    };
    setAccounts([...accounts, newAcc]);
    setEditIndex(accounts.length); // immediately edit new row
  };

  const deleteAccount = (id) => {
    setAccounts(accounts.filter((a) => a.id !== id));
  };

  const saveEdit = (index, updated) => {
    const newList = [...accounts];
    newList[index] = updated;
    setAccounts(newList);
    setEditIndex(null);
  };

  return (
    <div className="accounts-page">
      {/* Header */}
      <div className="accounts-header">
        <h1>Accounts Summary</h1>
        <p>View, edit, and manage your financial accounts in one place.</p>
      </div>

      {/* Summary Cards */}
      <div className="accounts-summary">
        <div className="summary-card">
          <h3>Total Assets</h3>
          <p className="value green">{formatUSD(totalAssets)}</p>
        </div>
        <div className="summary-card">
          <h3>Total Liabilities</h3>
          <p className="value red">{formatUSD(totalLiabilities)}</p>
        </div>
        <div className="summary-card">
          <h3>Net Worth</h3>
          <p className={`value ${netWorth >= 0 ? "green" : "red"}`}>
            {formatUSD(netWorth)}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="accounts-chart-section">
        <h2>Financial Breakdown</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(val) => `$${val / 1000}k`} />
            <Tooltip formatter={(val) => formatUSD(val)} />
            <Legend />
            <Bar dataKey="value" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="accounts-table-section">
        <h2>Account Balances</h2>
        <table className="accounts-table">
          <thead>
            <tr>
              <th>Account</th>
              <th>Type</th>
              <th>Balance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((acc, i) => (
              <tr key={acc.id}>
                {editIndex === i ? (
                  <>
                    <td>
                      <input
                        type="text"
                        value={acc.account}
                        onChange={(e) =>
                          setAccounts(
                            accounts.map((a, idx) =>
                              idx === i ? { ...a, account: e.target.value } : a
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={acc.type}
                        onChange={(e) =>
                          setAccounts(
                            accounts.map((a, idx) =>
                              idx === i ? { ...a, type: e.target.value } : a
                            )
                          )
                        }
                      >
                        <option>Asset</option>
                        <option>Liability</option>
                        <option>Equity</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={acc.balance}
                        onChange={(e) =>
                          setAccounts(
                            accounts.map((a, idx) =>
                              idx === i
                                ? { ...a, balance: parseFloat(e.target.value) || 0 }
                                : a
                            )
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="save-btn"
                        onClick={() => saveEdit(i, acc)}
                      >
                        💾 Save
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{acc.account}</td>
                    <td>{acc.type}</td>
                    <td>{formatUSD(acc.balance)}</td>
                    <td>
                      <button
                        className="edit-btn"
                        onClick={() => setEditIndex(i)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteAccount(acc.id)}
                      >
                        🗑️ Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}

            <tr className="total-row">
              <td><strong>Total Assets</strong></td>
              <td colSpan="2">{formatUSD(totals.Asset)}</td>
              <td></td>
            </tr>
            <tr className="total-row">
              <td><strong>Total Liabilities</strong></td>
              <td colSpan="2">{formatUSD(totals.Liability)}</td>
              <td></td>
            </tr>
            <tr className="total-row">
              <td><strong>Total Equity</strong></td>
              <td colSpan="2">{formatUSD(totals.Equity)}</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        <button className="add-btn" onClick={addAccount}>
          ➕ Add Account
        </button>
      </div>
    </div>
  );
}
