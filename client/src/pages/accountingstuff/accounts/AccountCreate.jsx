import React, { useState } from "react";
import styles from "../../../styles/accountant/accounts.module.css";
import { createAccount } from "../../../api/accountsApi";

export default function AccountCreate({ onSave, onClose }) {
  const [form, setForm] = useState({
    account: "",
    type: "Asset",
    balance: "",
  });
  const [saving, setSaving] = useState(false);

  // 🧩 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🧩 Submit to backend (MongoDB)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const newAccount = await createAccount(form);
      onSave(newAccount); // updates list in parent (AccountList)
      onClose();          // close modal
    } catch (err) {
      console.error("❌ Error creating account:", err);
      alert("Failed to create account. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Add New Account</h3>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Account Name</label>
            <input
              name="account"
              value={form.account}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option>Asset</option>
              <option>Liability</option>
              <option>Equity</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Balance ($)</label>
            <input
              name="balance"
              type="number"
              value={form.balance}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
