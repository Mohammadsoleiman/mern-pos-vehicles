import React, { useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "react-feather";
import "../../../styles/accountant/vehicles.css";
import VehicleCreate from "./VehicleCreate";
import VehicleEdit from "./VehicleEdit";
import VehicleShow from "./VehicleShow";

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([
    {
      id: 1,
      images: ["https://via.placeholder.com/80x60?text=Car"],
      model: "Toyota Camry",
      year: 2022,
      type: "Sedan",
      price: 32000,
      status: "Active",
    },
    {
      id: 2,
      images: ["https://via.placeholder.com/80x60?text=Truck"],
      model: "Ford Ranger",
      year: 2021,
      type: "Truck",
      price: 45000,
      status: "Maintenance",
    },
  ]);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);

  const handleAddVehicle = (newVehicle) => {
    setVehicles([...vehicles, { ...newVehicle, id: Date.now() }]);
    setShowCreate(false);
  };

  const handleEditVehicle = (updated) => {
    setVehicles(vehicles.map((v) => (v.id === updated.id ? updated : v)));
    setShowEdit(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      setVehicles(vehicles.filter((v) => v.id !== id));
    }
  };

  return (
    <div className="vehicles-page">
      {/* ---------- Header ---------- */}
      <div className="vehicles-header">
        <h2>Vehicles</h2>
        <button className="add-btn" onClick={() => setShowCreate(true)}>
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      {/* ---------- Vehicle Table ---------- */}
      <table className="vehicles-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Model</th>
            <th>Year</th>
            <th>Type</th>
            <th>Status</th>
            <th>Price ($)</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No vehicles available
              </td>
            </tr>
          ) : (
            vehicles.map((v) => (
              <tr key={v.id}>
                <td>
                  {v.images && v.images.length > 0 ? (
                    <img
                      src={v.images[0]}
                      alt="Vehicle"
                      className="table-thumb"
                    />
                  ) : (
                    "—"
                  )}
                </td>
                <td>{v.model}</td>
                <td>{v.year}</td>
                <td>{v.type}</td>
                <td>
                  <span className={`status ${v.status.toLowerCase()}`}>
                    {v.status}
                  </span>
                </td>
                <td>${v.price.toLocaleString()}</td>
                <td className="actions">
                  <button
                    className="view-btn"
                    onClick={() => {
                      setSelectedVehicle(v);
                      setShowView(true);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setSelectedVehicle(v);
                      setShowEdit(true);
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(v.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ---------- Modals ---------- */}
      {showCreate && (
        <VehicleCreate
          onSave={handleAddVehicle}
          onClose={() => setShowCreate(false)}
        />
      )}
      {showEdit && selectedVehicle && (
        <VehicleEdit
          vehicle={selectedVehicle}
          onSave={handleEditVehicle}
          onClose={() => setShowEdit(false)}
        />
      )}
      {showView && selectedVehicle && (
        <VehicleShow
          vehicle={selectedVehicle}
          onClose={() => setShowView(false)}
        />
      )}
    </div>
  );
}
