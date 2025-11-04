import React from "react";
import styles from "../../../styles/accountant/accounts.module.css";

export default function AccountShow({ account, onClose }) {
  if (!account) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h3>Account Details</h3>

        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Account Name</label>
            <input
              value={account.account || "—"}
              readOnly
            />
          </div>

          <div className={styles.formGroup}>
            <label>Type</label>
            <input
              value={account.type || "—"}
              readOnly
            />
          </div>

          <div className={styles.formGroup}>
            <label>Balance</label>
            <input
              value={`$${Number(account.balance || 0).toLocaleString()}`}
              readOnly
            />
          </div>

          <div className={styles.formGroup}>
            <label>Created At</label>
            <input
              value={
                account.createdAt
                  ? new Date(account.createdAt).toLocaleDateString()
                  : "—"
              }
              readOnly
            />
          </div>

          <div className={styles.formGroup}>
            <label>Last Updated</label>
            <input
              value={
                account.updatedAt
                  ? new Date(account.updatedAt).toLocaleDateString()
                  : "—"
              }
              readOnly
            />
          </div>
        </div>

        <div className={styles.modalActions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
