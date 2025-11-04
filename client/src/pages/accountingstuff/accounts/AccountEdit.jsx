import React, { useState } from "react";
import styles from "../../../styles/accountant/accounts.module.css";
import { updateAccount } from "../../../api/accountsApi";

export default function AccountEdit({ account, onSave, onClose }) {
  const [formData, setFormData] = useState({
    _id: account._id,
    account: account.account,
    type: account.type,
    balance: account.balance,
  });
  const [saving, setSaving] = useState(false);

  // 🧩 Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🧩 Submit updated account to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateAccount(formData._id, formData);
      onSave(updated); // ✅ updates parent list
      onClose();
    } catch (err) {
      console.error("❌ Error updating account:", err);
      alert("Failed to update account. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Edit Account</h3>
        <form onSubmit={handleSubmit} className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Account</label>
            <input
              name="account"
              value={formData.account}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Type</label>
            <select
              name="type"
              value={formData.type}
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
              value={formData.balance}
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
              {saving ? "Saving..." : "Update"}
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
