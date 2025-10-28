import React, { useContext, useState } from "react";
import { VehicleContext } from "../../context/ACCOUNTANT/VehicleContext.jsx";
import "../../styles/accountant/vehicles.css";

export default function Vehicles() {
  const { vehicles, addVehicle, deleteVehicle } = useContext(VehicleContext);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    plateNumber: "",
    vin: "",
    make: "",
    model: "",
    year: "",
    type: "",
    purchasePrice: "",
    salePrice: "",
    purchaseDate: "",
    insurance: "",
    insuranceExpiry: "",
    maintenanceCost: 0,
    fuelCost: 0,
    color: "",
    transmission: "",
    cylinders: "",
    fuelType: "",
    imageUrl: "",
    status: "active",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addVehicle({
      ...formData,
      id: Date.now(),
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      salePrice: parseFloat(formData.salePrice) || 0,
      maintenanceCost: parseFloat(formData.maintenanceCost) || 0,
      fuelCost: parseFloat(formData.fuelCost) || 0,
      year: parseInt(formData.year) || new Date().getFullYear(),
    });
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      plateNumber: "",
      vin: "",
      make: "",
      model: "",
      year: "",
      type: "",
      purchasePrice: "",
      salePrice: "",
      purchaseDate: "",
      insurance: "",
      insuranceExpiry: "",
      maintenanceCost: 0,
      fuelCost: 0,
      color: "",
      transmission: "",
      cylinders: "",
      fuelType: "",
      imageUrl: "",
      status: "active",
    });
    setShowForm(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Calculate total costs
  const totalInvestment = vehicles.reduce((sum, v) => sum + (v.purchasePrice || 0), 0);
  const totalMaintenance = vehicles.reduce((sum, v) => sum + (v.maintenanceCost || 0), 0);
  const totalFuel = vehicles.reduce((sum, v) => sum + (v.fuelCost || 0), 0);
  const totalOperatingCost = totalMaintenance + totalFuel;

  // Depreciation (simple 20% per year)
  const calculateDepreciation = (vehicle) => {
    if (!vehicle.purchaseDate || !vehicle.purchasePrice) return 0;
    const years = (new Date() - new Date(vehicle.purchaseDate)) / (1000 * 60 * 60 * 24 * 365);
    const depreciation = vehicle.purchasePrice * 0.2 * years;
    return Math.min(depreciation, vehicle.purchasePrice * 0.8);
  };

  const calculateCurrentValue = (vehicle) => {
    return (vehicle.purchasePrice || 0) - calculateDepreciation(vehicle);
  };

  return (
    <div className="vehicles-page">
      <div className="page-header">
        <div>
          <h1>🚗 Vehicle Management</h1>
          <p>Track vehicles, costs, and financial performance</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Add Vehicle"}
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="vehicle-stats">
        <div className="stat-card-vehicle">
          <div className="stat-icon">🚗</div>
          <div className="stat-details">
            <h3>Total Vehicles</h3>
            <p className="stat-value">{vehicles.length}</p>
            <span className="stat-label">Active Fleet</span>
          </div>
        </div>
        <div className="stat-card-vehicle">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <h3>Total Investment</h3>
            <p className="stat-value">${totalInvestment.toFixed(2)}</p>
            <span className="stat-label">Purchase Costs</span>
          </div>
        </div>
        <div className="stat-card-vehicle">
          <div className="stat-icon">🔧</div>
          <div className="stat-details">
            <h3>Maintenance Cost</h3>
            <p className="stat-value">${totalMaintenance.toFixed(2)}</p>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>
        <div className="stat-card-vehicle">
          <div className="stat-icon">⛽</div>
          <div className="stat-details">
            <h3>Fuel Cost</h3>
            <p className="stat-value">${totalFuel.toFixed(2)}</p>
            <span className="stat-label">Total Spent</span>
          </div>
        </div>
      </div>

      {/* Add Vehicle Form */}
      {showForm && (
        <div className="vehicle-form-card">
          <h3>Add New Vehicle</h3>
          <form className="vehicle-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>VIN *</label>
                <input type="text" name="vin" value={formData.vin} onChange={handleChange} required placeholder="1HGCM82633A123456"/>
              </div>
              <div className="form-group">
                <label>Plate Number *</label>
                <input type="text" name="plateNumber" value={formData.plateNumber} onChange={handleChange} required placeholder="ABC-1234"/>
              </div>
              <div className="form-group">
                <label>Make *</label>
                <input type="text" name="make" value={formData.make} onChange={handleChange} required placeholder="Toyota"/>
              </div>
              <div className="form-group">
                <label>Model *</label>
                <input type="text" name="model" value={formData.model} onChange={handleChange} required placeholder="Camry"/>
              </div>
              <div className="form-group">
                <label>Year *</label>
                <input type="number" name="year" value={formData.year} onChange={handleChange} required placeholder="2023"/>
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="truck">Truck</option>
                  <option value="van">Van</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Purchase Price *</label>
                <input type="number" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} required placeholder="25000" step="0.01"/>
              </div>
              <div className="form-group">
                <label>Sale Price ($)</label>
                <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} placeholder="30000" step="0.01"/>
              </div>
              <div className="form-group">
                <label>Purchase Date *</label>
                <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required/>
              </div>
              <div className="form-group">
                <label>Insurance Provider</label>
                <input type="text" name="insurance" value={formData.insurance} onChange={handleChange} placeholder="ABC Insurance"/>
              </div>
              <div className="form-group">
                <label>Insurance Expiry</label>
                <input type="date" name="insuranceExpiry" value={formData.insuranceExpiry} onChange={handleChange}/>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Maintenance Cost ($)</label>
                <input type="number" name="maintenanceCost" value={formData.maintenanceCost} onChange={handleChange} placeholder="500" step="0.01"/>
              </div>
              <div className="form-group">
                <label>Fuel Cost ($)</label>
                <input type="number" name="fuelCost" value={formData.fuelCost} onChange={handleChange} placeholder="100" step="0.01"/>
              </div>
              <div className="form-group">
                <label>Color</label>
                <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Red"/>
              </div>
              <div className="form-group">
                <label>Transmission</label>
                <select name="transmission" value={formData.transmission} onChange={handleChange}>
                  <option value="">Select Transmission</option>
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
              <div className="form-group">
                <label>Cylinders</label>
                <select name="cylinders" value={formData.cylinders} onChange={handleChange}>
                  <option value="">Select Cylinders</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="6">6</option>
                  <option value="8">8</option>
                </select>
              </div>
              <div className="form-group">
                <label>Fuel Type</label>
                <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                  <option value="">Select Fuel Type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div className="form-group">
                <label>Vehicle Image URL</label>
                <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/car.jpg"/>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">Add Vehicle</button>
              <button type="button" className="btn-cancel" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Vehicles Table */}
      <div className="vehicles-table-container">
        <h3>Fleet Overview</h3>
        {vehicles.length === 0 ? (
          <p className="empty-state">No vehicles added yet. Click "Add Vehicle" to get started.</p>
        ) : (
          <div className="table-wrapper">
            <table className="vehicles-table">
              <thead>
                <tr>
                  <th>Plate Number</th>
                  <th>VIN</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Year</th>
                  <th>Type</th>
                  <th>Purchase Price</th>
                  <th>Current Value</th>
                  <th>Depreciation</th>
                  <th>Maintenance</th>
                  <th>Fuel Cost</th>
                  <th>Total Cost</th>
                  <th>Insurance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => {
                  const depreciation = calculateDepreciation(vehicle);
                  const currentValue = calculateCurrentValue(vehicle);
                  const totalCost = (vehicle.maintenanceCost || 0) + (vehicle.fuelCost || 0);
                  const insuranceStatus = vehicle.insuranceExpiry && new Date(vehicle.insuranceExpiry) < new Date() ? "Expired" : "Valid";

                  return (
                    <tr key={vehicle.id}>
                      <td><strong>{vehicle.plateNumber}</strong></td>
                      <td>{vehicle.vin}</td>
                      <td>{vehicle.make}</td>
                      <td>{vehicle.model}</td>
                      <td>{vehicle.year}</td>
                      <td><span className="badge-type">{vehicle.type || "N/A"}</span></td>
                      <td>${(vehicle.purchasePrice || 0).toFixed(2)}</td>
                      <td className="value-positive">${currentValue.toFixed(2)}</td>
                      <td className="value-negative">-${depreciation.toFixed(2)}</td>
                      <td>${(vehicle.maintenanceCost || 0).toFixed(2)}</td>
                      <td>${(vehicle.fuelCost || 0).toFixed(2)}</td>
                      <td><strong>${totalCost.toFixed(2)}</strong></td>
                      <td>
                        <span className={`badge-insurance ${insuranceStatus === "Expired" ? "expired" : "valid"}`}>
                          {insuranceStatus}
                        </span>
                        {vehicle.insuranceExpiry && (
                          <small>{new Date(vehicle.insuranceExpiry).toLocaleDateString()}</small>
                        )}
                      </td>
                      <td>
                        <span className={`badge-status status-${vehicle.status}`}>
                          {vehicle.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-delete"
                          onClick={() => deleteVehicle(vehicle.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Financial Summary */}
      {vehicles.length > 0 && (
        <div className="financial-summary">
          <h3>Financial Summary</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <span className="summary-label">Total Fleet Value (Current)</span>
              <span className="summary-value">
                ${vehicles.reduce((sum, v) => sum + calculateCurrentValue(v), 0).toFixed(2)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Depreciation</span>
              <span className="summary-value negative">
                -${vehicles.reduce((sum, v) => sum + calculateDepreciation(v), 0).toFixed(2)}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Total Operating Cost</span>
              <span className="summary-value">${totalOperatingCost.toFixed(2)}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Average Cost per Vehicle</span>
              <span className="summary-value">
                ${(totalOperatingCost / vehicles.length).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
