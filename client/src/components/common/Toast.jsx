import React from "react";
import "../../styles/clerk/ui.css";

export default function Toast({ type="success", message, onClose }) {
  return (
    <div className={`clerk-toast ${type}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
}
