// src/pages/clerk/customers/CustomerList.jsx
import React, { useState } from "react";
import { Users, Plus, Edit, Trash2, Eye, Phone, MapPin } from "lucide-react";

export default function CustomerList({
  customers,
  onAdd,
  onEdit,
  onView,
  onDelete,
}) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="customers-container">
      <div className="customers-header">
        <div className="customers-header-content">
          <h1>
            <Users className="header-icon" size={32} /> Customers
          </h1>
          <p>Manage your customer database</p>
        </div>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search customers..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="add-customer-btn" onClick={onAdd}>
            <Plus size={20} /> Add Customer
          </button>
        </div>
      </div>

      <div className="customers-grid">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <div className="customer-card" key={c._id}>
              <div className="customer-card-header">
                <div className="customer-avatar">
                  {c.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="customer-name">{c.name}</h3>
                  <p className="customer-email">{c.email}</p>
                </div>
              </div>

              <div className="customer-details">
                {c.phone && (
                  <div className="customer-detail-item">
                    <Phone size={16} />
                    <span>{c.phone}</span>
                  </div>
                )}
                {c.address && (
                  <div className="customer-detail-item">
                    <MapPin size={16} />
                    <span>{c.address}</span>
                  </div>
                )}
              </div>

              <div className="customer-actions">
                <button className="btn-view" onClick={() => onView(c)}>
                  <Eye size={16} /> View
                </button>
                <button className="btn-edit" onClick={() => onEdit(c)}>
                  <Edit size={16} /> Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => onDelete(c._id)}
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Users size={64} />
            <h3>No customers found</h3>
          </div>
        )}
      </div>
    </div>
  );
}
