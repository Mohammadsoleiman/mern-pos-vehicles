import React, { useContext, useState } from "react";
import { VehicleContext } from "../../../context/clerk/VehicleContext";
import { Search, Car, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../../styles/clerk/clerkVehicles.css";

export default function VehicleList() {
  const { vehicles, loading } = useContext(VehicleContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <p style={{ padding: 20 }}>Loading vehicles...</p>;

  const filteredVehicles = vehicles.filter(v =>
    `${v.make} ${v.model}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
         {/* <select
    className="add-vehicle-btn"
    onChange={(e) => {
      if (!e.target.value) return;
      navigate(`/cashier/inventory/${e.target.value}`);
    }}
  >
    <option value="">More...</option>
    <option value="accessories">Accessories</option>
    <option value="parts">Parts</option>
    <option value="services">Services</option>
  </select> */}
      </div>

      <div className="vehicles-grid">
        {filteredVehicles.map((v) => (
          <div key={v._id} className="vehicle-card">

            {/* ✅ Image Fix */}
            <img
              src={
                v.images?.length
                  ? (v.images[0].startsWith("http") ? v.images[0] : `http://localhost:5000${v.images[0]}`)
                  : "/no-image.png"
              }
              alt={`${v.make} ${v.model}`}
            />

            <h3>{v.make} {v.model}</h3>
            <p>{v.year} • {v.type}</p>
            <p className="vehicle-price">${v.price}</p>

            <div className="vehicle-actions">
              <button
                className="btn-edit"
                onClick={() => navigate(`/cashier/vehicles/${v._id}`)}
              >
                <Eye size={16}/> Show
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
