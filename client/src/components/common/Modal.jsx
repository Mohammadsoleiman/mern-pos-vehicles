import React from "react";
import "../../styles/clerk/ui.css";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
    <div className="clerk-modal-overlay">
      <div className="clerk-modal">
        <div className="clerk-modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="clerk-modal-body">{children}</div>
      </div>
    </div>
  );
}
