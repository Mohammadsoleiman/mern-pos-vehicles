// src/pages/clerk/customers/CustomerView.jsx
import React from "react";
import { X, Mail, Phone, MapPin } from "lucide-react";

export default function CustomerView({ customer, onClose }) {
  if (!customer) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Customer Details</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="modal-body">
          <h3>{customer.name}</h3>
          <p>
            <Mail size={16} /> {customer.email}
          </p>
          {customer.phone && (
            <p>
              <Phone size={16} /> {customer.phone}
            </p>
          )}
          {customer.address && (
            <p>
              <MapPin size={16} /> {customer.address}
            </p>
          )}
          <hr />
          <p>
            <strong>Total Purchases:</strong>{" "}
            {customer.totalPurchases || 0}
          </p>
          <p>
            <strong>Total Spent:</strong> $
            {customer.totalSpent?.toLocaleString() || 0}
          </p>
        </div>
      </div>
    </div>
  );
}
