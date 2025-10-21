import React, { useState, useEffect } from "react";
import Sidebar from "../../components/accountantpartials/Sidebar";
import "../../styles/accountant/settings.css";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "USD ($)");
  const [dateFormat, setDateFormat] = useState(localStorage.getItem("dateFormat") || "DD/MM/YYYY");

  // Apply theme globally
  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Backup (download) JSON data
  const handleBackup = () => {
    const backupData = {
      transactions: JSON.parse(localStorage.getItem("transactions") || "[]"),
      vehicles: JSON.parse(localStorage.getItem("vehicles") || "[]"),
      expenses: JSON.parse(localStorage.getItem("expenses") || "[]"),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "accounting_backup.json";
    link.click();
  };

  // Restore uploaded JSON backup
  const handleRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        localStorage.setItem("transactions", JSON.stringify(data.transactions || []));
        localStorage.setItem("vehicles", JSON.stringify(data.vehicles || []));
        localStorage.setItem("expenses", JSON.stringify(data.expenses || []));
        alert("Backup restored successfully!");
      } catch (error) {
        alert("Invalid file format!");
      }
    };
    reader.readAsText(file);
  };

  // Save preferences
  const handleSavePreferences = () => {
    localStorage.setItem("currency", currency);
    localStorage.setItem("dateFormat", dateFormat);
    localStorage.setItem("theme", theme);
    alert("Preferences saved successfully!");
  };

  return (
    <div className="settings-page">
      <Sidebar />
      <div className="settings-content">
        <h2>Settings</h2>

        <div className="settings-tabs">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={activeTab === "preferences" ? "active" : ""}
            onClick={() => setActiveTab("preferences")}
          >
            System Preferences
          </button>
          <button
            className={activeTab === "backup" ? "active" : ""}
            onClick={() => setActiveTab("backup")}
          >
            Backup Data
          </button>
        </div>

        {activeTab === "profile" && (
          <div className="settings-section">
            <h3>Profile Settings</h3>
            <form className="settings-form">
              <label>
                Full Name:
                <input type="text" placeholder="Enter your name" />
              </label>
              <label>
                Email:
                <input type="email" placeholder="Enter your email" />
              </label>
              <label>
                Change Password:
                <input type="password" placeholder="New password" />
              </label>
              <button type="submit">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="settings-section">
            <h3>System Preferences</h3>
            <form className="settings-form">
              <label>
                Currency:
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>LBP (ل.ل)</option>
                </select>
              </label>

              <label>
                Date Format:
                <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                </select>
              </label>

              <label>
                Theme:
                <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>

              <button type="button" onClick={handleSavePreferences}>
                Save Preferences
              </button>
            </form>
          </div>
        )}

        {activeTab === "backup" && (
          <div className="settings-section">
            <h3>Backup & Restore Data</h3>
            <p>Download or restore your financial data from a backup file.</p>

            <div className="backup-actions">
              <button onClick={handleBackup}>Download Backup</button>

              <label className="upload-btn">
                Upload Backup
                <input type="file" accept=".json" onChange={handleRestore} hidden />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
