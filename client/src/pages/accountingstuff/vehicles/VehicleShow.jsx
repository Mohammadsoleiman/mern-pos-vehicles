import React from "react";
import "../../../styles/accountant/vehicles.css";

export default function VehicleShow({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <div className="modal-header">
          <h3>Vehicle Details</h3>
          <button className="close-btn" onClick={onClose}>
            ✖
          </button>
        </div>

        {/* -------- Images Section -------- */}
        {vehicle.images && vehicle.images.length > 0 && (
          <div className="vehicle-images">
            {vehicle.images.map((img, index) => (
              <img key={index} src={img} alt={`Vehicle ${index + 1}`} />
            ))}
          </div>
        )}

        {/* -------- Info Section -------- */}
        <div className="vehicle-info-grid">
          <div className="info-item">
            <label>VIN:</label>
            <span>{vehicle.VIN || "—"}</span>
          </div>

          <div className="info-item">
            <label>Make:</label>
            <span>{vehicle.make || "—"}</span>
          </div>

          <div className="info-item">
            <label>Model:</label>
            <span>{vehicle.model || "—"}</span>
          </div>

          <div className="info-item">
            <label>Year:</label>
            <span>{vehicle.year || "—"}</span>
          </div>

          <div className="info-item">
            <label>Type:</label>
            <span>{vehicle.type || "—"}</span>
          </div>

          <div className="info-item">
            <label>Transmission:</label>
            <span>{vehicle.transmission || "—"}</span>
          </div>

          <div className="info-item">
            <label>Fuel Type:</label>
            <span>{vehicle.fuelType || "—"}</span>
          </div>

          <div className="info-item">
            <label>Cylinders:</label>
            <span>{vehicle.cylinders || "—"}</span>
          </div>

          <div className="info-item">
            <label>Condition:</label>
            <span>{vehicle.condition || "—"}</span>
          </div>

          <div className="info-item">
            <label>Status:</label>
            <span className={`status ${vehicle.status?.toLowerCase()}`}>
              {vehicle.status || "—"}
            </span>
          </div>

          <div className="info-item">
            <label>Color:</label>
            <div
              className="color-box"
              style={{ backgroundColor: vehicle.color || "#ccc" }}
            ></div>
          </div>

          <div className="info-item">
            <label>Price:</label>
            <span>${vehicle.price?.toLocaleString() || "—"}</span>
          </div>

          <div className="info-item">
            <label>Cost:</label>
            <span>${vehicle.cost?.toLocaleString() || "—"}</span>
          </div>

          <div className="info-item">
            <label>Purchase Date:</label>
            <span>{vehicle.purchaseDate || "—"}</span>
          </div>

          <div className="info-item">
            <label>Insurance Provider:</label>
            <span>{vehicle.insuranceProvider || "—"}</span>
          </div>

          <div className="info-item">
            <label>Insurance Expiry:</label>
            <span>{vehicle.insuranceExpiry || "—"}</span>
          </div>

          <div className="info-item">
            <label>Maintenance Cost:</label>
            <span>${vehicle.maintenanceCost?.toLocaleString() || "—"}</span>
          </div>

          <div className="info-item">
            <label>Fuel Cost:</label>
            <span>${vehicle.fuelCost?.toLocaleString() || "—"}</span>
          </div>
        </div>

        {/* -------- Close Button -------- */}
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
