// src/pages/clerk/ClerkVehicles.jsx
import React, { useContext, useState } from "react";
import { VehicleContext } from "../../context/clerk/VehicleContext";
import "../../styles/clerkVehicles.css";

export default function ClerkVehicles() {
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useContext(VehicleContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === "all" || vehicle.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddVehicle = () => addVehicle();
  const handleEditVehicle = (vehicle) => updateVehicle(vehicle);
  const handleDeleteClick = (vehicle) => {
    setVehicleToDelete(vehicle);
    setShowDeleteConfirm(true);
  };
  const confirmDelete = async () => {
    if (vehicleToDelete) {
      await deleteVehicle(vehicleToDelete.id);
      setShowDeleteConfirm(false);
      setVehicleToDelete(null);
    }
  };

  return (
    <div className="vehicles-page">
      {/* Header */}
      <div className="vehicles-header">
        <h1>Vehicle Inventory</h1>
        <p>Manage your vehicle stock and inventory</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by name, brand, or VIN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Sedan">Sedan</option>
          <option value="SUV">SUV</option>
          <option value="Truck">Truck</option>
          <option value="Coupe">Coupe</option>
        </select>

        <div className="view-toggle">
          <button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => setViewMode("grid")}
          >
            Grid
          </button>
          <button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>

        <button className="btn-add" onClick={handleAddVehicle}>
          Add Vehicle
        </button>
      </div>

      {/* Results Count */}
      <div>
        <p>
          Showing <strong>{filteredVehicles.length}</strong> of {vehicles.length} vehicles
        </p>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}

      {/* Grid View */}
      {!loading && viewMode === "grid" && (
        <div className="grid-view">
          {filteredVehicles.map(vehicle => (
            <div key={vehicle.id} className="vehicle-card">
              <div className="relative">
                <img src={vehicle.image} alt={vehicle.name} />
                <span
                  className={`stock-badge ${vehicle.stock <= 2 ? "stock-low" : "stock-ok"}`}
                >
                  {vehicle.stock} in stock
                </span>
              </div>
              <div className="vehicle-info">
                <h3>{vehicle.name}</h3>
                <p>{vehicle.year} • {vehicle.category}</p>
                <p className="price">${vehicle.price.toLocaleString()}</p>
                <div className="specs">
                  <div><strong>Color:</strong> {vehicle.color}</div>
                  <div><strong>Fuel:</strong> {vehicle.fuelType}</div>
                </div>
                <div className="actions">
                  <button className="view-btn">View</button>
                  <button className="edit-btn" onClick={() => handleEditVehicle(vehicle)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(vehicle)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && viewMode === "list" && (
        <div className="list-view">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map(vehicle => (
                <tr key={vehicle.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img src={vehicle.image} alt={vehicle.name} style={{ width: 48, height: 48, borderRadius: 6, objectFit: "cover" }} />
                      <div style={{ marginLeft: 12 }}>
                        <div>{vehicle.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{vehicle.year}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="stock-badge stock-ok">{vehicle.category}</span>
                  </td>
                  <td>
                    <span className={`stock-badge ${vehicle.stock <= 2 ? "stock-low" : "stock-ok"}`}>
                      {vehicle.stock} units
                    </span>
                  </td>
                  <td>${vehicle.price.toLocaleString()}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEditVehicle(vehicle)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteClick(vehicle)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredVehicles.length === 0 && (
        <div className="empty-state">
          <p>No vehicles found. Try adjusting your search or filter.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="delete-modal">
          <div className="modal-content">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{vehicleToDelete?.name}</strong>? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="delete-btn" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
