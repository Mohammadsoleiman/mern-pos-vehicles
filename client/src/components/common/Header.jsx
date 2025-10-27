import React, { useContext } from "react";
import { ClerkAuthContext } from "../../context/clerk/ClerkAuthContext";
import "../../styles/clerk/ui.css";

export default function Header() {
  const { clerk, logout } = useContext(ClerkAuthContext);

  return (
    <header className="clerk-header">
      <h2>Vehicle POS System</h2>
      {clerk && (
        <div className="user-info">
          <span>{clerk.name}</span>
          <button className="clerk-btn danger" onClick={logout}>Logout</button>
        </div>
      )}
    </header>
  );
}
