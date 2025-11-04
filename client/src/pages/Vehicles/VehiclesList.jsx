// client/src/pages/admin/VehicleList.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { useSettings } from "../../context/SettingsContext"; // ✅ مهم
import "../../styles/usersGrid.css"; // ✅ نفس ملف Users grid
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import "../../styles/vehicles.css";

export default function VehiclesList() {
  const navigate = useNavigate();
  const { settings } = useSettings(); // ✅ أخذنا الـ Layout من الإعدادات
  const layout = settings.layout || "list"; // "list" أو "grid"

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imageIndexes, setImageIndexes] = useState({});
  const itemsPerPage = 5;

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const { data } = await axiosClient.get("/vehicles");
      setVehicles(data);
      const startIndexes = {};
      data.forEach((v) => (startIndexes[v._id] = 0));
      setImageIndexes(startIndexes);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  // 🔹 Image slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndexes((prev) => {
        const updated = { ...prev };
        vehicles.forEach((v) => {
          if (v.images?.length > 1) {
            updated[v._id] = (prev[v._id] + 1) % v.images.length;
          }
        });
        return updated;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [vehicles]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      await axiosClient.delete(`/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
    } catch {
      alert("❌ Error deleting vehicle");
    }
  };

  // 🔹 Statistics for chart
  const stats = {
    total: vehicles.length,
    active: vehicles.filter((v) => v.status === "Active").length,
    sold: vehicles.filter((v) => v.status === "Sold").length,
    maintenance: vehicles.filter((v) => v.status === "Maintenance").length,
  };

  const chartData = [
    { name: "Active", value: stats.active },
    { name: "Sold", value: stats.sold },
    { name: "Maintenance", value: stats.maintenance },
  ];

  const COLORS = ["#2ecc71", "#e74c3c", "#f1c40f"];

  const filtered = vehicles.filter((v) =>
    v.model?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="page">
      <h2 className="page-title">Vehicles Dashboard</h2>

      {/* 🔹 Stats Cards + Chart */}
      <div className="dashboard-section">
        <div className="stats-container">
          <div className="stat-card total">
            <h4>Total Vehicles</h4>
            <p>{stats.total}</p>
          </div>
          <div className="stat-card active">
            <h4>Active</h4>
            <p>{stats.active}</p>
          </div>
          <div className="stat-card sold">
            <h4>Sold</h4>
            <p>{stats.sold}</p>
          </div>
          <div className="stat-card maint">
            <h4>Maintenance</h4>
            <p>{stats.maintenance}</p>
          </div>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 13, fontWeight: 500 }} />
              <YAxis tick={{ fill: '#666', fontSize: 13 }} />
              <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '10px 14px' }} cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🔹 Search + Add */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <button className="btn-primary" onClick={() => navigate("/admin/vehicles/create")}>
          + Add Vehicle
        </button>
      </div>

      {/* ✅ LIST MODE */}
      {layout === "list" && (
        <div className="card table-card">
          <table className="vehicles-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Model</th>
                <th>Year</th>
                <th>Type</th>
                <th>Status</th>
                <th>Price</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: "center" }}>No vehicles found</td></tr>
              ) : (
                paginated.map((v) => {
                  const currentIndex = imageIndexes[v._id] || 0;
                  const currentImage = v.images?.[currentIndex]
                    ? v.images[currentIndex].startsWith("http")
                      ? v.images[currentIndex]
                      : `http://localhost:5000${v.images[currentIndex]}`
                    : null;

                  return (
                    <tr key={v._id}>
                      <td><img src={currentImage} alt={v.model} className="vehicle-thumb fade-in" /></td>
                      <td>{v.model}</td>
                      <td>{v.year}</td>
                      <td>{v.type}</td>
                      <td><span className={`status-badge status-${v.status?.toLowerCase()}`}>{v.status}</span></td>
                      <td>${v.price}</td>
                      <td className="actions">
                        <button className="btn-sm btn-info" onClick={() => navigate(`/admin/vehicles/show/${v._id}`)}>👁</button>
                        <button className="btn-sm btn-edit" onClick={() => navigate(`/admin/vehicles/edit/${v._id}`)}>✏</button>
                        <button className="btn-sm btn-danger" onClick={() => handleDelete(v._id)}>🗑</button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ GRID MODE */}
      {layout === "grid" && (
        <div className="vehicles-grid">
          {filtered.map((v) => {
           const currentIndex = imageIndexes[v._id] || 0;
const currentImage = v.images?.[currentIndex]
  ? v.images[currentIndex].startsWith("http")
    ? v.images[currentIndex]
    : `http://localhost:5000${v.images[currentIndex]}`
  : null;

            return (
              <div className="vehicle-card" key={v._id}>
                <img src={currentImage} className="vehicle-img" />
                <h3>{v.model}</h3>
                <p>{v.year} • {v.type}</p>
                <span className={`status-badge status-${v.status?.toLowerCase()}`}>{v.status}</span>
                <p className="price">${v.price}</p>
                <div className="card-actions">
                  <button className="btn-sm btn-info" onClick={() => navigate(`/admin/vehicles/show/${v._id}`)}>👁</button>
                  <button className="btn-sm btn-edit" onClick={() => navigate(`/admin/vehicles/edit/${v._id}`)}>✏</button>
                  <button className="btn-sm btn-danger" onClick={() => handleDelete(v._id)}>🗑</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button className="page-btn" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>◀ Prev</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} className={`page-btn ${currentPage === i + 1 ? "active" : ""}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
        ))}
        <button className="page-btn" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next ▶</button>
      </div>
    </div>
  );
}
