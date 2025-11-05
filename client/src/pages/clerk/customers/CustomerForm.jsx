// src/pages/clerk/customers/CustomerForm.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CustomerForm({ onClose, onSubmit, editingCustomer }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  useEffect(() => {
    if (editingCustomer) setFormData(editingCustomer);
  }, [editingCustomer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingCustomer) {
      onSubmit(editingCustomer._id, formData);
    } else {
      onSubmit(formData);
    }

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{editingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="customer-form">
          {["name", "email", "phone", "address", "city", "state", "zipCode"].map(
            (field) => (
              <div className="form-group" key={field}>
                <label>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  required={["name", "email"].includes(field)}
                />
              </div>
            )
          )}

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {editingCustomer ? "Update Customer" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
