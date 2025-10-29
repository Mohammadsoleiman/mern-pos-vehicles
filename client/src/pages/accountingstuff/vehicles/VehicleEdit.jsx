import React, { useState, useEffect } from "react";
import "../../../styles/accountant/vehicles.css";

export default function VehicleEdit({ vehicle, onSave, onClose }) {
  const [formData, setFormData] = useState(vehicle || {});

  useEffect(() => {
    if (vehicle) setFormData(vehicle);
  }, [vehicle]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData({
      ...formData,
      images: [...(formData.images || []), ...previews],
    });
  };

  const handleDeleteImage = (index) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const updatedImages = formData.images.filter((_, i) => i !== index);
      setFormData({ ...formData, images: updatedImages });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!vehicle) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h3>Edit Vehicle</h3>
        <form onSubmit={handleSubmit} className="form-grid">
          {/* -------- Basic Info -------- */}
          <div className="form-group">
            <label>VIN:</label>
            <input
              name="VIN"
              value={formData.VIN || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Make:</label>
            <input
              name="make"
              value={formData.make || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Model:</label>
            <input
              name="model"
              value={formData.model || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Year:</label>
            <input
              type="number"
              name="year"
              value={formData.year || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Type:</label>
            <select
              name="type"
              value={formData.type || ""}
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
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Cost ($):</label>
            <input
              type="number"
              name="cost"
              value={formData.cost || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Purchase Date:</label>
            <input
              type="date"
              name="purchaseDate"
              value={formData.purchaseDate || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Insurance Provider:</label>
            <input
              name="insuranceProvider"
              value={formData.insuranceProvider || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Insurance Expiry:</label>
            <input
              type="date"
              name="insuranceExpiry"
              value={formData.insuranceExpiry || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Maintenance Cost ($):</label>
            <input
              type="number"
              name="maintenanceCost"
              value={formData.maintenanceCost || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Fuel Cost ($):</label>
            <input
              type="number"
              name="fuelCost"
              value={formData.fuelCost || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Transmission:</label>
            <select
              name="transmission"
              value={formData.transmission || ""}
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
              value={formData.cylinders || ""}
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
              value={formData.fuelType || ""}
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
              value={formData.condition || ""}
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
              value={formData.color || "#000000"}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status:</label>
            <select
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
            >
              <option>Active</option>
              <option>Maintenance</option>
              <option>Sold</option>
            </select>
          </div>

          {/* -------- Images Section -------- */}
          <div className="form-group full-width">
            <label>Vehicle Images:</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImagesChange}
            />

            <div className="image-preview editable">
              {(formData.images || []).map((img, index) => (
                <div key={index} className="image-wrapper">
                  <img src={img} alt={`Vehicle ${index + 1}`} />
                  <button
                    type="button"
                    className="delete-img-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteImage(index);
                    }}
                  >
                    ✖
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* -------- Buttons -------- */}
          <div className="modal-actions">
            <button type="submit" className="save-btn">
              Save Changes
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
