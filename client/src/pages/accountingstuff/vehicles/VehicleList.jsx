import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Eye } from "react-feather";
import "../../../styles/accountant/vehicles.css";

// 🧩 Import modal components
import VehicleCreate from "./VehicleCreate";
import VehicleEdit from "./VehicleEdit";
import VehicleShow from "./VehicleShow";

// 🧠 Import API helpers
import { getVehicles, deleteVehicle, imgUrl } from "../../../api/vehicles";

export default function VehicleList() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);

  // 🔄 Fetch vehicles from DB
  const loadVehicles = async () => {
    setLoading(true);
    try {
      const data = await getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error("❌ Error loading vehicles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  // 🗑 Delete a vehicle
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await deleteVehicle(id);
      loadVehicles();
    } catch (err) {
      alert("Failed to delete vehicle");
    }
  };

  return (
    <div className="vehicles-page">
      <div className="vehicles-header">
        <h2>Vehicles</h2>
        <button className="add-btn" onClick={() => setShowCreate(true)}>
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

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
          {loading ? (
            <tr>
              <td colSpan="7" className="no-data">
                Loading…
              </td>
            </tr>
          ) : vehicles.length === 0 ? (
            <tr>
              <td colSpan="7" className="no-data">
                No vehicles found
              </td>
            </tr>
          ) : (
            vehicles.map((v) => (
              <tr key={v._id}>
                <td>
                  {v.images?.length ? (
                    <img
                      src={imgUrl(v.images[0])}
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
                  <span className={`status ${v.status?.toLowerCase()}`}>
                    {v.status}
                  </span>
                </td>
                <td>${(v.price ?? 0).toLocaleString()}</td>
                <td className="actions">
                  <button
                    className="view-btn"
                    title="View"
                    onClick={() => {
                      setSelectedVehicle(v);
                      setShowView(true);
                    }}
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="edit-btn"
                    title="Edit"
                    onClick={() => {
                      setSelectedVehicle(v);
                      setShowEdit(true);
                    }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="delete-btn"
                    title="Delete"
                    onClick={() => handleDelete(v._id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* ➕ Create Modal */}
      {showCreate && (
        <VehicleCreate onSaved={loadVehicles} onClose={() => setShowCreate(false)} />
      )}

      {/* ✏️ Edit Modal */}
      {showEdit && selectedVehicle && (
        <VehicleEdit
          vehicle={selectedVehicle}
          onSave={() => {
            setShowEdit(false);
            loadVehicles();
          }}
          onClose={() => setShowEdit(false)}
        />
      )}

      {/* 👁️ View Modal */}
      {showView && selectedVehicle && (
        <VehicleShow vehicle={selectedVehicle} onClose={() => setShowView(false)} />
      )}
    </div>
  );
}
