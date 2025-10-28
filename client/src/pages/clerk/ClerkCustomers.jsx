// src/pages/clerk/ClerkCustomers.jsx
import React, { useContext, useState } from "react";
import { CustomerContext } from "../../context/clerk/CustomerContext";
import { Users, Mail, Phone, MapPin, Plus, X, Edit, Trash2 } from "lucide-react";
import "../../styles/clerk/ClerkCustomers.css";

export default function ClerkCustomers() {
  const { customers, addCustomer, updateCustomer, deleteCustomer, loading } = useContext(CustomerContext);
  const [formData, setFormData] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "",
    city: "",
    state: "",
    zipCode: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, formData);
    } else {
      addCustomer(formData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", address: "", city: "", state: "", zipCode: "" });
    setShowModal(false);
    setEditingCustomer(null);
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone || "",
      address: customer.address || "",
      city: customer.city || "",
      state: customer.state || "",
      zipCode: customer.zipCode || ""
    });
    setShowModal(true);
  };

  const handleDelete = (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomer(customerId);
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="customers-page">
      <div className="customers-container">
        {/* Header */}
        <div className="customers-header">
          <div className="customers-header-content">
            <h1>
              <Users className="header-icon" size={32} />
              Customers
            </h1>
            <p>Manage your customer database</p>
          </div>
          <div className="header-actions">
            <input
              type="text"
              placeholder="Search customers..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="add-customer-btn" onClick={() => setShowModal(true)}>
              <Plus size={20} />
              Add Customer
            </button>
          </div>
        </div>

        {/* Customers Grid */}
        <div className="customers-grid">
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <div className="customer-card" key={customer.id}>
                <div className="customer-card-header">
                  <div className="customer-avatar">
                    {customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="customer-main-info">
                    <h3 className="customer-name">{customer.name}</h3>
                    <p className="customer-email">{customer.email}</p>
                  </div>
                </div>

                <div className="customer-details">
                  {customer.phone && (
                    <div className="customer-detail-item">
                      <Phone size={16} />
                      <span>{customer.phone}</span>
                    </div>
                  )}
                  {customer.address && (
                    <div className="customer-detail-item">
                      <MapPin size={16} />
                      <span>{customer.address}</span>
                    </div>
                  )}
                </div>

                <div className="customer-stats">
                  <div className="stat-box">
                    <p className="stat-value">{customer.totalPurchases || 0}</p>
                    <p className="stat-label">Purchases</p>
                  </div>
                  <div className="stat-box">
                    <p className="stat-value">${(customer.totalSpent || 0).toLocaleString()}</p>
                    <p className="stat-label">Total Spent</p>
                  </div>
                </div>

                <div className="customer-actions">
                  <button className="btn-edit" onClick={() => handleEdit(customer)}>
                    <Edit size={16} />
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(customer.id)}>
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <Users size={64} />
              </div>
              <h3>No customers found</h3>
              <p>Start by adding your first customer</p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="modal-overlay" onClick={resetForm}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingCustomer ? "Edit Customer" : "Add New Customer"}</h2>
                <button className="close-btn" onClick={resetForm}>
                  <X size={24} />
                </button>
              </div>

              <div className="modal-body">
                <form onSubmit={handleSubmit} className="customer-form">
                  <div className="form-group">
                    <label>Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="form-group">
                    <label>Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>

                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>

                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="NY"
                    />
                  </div>

                  <div className="form-group">
                    <label>Zip Code</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      placeholder="10001"
                    />
                  </div>
                </form>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit" onClick={handleSubmit}>
                  {editingCustomer ? "Update Customer" : "Add Customer"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}