import React from "react";
import "../../styles/accountant/dashboard.css";

export default function StatCard({ title, value, icon, onClick }) {
  return (
    <div className="stat-card" onClick={onClick} style={{ cursor: "pointer" }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
}
