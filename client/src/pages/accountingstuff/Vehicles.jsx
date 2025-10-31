import React, { useState } from "react";
import "../../styles/accountant/vehicles.css";
import { Truck, Edit2, Trash2, Plus } from "react-feather";

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([
    { id: 1, plateNumber: "ABC-123", model: "Toyota Camry", year: 2020, type: "Sedan", purchasePrice: 35000, insurance: "AXA", insuranceExpiry: "2025-06-10", status: "Active" },
    { id: 2, plateNumber: "XYZ-789", model: "Ford Ranger", year: 2021, type: "Truck", purchasePrice: 52000, insurance: "Orient", insuranceExpiry: "2024-12-22", status: "Maintenance" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    plateNumber: "",
    model: "",
    year: "",
    type: "",
    purchasePrice: "",
    insurance: "",
    insuranceExpiry: "",
    status: "Active",
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      setVehicles(vehicles.map((v) => (v.id === editing.id ? formData : v)));
      setEditing(null);
    } else {
      setVehicles([...vehicles, { ...formData, id: Date.now() }]);
    }
    setFormData({
      plateNumber: "",
      model: "",
      year: "",
      type: "",
      purchasePrice: "",
      insurance: "",
      insuranceExpiry: "",
      status: "Active",
    });
    setShowForm(false);
  };

  const handleEdit = (v) => {
    setEditing(v);
    setFormData(v);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this vehicle?")) {
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="vehicles-page">
      <div className="vehicles-header">
        <h2>Vehicles</h2>
        <button onClick={() => setShowForm(true)} className="add-btn">
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      <table className="vehicles-table">
        <thead>
          <tr>
            <th>Plate</th>
            <th>Model</th>
            <th>Year</th>
            <th>Type</th>
            <th>Price (AED)</th>
            <th>Insurance</th>
            <th>Expiry</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td>{v.plateNumber}</td>
              <td>{v.model}</td>
              <td>{v.year}</td>
              <td>{v.type}</td>
              <td>{v.purchasePrice}</td>
              <td>{v.insurance}</td>
              <td>{v.insuranceExpiry}</td>
              <td>
                <span className={`status ${v.status.toLowerCase()}`}>{v.status}</span>
              </td>
              <td className="actions">
                <button className="edit-btn" onClick={() => handleEdit(v)}>
                  <Edit2 size={16} />
                </button>
                <button className="delete-btn" onClick={() => handleDelete(v.id)}>
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editing ? "Edit Vehicle" : "Add Vehicle"}</h3>
            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map((key) =>
                key !== "id" ? (
                  <div key={key} className="form-group">
                    <label>{key.replace(/([A-Z])/g, " $1")}:</label>
                    <input
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      required
                    />
                  </div>
                ) : null
              )}
              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
