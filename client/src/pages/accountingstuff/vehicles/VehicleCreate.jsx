import React, { useState } from "react";
import "../../../styles/accountant/vehicles.css";

export default function VehicleCreate({ onSave, onClose }) {
  const [formData, setFormData] = useState({
    VIN: "",
    make: "Toyota",
    model: "",
    year: "",
    type: "Sedan",
    price: "",
    cost: "",
    purchaseDate: "",
    insuranceProvider: "",
    insuranceExpiry: "",
    maintenanceCost: "",
    fuelCost: "",
    transmission: "Automatic",
    cylinders: "4",
    fuelType: "Petrol",
    condition: "New",
    color: "#000000",
    status: "Active",
    images: [],
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...previews] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h3>Add Vehicle</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          {/* VIN */}
          <div className="form-group">
            <label>VIN:</label>
            <input
              name="VIN"
              value={formData.VIN}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Make:</label>
            <input name="make" value={formData.make} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Model:</label>
            <input
              name="model"
              value={formData.model}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Year:</label>
            <input
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Type:</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option>Sedan</option>
              <option>SUV</option>
              <option>Truck</option>
              <option>Van</option>
              <option>Coupe</option>
              <option>Hatchback</option>
            </select>
          </div>

          <div className="form-group">
            <label>Price ($):</label>
            <input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Cost ($):</label>
            <input
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Purchase Date:</label>
            <input
              name="purchaseDate"
              type="date"
              value={formData.purchaseDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Insurance Provider:</label>
            <input
              name="insuranceProvider"
              value={formData.insuranceProvider}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Insurance Expiry:</label>
            <input
              name="insuranceExpiry"
              type="date"
              value={formData.insuranceExpiry}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Maintenance Cost ($):</label>
            <input
              name="maintenanceCost"
              type="number"
              value={formData.maintenanceCost}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Fuel Cost ($):</label>
            <input
              name="fuelCost"
              type="number"
              value={formData.fuelCost}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Transmission:</label>
            <select
              name="transmission"
              value={formData.transmission}
              onChange={handleChange}
            >
              <option>Automatic</option>
              <option>Manual</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cylinders:</label>
            <select
              name="cylinders"
              value={formData.cylinders}
              onChange={handleChange}
            >
              <option>3</option>
              <option>4</option>
              <option>6</option>
              <option>8</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fuel Type:</label>
            <select
              name="fuelType"
              value={formData.fuelType}
              onChange={handleChange}
            >
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Hybrid</option>
              <option>Electric</option>
            </select>
          </div>

          <div className="form-group">
            <label>Condition:</label>
            <select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
            >
              <option>New</option>
              <option>Used</option>
            </select>
          </div>

          <div className="form-group">
            <label>Color:</label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Maintenance</option>
              <option>Sold</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Vehicle Images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
            />
            <div className="image-preview">
              {formData.images.map((img, index) => (
                <img key={index} src={img} alt="Preview" />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save
            </button>
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
