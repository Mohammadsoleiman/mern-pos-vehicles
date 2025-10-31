import React, { useState } from "react";
import { updateVehicle, imgUrl } from "../../../api/vehicles";
import "../../../styles/accountant/vehicles.css";

export default function VehicleEdit({ vehicle, onSave, onClose }) {
  const [formData, setFormData] = useState({
    ...vehicle,
    oldImages: vehicle.images || [],
    imagesFiles: [],
  });

  const [saving, setSaving] = useState(false);

  // --- handle text/number/select changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- handle file uploads
  const handleFiles = (e) => {
    setFormData((prev) => ({
      ...prev,
      imagesFiles: Array.from(e.target.files),
    }));
  };

  // --- remove an old image from preview & update list
  const handleRemoveImage = (imgPath) => {
    if (!window.confirm("Remove this image?")) return;
    setFormData((prev) => ({
      ...prev,
      oldImages: prev.oldImages.filter((img) => img !== imgPath),
    }));
  };

  // --- submit update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateVehicle(vehicle._id, formData);
      alert("✅ Vehicle updated successfully!");
      onSave?.();
      onClose?.();
    } catch (err) {
      console.error("❌ Error updating vehicle:", err);
      alert("Failed to update vehicle");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h3>Edit Vehicle</h3>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>VIN</label>
              <input name="VIN" value={formData.VIN} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Make</label>
              <input name="make" value={formData.make} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Model</label>
              <input name="model" value={formData.model} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Year</label>
              <input name="year" type="number" value={formData.year} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option>Sedan</option>
                <option>SUV</option>
                <option>Truck</option>
                <option>Coupe</option>
                <option>Hatchback</option>
                <option>Van</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price ($)</label>
              <input name="price" type="number" value={formData.price} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Cost ($)</label>
              <input name="cost" type="number" value={formData.cost} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Purchase Date</label>
              <input name="purchaseDate" type="date"
                     value={formData.purchaseDate ? formData.purchaseDate.slice(0, 10) : ""} 
                     onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Insurance Provider</label>
              <input name="insuranceProvider" value={formData.insuranceProvider} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Insurance Expiry</label>
              <input name="insuranceExpiry" type="date"
                     value={formData.insuranceExpiry ? formData.insuranceExpiry.slice(0, 10) : ""} 
                     onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Maintenance Cost ($)</label>
              <input name="maintenanceCost" type="number" value={formData.maintenanceCost || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Fuel Cost ($)</label>
              <input name="fuelCost" type="number" value={formData.fuelCost || ""} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Transmission</label>
              <select name="transmission" value={formData.transmission} onChange={handleChange}>
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>

            <div className="form-group">
              <label>Cylinders</label>
              <select name="cylinders" value={formData.cylinders} onChange={handleChange}>
                <option>4</option>
                <option>6</option>
                <option>8</option>
                <option>Electric</option>
              </select>
            </div>

            <div className="form-group">
              <label>Fuel Type</label>
              <select name="fuelType" value={formData.fuelType} onChange={handleChange}>
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label>Condition</label>
              <select name="condition" value={formData.condition} onChange={handleChange}>
                <option>New</option>
                <option>Used</option>
              </select>
            </div>

            <div className="form-group">
              <label>Color</label>
              <input type="color" name="color" value={formData.color} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option>Active</option>
                <option>Sold</option>
                <option>Maintenance</option>
              </select>
            </div>

            {/* 📷 Image preview + upload */}
            <div className="form-group images-group">
              <label>Images</label>

              <div className="image-preview-grid">
                {formData.oldImages?.length > 0 &&
                  formData.oldImages.map((img) => (
                    <div key={img} className="image-thumb">
                      <img src={imgUrl(img)} alt="Vehicle" />
                      <button type="button" className="remove-img-btn" onClick={() => handleRemoveImage(img)}>
                        ✕
                      </button>
                    </div>
                  ))}
              </div>

              <input type="file" accept="image/*" multiple onChange={handleFiles} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Saving..." : "Update"}
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
