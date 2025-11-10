import React, { useState, useEffect } from "react";
import {
  User,
  Settings as Gear,
  Database,
  Save,
  UploadCloud,
  Download,
  Moon,
  Sun,
} from "react-feather";
import Sidebar from "../../components/accountantpartials/Sidebar";
import "../../styles/accountant/settings.css";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "USD ($)");
  const [dateFormat, setDateFormat] = useState(localStorage.getItem("dateFormat") || "DD/MM/YYYY");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleBackup = () => {
    const backupData = {
      transactions: JSON.parse(localStorage.getItem("transactions") || "[]"),
      vehicles: JSON.parse(localStorage.getItem("vehicles") || "[]"),
      expenses: JSON.parse(localStorage.getItem("expenses") || "[]"),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "accounting_backup.json";
    link.click();
  };

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
        alert("✅ Backup restored successfully!");
      } catch {
        alert("❌ Invalid file format!");
      }
    };
    reader.readAsText(file);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("currency", currency);
    localStorage.setItem("dateFormat", dateFormat);
    localStorage.setItem("theme", theme);
    alert("✅ Preferences saved successfully!");
  };

  return (
    <div className="settings-page">
      <Sidebar />

      <div className="settings-container">
        <header className="settings-header">
          <h1>Settings</h1>
          <p className="subtitle">Manage your profile, preferences, and data backups.</p>
        </header>

        {/* Tabs */}
        <div className="settings-tabs">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            <User size={16} /> Profile
          </button>
          <button className={activeTab === "preferences" ? "active" : ""} onClick={() => setActiveTab("preferences")}>
            <Gear size={16} /> Preferences
          </button>
          <button className={activeTab === "backup" ? "active" : ""} onClick={() => setActiveTab("backup")}>
            <Database size={16} /> Backup
          </button>
        </div>

        {/* Profile */}
        {activeTab === "profile" && (
          <section className="settings-section fade-in">
            <h2>Profile Information</h2>
            <form className="settings-form">
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="Enter your full name" />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input type="email" placeholder="Enter your email address" />
              </div>
              <div className="form-group">
                <label>Change Password</label>
                <input type="password" placeholder="New password" />
              </div>
              <button type="submit" className="primary-btn">
                <Save size={16} /> Save Changes
              </button>
            </form>
          </section>
        )}

        {/* Preferences */}
        {activeTab === "preferences" && (
          <section className="settings-section fade-in">
            <h2>System Preferences</h2>
            <form className="settings-form">
              <div className="form-group">
                <label>Default Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>LBP (ل.ل)</option>
                  <option>AED (د.إ)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Date Format</label>
                <select value={dateFormat} onChange={(e) => setDateFormat(e.target.value)}>
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>

              <div className="form-group">
                <label>Theme</label>
                <div className="theme-options">
                  <button
                    type="button"
                    className={`theme-choice ${theme === "light" ? "selected" : ""}`}
                    onClick={() => setTheme("light")}
                  >
                    <Sun size={16} /> Light
                  </button>
                  <button
                    type="button"
                    className={`theme-choice ${theme === "dark" ? "selected" : ""}`}
                    onClick={() => setTheme("dark")}
                  >
                    <Moon size={16} /> Dark
                  </button>
                </div>
              </div>

              <button type="button" onClick={handleSavePreferences} className="primary-btn">
                <Save size={16} /> Save Preferences
              </button>
            </form>
          </section>
        )}

        {/* Backup */}
        {activeTab === "backup" && (
          <section className="settings-section fade-in">
            <h2>Backup & Restore</h2>
            <p className="info-text">
              Download your accounting data or restore from a previous backup file.
            </p>

            <div className="backup-actions">
              <button onClick={handleBackup} className="primary-btn">
                <Download size={16} /> Download Backup
              </button>

              <label className="upload-btn">
                <UploadCloud size={16} /> Upload Backup
                <input type="file" accept=".json" onChange={handleRestore} hidden />
              </label>
            </div>

            <p className="backup-warning">
              ⚠ Restoring a backup will overwrite your current local data.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
