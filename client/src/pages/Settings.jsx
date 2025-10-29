// client/src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/settings.css"; // يمكنك إنشاؤه لاحقًا

export default function Settings() {
  const { user, logout } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    dashboardName: "Admin Panel",
    layout: "grid",
    theme: "light",
    profilePic: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        profilePic: user.profilePic || "",
      }));
    }

    // استعادة الإعدادات من localStorage
    const savedSettings = JSON.parse(localStorage.getItem("settings"));
    if (savedSettings) {
      setFormData((prev) => ({ ...prev, ...savedSettings }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profilePic: imageUrl }));
    }
  };

  const handleSave = () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // حفظ الإعدادات محليًا
    localStorage.setItem("settings", JSON.stringify(formData));

    // هنا لاحقًا نربطها مع API لتحديث المستخدم في قاعدة البيانات
    alert("✅ Settings updated successfully!");
  };

  return (
    <div className="settings-page">
      <h1>⚙️ Admin Profile & Preferences</h1>

      <div className="settings-container">
        {/* Profile Info Section */}
        <section className="settings-section">
          <h2>👤 Profile Information</h2>
          <div className="profile-pic">
            <img
              src={formData.profilePic || "https://via.placeholder.com/100"}
              alt="Profile"
            />
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          <label>
            Full Name
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Email Address
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </label>

          <label>
            New Password
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </label>
        </section>

        {/* Dashboard Settings Section */}
        <section className="settings-section">
          <h2>🧭 Dashboard Settings</h2>

          <label>
            Dashboard Name
            <input
              type="text"
              name="dashboardName"
              value={formData.dashboardName}
              onChange={handleChange}
            />
          </label>

          <label>
            Layout Style
            <select name="layout" value={formData.layout} onChange={handleChange}>
              <option value="grid">Grid View</option>
              <option value="list">List View</option>
            </select>
          </label>

          <label>
            Theme Mode
            <select name="theme" value={formData.theme} onChange={handleChange}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>
        </section>

        <div className="settings-actions">
          <button className="btn-save" onClick={handleSave}>
            💾 Save Changes
          </button>
          <button className="btn-logout" onClick={logout}>
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
}
    