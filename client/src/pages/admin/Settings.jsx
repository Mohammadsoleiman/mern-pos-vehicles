import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useSettings } from "../../context/SettingsContext";
import "../../styles/settings.css";

export default function Settings() {
  const { user } = useAuth();
  const { settings, updateSettings } = useSettings();
  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateSettings(formData);
    alert("✅ Settings saved successfully!");
  };

  return (
    <div className={`settingsPage ${settings.theme === "dark" ? "themeDark" : "themeLight"}`}>
      <h1>⚙️ Settings</h1>

      <div className="settingsContainer">

        <section className="settingsSection">
          <h2>👤 Profile</h2>

          <div className="profilePic">
            <img src={formData.profilePic || "https://via.placeholder.com/100"} alt="Profile" />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <label>Name</label>
          <input type="text" value={user.name} disabled />

          <label>Email</label>
          <input type="text" value={user.email} disabled />
        </section>

        <section className="settingsSection">
          <h2>🎨 Dashboard Appearance</h2>

          <label>Dashboard Title</label>
          <input name="dashboardName" value={formData.dashboardName} onChange={handleChange} />

          <label>Choose Layout</label>
          <select name="layout" value={formData.layout} onChange={handleChange}>
            <option value="list">List View (Table)</option>
            <option value="grid">Grid View (Cards)</option>
          </select>

          <label>Theme</label>
          <select name="theme" value={formData.theme} onChange={handleChange}>
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </section>

        <button className="btnSave" onClick={handleSave}>💾 Save Changes</button>
      </div>
    </div>
  );
}
