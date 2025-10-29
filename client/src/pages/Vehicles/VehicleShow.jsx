// client/src/pages/admin/VehicleShow.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "../../styles/vehicles.css";

export default function VehicleShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);

  // 🔹 تحميل بيانات السيارة
  useEffect(() => {
    axiosClient
      .get(`/vehicles/${id}`)
      .then((res) => setVehicle(res.data))
      .catch(() => alert("❌ Failed to load vehicle details"));
  }, [id]);

  if (!vehicle) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div className="page">
      <h2 className="page-title">Vehicle Details</h2>

      <div className="card vehicle-card">

        {/* ✅ الصور */}
        <div className="preview-multi">
          {vehicle.images?.length ? (
            vehicle.images.map((img, i) => (
              <div key={i} className="image-wrapper">
                <img
                  src={
                    img.startsWith("http")
                      ? img
                      : `http://localhost:5000${img}`
                  }
                  alt={`Vehicle ${i + 1}`}
                  className="preview"
                />
              </div>
            ))
          ) : (
            <p style={{ color: "#777" }}>No images available</p>
          )}
        </div>

        {/* ✅ معلومات السيارة */}
        <div className="info-grid">
          <div><b>VIN:</b> {vehicle.VIN}</div>
          <div><b>Make:</b> {vehicle.make}</div>
          <div><b>Model:</b> {vehicle.model}</div>
          <div><b>Year:</b> {vehicle.year}</div>
          <div><b>Type:</b> {vehicle.type}</div>
          <div><b>Status:</b> {vehicle.status}</div>
          <div><b>Condition:</b> {vehicle.condition}</div>
          <div><b>Transmission:</b> {vehicle.transmission}</div>
          <div><b>Fuel Type:</b> {vehicle.fuelType}</div>
          <div><b>Cylinders:</b> {vehicle.cylinders}</div>
          <div>
            <b>Color:</b>{" "}
            <span
              style={{
                background: vehicle.color,
                padding: "4px 10px",
                borderRadius: "6px",
                color: "#fff",
                border: "1px solid #ccc",
              }}
            >
              {vehicle.color}
            </span>
          </div>
          <div><b>Price:</b> ${vehicle.price}</div>
          <div><b>Cost:</b> ${vehicle.cost}</div>
          <div><b>Maintenance Cost:</b> ${vehicle.maintenanceCost}</div>
          <div><b>Fuel Cost:</b> ${vehicle.fuelCost}</div>
          <div>
            <b>Purchase Date:</b>{" "}
            {vehicle.purchaseDate
              ? new Date(vehicle.purchaseDate).toLocaleDateString()
              : "—"}
          </div>
          <div><b>Insurance Provider:</b> {vehicle.insuranceProvider}</div>
          <div>
            <b>Insurance Expiry:</b>{" "}
            {vehicle.insuranceExpiry
              ? new Date(vehicle.insuranceExpiry).toLocaleDateString()
              : "—"}
          </div>
        </div>

        {/* ✅ أزرار */}
        <div className="actions-bar">
          <button
            className="btn-edit"
            onClick={() => navigate(`/admin/vehicles/edit/${id}`)}
          >
            ✏ Edit
          </button>
          <button
            className="btn-cancel"
            onClick={() => navigate("/admin/vehicles")}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}
