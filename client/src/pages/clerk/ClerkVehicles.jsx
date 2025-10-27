// src/pages/clerk/ClerkVehicles.jsx
import React, { useContext, useState, useEffect } from "react";
import { VehicleContext } from "../../context/clerk/VehicleContext";
import {
  Search, Plus, Edit2, Trash2, X, AlertTriangle,
  Car, Info
} from "lucide-react";
import "../../styles/clerk/clerkVehicles.css";

export default function ClerkVehicles() {
  const { vehicles, loading, addVehicle, updateVehicle, deleteVehicle } = useContext(VehicleContext);

  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState(null);

  const [formData, setFormData] = useState({
    vin: "",
    plate: "",
    make: "",
    type: "",
    model: "",
    year: "",
    cost: "",
    price: "",
    color: "",
    condition: "new",
    transmission: "",
    cylinders: "",
    fuelType: "",
    insuranceProvider: "",
    insuranceExpiry: "",
    purchaseDate: "",
    fuelCost: "",
    maintenanceCost: "",
    status: "active",
    imageUrl: "",
  });

  useEffect(() => {
    if (selectedVehicle) {
      setFormData({ ...selectedVehicle });
    } else {
      resetForm();
    }
  }, [selectedVehicle]);

  const resetForm = () => {
    setFormData({
      vin: "",
      plate: "",
      make: "",
      type: "",
      model: "",
      year: "",
      cost: "",
      price: "",
      color: "",
      condition: "new",
      transmission: "",
      cylinders: "",
      fuelType: "",
      insuranceProvider: "",
      insuranceExpiry: "",
      purchaseDate: "",
      fuelCost: "",
      maintenanceCost: "",
      status: "active",
      imageUrl: "",
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (selectedVehicle) {
      await updateVehicle(selectedVehicle.id, formData);
    } else {
      await addVehicle(formData);
    }
    setShowModal(false);
    setSelectedVehicle(null);
  };

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

  const filteredVehicles = vehicles.filter(v =>
    `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setSelectedVehicle(null);
    setShowModal(true);
  };

  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  return (
    <div className="vehicles-page">
      <header className="vehicles-header">
        <h1><Car size={30} /> Vehicle Inventory</h1>
      </header>

      <div className="vehicles-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search vehicles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="add-vehicle-btn" onClick={openAddModal}>
          <Plus size={18} /> Add Vehicle
        </button>
      </div>

      <div className="vehicles-grid">
        {filteredVehicles.map((v) => (
          <div key={v.id} className="vehicle-card">
            <img src={v.imageUrl || "/no-image.png"} alt="" />
            <h3>{v.make} {v.model}</h3>
            <p>{v.year} • {v.type}</p>
            <p className="vehicle-price">${v.price}</p>
            <div className="vehicle-actions">
              <button className="btn-edit" onClick={() => openEditModal(v)}>
                <Edit2 size={16}/>Edit
              </button>
              <button className="btn-delete" onClick={() => handleDeleteClick(v)}>
                <Trash2 size={16}/>Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedVehicle ? "Edit Vehicle" : "Add New Vehicle"}</h2>
              <button onClick={() => setShowModal(false)}><X /></button>
            </div>

            <form className="vehicle-form" onSubmit={handleFormSubmit}>
              {/* VIN */}
              <div className="form-group">
                <label htmlFor="vin">
                  VIN <Info title="Unique 17-character vehicle identifier" size={14}/>
                </label>
                <input
                  id="vin"
                  name="vin"
                  type="text"
                  maxLength="17"
                  value={formData.vin}
                  onChange={handleFormChange}
                  placeholder="e.g. 1HGCM82633A123456"
                  required
                />
              </div>

              {/* Make */}
              <div className="form-group">
                <label htmlFor="make">
                  Make <Info title="Manufacturer or brand of the vehicle" size={14}/>
                </label>
                <select id="make" name="make" value={formData.make} onChange={handleFormChange} required>
                  <option value="">Select Make</option>
                  {["Toyota","Honda","Ford","BMW","Mercedes","Nissan","Kia","Hyundai","Audi","Chevrolet"].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  value={formData.model}
                  onChange={handleFormChange}
                  placeholder="Model Name"
                />
              </div>

              {/* Year */}
              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  value={formData.year}
                  onChange={handleFormChange}
                  placeholder="e.g. 2023"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                />
              </div>

              {/* Purchase Date */}
              <div className="form-group">
                <label htmlFor="purchaseDate">Purchase Date</label>
                <input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleFormChange}
                />
              </div>

              {/* Insurance Provider */}
              <div className="form-group">
                <label htmlFor="insuranceProvider">Insurance Provider</label>
                <input
                  id="insuranceProvider"
                  name="insuranceProvider"
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={handleFormChange}
                  placeholder="Insurance Company Name"
                />
              </div>

              {/* Insurance Expiry */}
              <div className="form-group">
                <label htmlFor="insuranceExpiry">Insurance Expiry</label>
                <input
                  id="insuranceExpiry"
                  name="insuranceExpiry"
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={handleFormChange}
                />
              </div>

              {/* Maintenance Cost */}
              <div className="form-group">
                <label htmlFor="maintenanceCost">Maintenance Cost ($)</label>
                <input
                  id="maintenanceCost"
                  name="maintenanceCost"
                  type="number"
                  value={formData.maintenanceCost}
                  onChange={handleFormChange}
                  min="0"
                  placeholder="e.g. 500"
                />
              </div>

              {/* Fuel Cost */}
              <div className="form-group">
                <label htmlFor="fuelCost">Fuel Cost ($)</label>
                <input
                  id="fuelCost"
                  name="fuelCost"
                  type="number"
                  value={formData.fuelCost}
                  onChange={handleFormChange}
                  min="0"
                  placeholder="e.g. 100"
                />
              </div>

              {/* Color */}
              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  id="color"
                  name="color"
                  type="text"
                  value={formData.color}
                  onChange={handleFormChange}
                  placeholder="e.g. Red, Black, White"
                />
              </div>

              {/* Cost */}
              <div className="form-group">
                <label htmlFor="cost">Cost ($)</label>
                <input
                  id="cost"
                  name="cost"
                  type="number"
                  value={formData.cost}
                  onChange={handleFormChange}
                  min="0"
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleFormChange}
                  min="0"
                />
              </div>

              {/* Transmission */}
              <div className="form-group">
                <label htmlFor="transmission">Transmission</label>
                <select id="transmission" name="transmission" value={formData.transmission} onChange={handleFormChange}>
                  <option value="">Select Transmission</option>
                  {["Automatic","Manual","CVT","Electric","Hybrid"].map(tr => (
                    <option key={tr} value={tr}>{tr}</option>
                  ))}
                </select>
              </div>

              {/* Cylinders */}
              <div className="form-group">
                <label htmlFor="cylinders">Cylinders</label>
                <select id="cylinders" name="cylinders" value={formData.cylinders} onChange={handleFormChange}>
                  <option value="">Select Cylinders</option>
                  {["3","4","6","8","10","12","Electric"].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Fuel Type */}
              <div className="form-group">
                <label htmlFor="fuelType">Fuel Type</label>
                <select id="fuelType" name="fuelType" value={formData.fuelType} onChange={handleFormChange}>
                  <option value="">Select Fuel Type</option>
                  {["Gasoline","Diesel","Electric","Hybrid","CNG","LPG"].map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              {/* Image */}
              <div className="form-group">
                <label htmlFor="imageUrl">Vehicle Image URL</label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                  placeholder="https://example.com/car.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-submit">{selectedVehicle ? "Update Vehicle" : "Add Vehicle"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <AlertTriangle size={36} color="red" />
            <p>Confirm delete {vehicleToDelete?.make} {vehicleToDelete?.model}?</p>
            <div className="form-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
