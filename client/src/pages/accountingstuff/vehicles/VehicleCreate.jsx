import React, { useState } from "react";
import { createVehicle } from "../../../api/vehicles";
import styles from "../../../styles/accountant/vehicles.module.css";

export default function VehicleCreate({ onSaved, onClose }) {
  const [formData, setFormData] = useState({
    VIN: "",
    make: "",
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
    imagesFiles: [],
  });

  const [saving, setSaving] = useState(false);

  // 🔄 Handle form inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🖼️ Handle file uploads
  const handleFiles = (e) => {
    setFormData((prev) => ({
      ...prev,
      imagesFiles: Array.from(e.target.files),
    }));
  };

  // 💾 Submit vehicle form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createVehicle(formData);
      alert("✅ Vehicle created successfully!");
      onSaved?.();
      onClose?.();
    } catch (err) {
      console.error("❌ Error creating vehicle:", err);
      alert("Failed to create vehicle. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.large}`}>
        <div className={styles.modalHeader}>
          <h3>Add Vehicle</h3>
          <button className={styles.closeBtn} onClick={onClose}>
            ✖
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* VIN */}
            <div className={styles.formGroup}>
              <label>VIN</label>
              <input
                name="VIN"
                value={formData.VIN}
                onChange={handleChange}
                required
              />
            </div>

            {/* Make */}
            <div className={styles.formGroup}>
              <label>Make</label>
              <input
                name="make"
                value={formData.make}
                onChange={handleChange}
                required
              />
            </div>

            {/* Model */}
            <div className={styles.formGroup}>
              <label>Model</label>
              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
            </div>

            {/* Year */}
            <div className={styles.formGroup}>
              <label>Year</label>
              <input
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                required
              />
            </div>

            {/* Type */}
            <div className={styles.formGroup}>
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option>Sedan</option>
                <option>SUV</option>
                <option>Truck</option>
                <option>Coupe</option>
                <option>Hatchback</option>
                <option>Van</option>
              </select>
            </div>

            {/* Price */}
            <div className={styles.formGroup}>
              <label>Price ($)</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            {/* Cost */}
            <div className={styles.formGroup}>
              <label>Cost ($)</label>
              <input
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
              />
            </div>

            {/* Purchase Date */}
            <div className={styles.formGroup}>
              <label>Purchase Date</label>
              <input
                name="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
              />
            </div>

            {/* Insurance */}
            <div className={styles.formGroup}>
              <label>Insurance Provider</label>
              <input
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Insurance Expiry</label>
              <input
                name="insuranceExpiry"
                type="date"
                value={formData.insuranceExpiry}
                onChange={handleChange}
              />
            </div>

            {/* Maintenance / Fuel */}
            <div className={styles.formGroup}>
              <label>Maintenance Cost ($)</label>
              <input
                name="maintenanceCost"
                type="number"
                value={formData.maintenanceCost}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Fuel Cost ($)</label>
              <input
                name="fuelCost"
                type="number"
                value={formData.fuelCost}
                onChange={handleChange}
              />
            </div>

            {/* Transmission */}
            <div className={styles.formGroup}>
              <label>Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
              >
                <option>Automatic</option>
                <option>Manual</option>
              </select>
            </div>

            {/* Cylinders */}
            <div className={styles.formGroup}>
              <label>Cylinders</label>
              <select
                name="cylinders"
                value={formData.cylinders}
                onChange={handleChange}
              >
                <option>4</option>
                <option>6</option>
                <option>8</option>
                <option>Electric</option>
              </select>
            </div>

            {/* Fuel Type */}
            <div className={styles.formGroup}>
              <label>Fuel Type</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
              >
                <option>Petrol</option>
                <option>Diesel</option>
                <option>Electric</option>
                <option>Hybrid</option>
              </select>
            </div>

            {/* Condition */}
            <div className={styles.formGroup}>
              <label>Condition</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option>New</option>
                <option>Used</option>
              </select>
            </div>

            {/* Color */}
            <div className={styles.formGroup}>
              <label>Color</label>
              <input
                type="color"
                name="color"
                value={formData.color}
                onChange={handleChange}
              />
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label>Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option>Active</option>
                <option>Sold</option>
                <option>Maintenance</option>
              </select>
            </div>

            {/* Images */}
            <div className={styles.formGroup}>
              <label>Images (max 5)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
              />
            </div>
          </div>

          <div className={styles.modalActions}>
            <button
              type="submit"
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
