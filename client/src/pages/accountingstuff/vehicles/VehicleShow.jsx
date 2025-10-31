import React, { useEffect, useState } from "react";
import "../../../styles/accountant/vehicles.css";
import { getVehicle, imgUrl } from "../../../api/vehicles";

export default function VehicleShow({ vehicle, onClose }) {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load full vehicle details
  useEffect(() => {
    if (!vehicle?._id) return;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getVehicle(vehicle._id);
        setDetails(data);
      } catch (err) {
        console.error("❌ Error loading vehicle:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [vehicle]);

  if (!vehicle) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content large">
        <h3>Vehicle Details</h3>

        {loading ? (
          <p>Loading vehicle data...</p>
        ) : (
          <div className="vehicle-details">
            {/* Images Section */}
            <div className="vehicle-images">
              {details?.images?.length > 0 ? (
                details.images.map((img, idx) => (
                  <img key={idx} src={imgUrl(img)} alt={`Vehicle ${idx}`} />
                ))
              ) : (
                <p>No images available</p>
              )}
            </div>

            {/* Info Grid */}
            <div className="vehicle-info-grid">
              <div className="info-item">
                <strong>VIN:</strong> {details.VIN}
              </div>
              <div className="info-item">
                <strong>Make:</strong> {details.make}
              </div>
              <div className="info-item">
                <strong>Model:</strong> {details.model}
              </div>
              <div className="info-item">
                <strong>Year:</strong> {details.year}
              </div>
              <div className="info-item">
                <strong>Type:</strong> {details.type}
              </div>
              <div className="info-item">
                <strong>Condition:</strong> {details.condition}
              </div>
              <div className="info-item">
                <strong>Transmission:</strong> {details.transmission}
              </div>
              <div className="info-item">
                <strong>Cylinders:</strong> {details.cylinders}
              </div>
              <div className="info-item">
                <strong>Fuel Type:</strong> {details.fuelType}
              </div>
              <div className="info-item">
                <strong>Color:</strong>{" "}
                <span
                  className="color-box"
                  style={{ backgroundColor: details.color }}
                ></span>
              </div>
              <div className="info-item">
                <strong>Price:</strong> ${details.price?.toLocaleString()}
              </div>
              <div className="info-item">
                <strong>Cost:</strong> ${details.cost?.toLocaleString()}
              </div>
              <div className="info-item">
                <strong>Purchase Date:</strong>{" "}
                {details.purchaseDate
                  ? new Date(details.purchaseDate).toLocaleDateString()
                  : "—"}
              </div>
              <div className="info-item">
                <strong>Insurance Provider:</strong>{" "}
                {details.insuranceProvider || "—"}
              </div>
              <div className="info-item">
                <strong>Insurance Expiry:</strong>{" "}
                {details.insuranceExpiry
                  ? new Date(details.insuranceExpiry).toLocaleDateString()
                  : "—"}
              </div>
              <div className="info-item">
                <strong>Maintenance Cost:</strong> $
                {details.maintenanceCost?.toLocaleString() || 0}
              </div>
              <div className="info-item">
                <strong>Fuel Cost:</strong> $
                {details.fuelCost?.toLocaleString() || 0}
              </div>
              <div className="info-item">
                <strong>Status:</strong>{" "}
                <span className={`status ${details.status?.toLowerCase()}`}>
                  {details.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
