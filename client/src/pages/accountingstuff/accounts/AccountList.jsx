import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Eye } from "react-feather";
import styles from "../../../styles/accountant/accounts.module.css";

// 🧩 API imports
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../../../api/accountsApi";

import AccountCreate from "./AccountCreate";
import AccountEdit from "./AccountEdit";
import AccountShow from "./AccountShow";

export default function AccountList() {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Load accounts from DB
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const data = await getAccounts();
        setAccounts(data);
      } catch (err) {
        console.error("❌ Failed to fetch accounts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  // 🧩 Add new account
  const handleSave = async (newAccount) => {
    try {
      const created = await createAccount(newAccount);
      setAccounts((prev) => [...prev, created]);
      setShowCreate(false);
    } catch (err) {
      console.error("❌ Error creating account:", err);
    }
  };

  // 🧩 Update account
  const handleUpdate = async (updatedAccount) => {
    try {
      const updated = await updateAccount(updatedAccount._id, updatedAccount);
      setAccounts((prev) =>
        prev.map((a) => (a._id === updated._id ? updated : a))
      );
      setShowEdit(false);
    } catch (err) {
      console.error("❌ Error updating account:", err);
    }
  };

  // 🧩 Delete account
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this account?")) return;
    try {
      await deleteAccount(id);
      setAccounts((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      console.error("❌ Error deleting account:", err);
    }
  };

  // 💰 Totals
  const totals = accounts.reduce(
    (acc, a) => {
      acc[a.type] += parseFloat(a.balance) || 0;
      return acc;
    },
    { Asset: 0, Liability: 0, Equity: 0 }
  );

  const totalAssets = totals.Asset;
  const totalLiabilities = totals.Liability;
  const netWorth = totalAssets - totalLiabilities;

  const formatUSD = (n) =>
    Number(n || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });

  return (
    <div className={styles.accountsPage}>
      <div className={styles.accountsHeader}>
        <h2>Accounts Summary</h2>
        <button className={styles.addBtn} onClick={() => setShowCreate(true)}>
          <Plus size={16} /> Add Account
        </button>
      </div>

      {/* Summary */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <h4>Assets</h4>
          <p className={styles.green}>{formatUSD(totalAssets)}</p>
        </div>
        <div className={styles.summaryCard}>
          <h4>Liabilities</h4>
          <p className={styles.red}>{formatUSD(totalLiabilities)}</p>
        </div>
        <div className={styles.summaryCard}>
          <h4>Net Worth</h4>
          <p className={netWorth >= 0 ? styles.green : styles.red}>
            {formatUSD(netWorth)}
          </p>
        </div>
      </div>

      {/* Table */}
      <table className={styles.accountsTable}>
        <thead>
          <tr>
            <th>Account</th>
            <th>Type</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                Loading accounts...
              </td>
            </tr>
          ) : accounts.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                No accounts found
              </td>
            </tr>
          ) : (
            accounts.map((a) => (
              <tr key={a._id}>
                <td>{a.account}</td>
                <td>{a.type}</td>
                <td>{formatUSD(a.balance)}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.viewBtn}
                    onClick={() => {
                      setSelectedAccount(a);
                      setShowView(true);
                    }}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    className={styles.editBtn}
                    onClick={() => {
                      setSelectedAccount(a);
                      setShowEdit(true);
                    }}
                  >
                    <Edit2 size={15} />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(a._id)}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Modals */}
      {showCreate && (
        <AccountCreate onSave={handleSave} onClose={() => setShowCreate(false)} />
      )}
      {showEdit && selectedAccount && (
        <AccountEdit
          account={selectedAccount}
          onSave={handleUpdate}
          onClose={() => setShowEdit(false)}
        />
      )}
      {showView && selectedAccount && (
        <AccountShow
          account={selectedAccount}
          onClose={() => setShowView(false)}
        />
      )}
    </div>
  );
}
