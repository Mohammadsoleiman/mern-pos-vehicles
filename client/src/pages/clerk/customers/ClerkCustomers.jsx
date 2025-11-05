import React, { useContext, useState } from "react";
import { CustomerContext } from "../../../context/clerk/CustomerContext";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Calendar,
  Eye,
  X,
  User,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import "../../../styles/clerk/ClerkCustomers.css";

export default function ClerkCustomers() {
  const { customers, addCustomer, deleteCustomer, updateCustomer } =
    useContext(CustomerContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone?.includes(searchQuery)
  );

  const handleAdd = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      alert("Please fill all fields!");
      return;
    }
    await addCustomer(formData);
    setFormData({ name: "", email: "", phone: "" });
    setShowAddModal(false);
  };

  return (
    <div className="customers-page">
      {/* Header */}
      <div className="customers-header">
        <div>
          <h1>
            <User size={30} /> Customers
          </h1>
          <p>Manage customer information, edit, or view spending history.</p>
        </div>
        <button className="btn-add-customer" onClick={() => setShowAddModal(true)}>
          <Plus size={18} /> Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Search size={18} />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Customer Cards */}
      <div className="customers-grid">
        {filtered.length === 0 ? (
          <div className="empty-state">No customers found.</div>
        ) : (
          filtered.map((c) => (
            <div key={c._id} className="customer-card">
              <h2 className="customer-name">{c.name}</h2>
              <p className="customer-email">
                <Mail size={15} /> {c.email}
              </p>
              <p className="customer-phone">
                <Phone size={15} /> {c.phone}
              </p>
              <div className="customer-meta">
                <p>
                  <Calendar size={15} />{" "}
                  {new Date(c.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="customer-actions">
                <button
                  className="btn-edit"
                  onClick={() => {
                    setSelectedCustomer(c);
                    setShowModal(true);
                  }}
                >
                  <Eye size={16} /> Show
                </button>
                <button className="btn-delete" onClick={() => deleteCustomer(c._id)}>
                  <X size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 🔹 Show Details Modal */}
      {showModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <User size={22} /> {selectedCustomer.name}
              </h2>
              <button onClick={() => setShowModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p>
                <Mail size={16} /> {selectedCustomer.email}
              </p>
              <p>
                <Phone size={16} /> {selectedCustomer.phone}
              </p>
              <hr style={{ margin: "15px 0", borderColor: "#eee" }} />
              <div className="customer-stats">
                <div className="stat">
                  <DollarSign size={22} />
                  <div>
                    <p>Total Spent</p>
                    <h3>${selectedCustomer.totalSpent || 0}</h3>
                  </div>
                </div>
                <div className="stat">
                  <ShoppingBag size={22} />
                  <div>
                    <p>Purchases</p>
                    <h3>{selectedCustomer.purchases || 0}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ➕ Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Customer</h2>
              <button onClick={() => setShowAddModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              {["name", "email", "phone"].map((field) => (
                <div className="form-group" key={field}>
                  <label>
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    placeholder={`Customer ${field}`}
                  />
                </div>
              ))}
              <button className="btn-add-customer" onClick={handleAdd}>
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
