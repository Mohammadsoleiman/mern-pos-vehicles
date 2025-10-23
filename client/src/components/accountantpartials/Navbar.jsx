import React from "react";

// ✅ Correct CSS path
import "../../styles/accountant/dashboard.css";

export default function Navbar() {
  return (
    <header className="navbar">
      <h2>Accountant Dashboard</h2>
      <div className="navbar-right">
        <span>Welcome, User</span>
        <button className="btn-logout">Logout</button>
      </div>
    </header>
  );
}


