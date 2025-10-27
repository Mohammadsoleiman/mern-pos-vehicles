// client/src/pages/admin/VehicleCreate.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "../../styles/vehicles.css";

export default function VehicleCreate() {
  const navigate = useNavigate();
  const [previews, setPreviews] = useState([]);

  const [form, setForm] = useState({
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

  // 🔹 Handle text/select inputs
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // 🔹 Handle image uploads (multiple)
  const handleImages = (e) => {
    const newFiles = Array.from(e.target.files);
    const allFiles = [...(form.images || []), ...newFiles];
    setForm({ ...form, images: allFiles });

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // 🔹 Remove image preview before submitting
  const handleRemoveImage = (index) => {
    const updatedImages = [...form.images];
    const updatedPreviews = [...previews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setForm({ ...form, images: updatedImages });
    setPreviews(updatedPreviews);
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in form) {
      if (key === "images") {
        form.images.forEach((file) => data.append("images", file));
      } else {
        data.append(key, form[key]);
      }
    }

    try {
      await axiosClient.post("/vehicles", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Vehicle added successfully!");
      navigate("/admin/vehicles");
    } catch (err) {
      console.error(err);
      alert("❌ Error creating vehicle");
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">Add Vehicle</h2>

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="form-grid">

          {/* BASIC INFO */}
          <div><label>VIN *</label><input name="VIN" value={form.VIN} onChange={handleChange} required /></div>
          <div><label>Make *</label>
            <select name="make" value={form.make} onChange={handleChange}>
              <option>Toyota</option><option>Kia</option><option>BMW</option>
              <option>Mercedes</option><option>Ford</option><option>Nissan</option>
            </select>
          </div>
          <div><label>Model *</label><input name="model" value={form.model} onChange={handleChange} required /></div>
          <div><label>Year *</label><input type="number" name="year" value={form.year} onChange={handleChange} required /></div>

          {/* OTHER FIELDS */}
          <div><label>Type</label>
            <select name="type" value={form.type} onChange={handleChange}>
              <option>Sedan</option><option>SUV</option><option>Truck</option><option>Coupe</option><option>Van</option>
            </select>
          </div>
          <div><label>Price *</label><input type="number" name="price" value={form.price} onChange={handleChange} required /></div>
          <div><label>Cost</label><input type="number" name="cost" value={form.cost} onChange={handleChange} /></div>
          <div><label>Maintenance Cost</label><input type="number" name="maintenanceCost" value={form.maintenanceCost} onChange={handleChange} /></div>
          <div><label>Fuel Cost</label><input type="number" name="fuelCost" value={form.fuelCost} onChange={handleChange} /></div>

          {/* DATES */}
          <div><label>Purchase Date</label><input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} /></div>
          <div><label>Insurance Provider</label><input name="insuranceProvider" value={form.insuranceProvider} onChange={handleChange} /></div>
          <div><label>Insurance Expiry</label><input type="date" name="insuranceExpiry" value={form.insuranceExpiry} onChange={handleChange} /></div>

          {/* TECHNICAL */}
          <div><label>Fuel Type</label>
            <select name="fuelType" value={form.fuelType} onChange={handleChange}>
              <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
            </select>
          </div>
          <div><label>Transmission</label>
            <select name="transmission" value={form.transmission} onChange={handleChange}>
              <option>Automatic</option><option>Manual</option>
            </select>
          </div>
          <div><label>Cylinders</label>
            <select name="cylinders" value={form.cylinders} onChange={handleChange}>
              <option>4</option><option>6</option><option>8</option><option>Electric</option>
            </select>
          </div>
          <div><label>Condition</label>
            <select name="condition" value={form.condition} onChange={handleChange}>
              <option>New</option><option>Used</option>
            </select>
          </div>
          <div><label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option>Active</option><option>Sold</option><option>Maintenance</option>
            </select>
          </div>
          <div><label>Color</label><input type="color" name="color" value={form.color} onChange={handleChange} /></div>

          {/* IMAGES */}
          <div className="upload-section">
            <label>Upload Images (Multiple)</label>
            <input type="file" multiple accept="image/*" onChange={handleImages} />
            <div className="preview-multi">
              {previews.map((src, i) => (
                <div key={i} className="image-wrapper">
                  <img src={src} alt="Preview" className="preview" />
                  <button type="button" className="remove-btn" onClick={() => handleRemoveImage(i)}>❌</button>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="form-actions">
            <button type="submit" className="btn-primary">Save</button>
            <button type="button" className="btn-cancel" onClick={() => navigate("/admin/vehicles")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
