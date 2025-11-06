import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import "../../styles/vehicles.css";

export default function VehicleEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [previews, setPreviews] = useState([]); // الصور القديمة + الجديدة
  const [form, setForm] = useState({
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
      stock: "",
    images: [],
  });

  // ✅ تحميل بيانات السيارة من السيرفر
  useEffect(() => {
    axiosClient
      .get(`/vehicles/${id}`)
      .then((res) => {
        const v = res.data;
        setForm(v);
        if (v.images && Array.isArray(v.images)) {
          const formatted = v.images.map((img) =>
            img.startsWith("http") ? img : `http://localhost:5000${img}`
          );
          setPreviews(formatted);
        }
      })
      .catch(() => alert("❌ Failed to load vehicle data"));
  }, [id]);

  // ✅ تحديث القيم النصية
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ✅ رفع صور جديدة
  const handleImages = (e) => {
    const newFiles = Array.from(e.target.files);
    const allFiles = [...(form.images || []), ...newFiles];
    setForm({ ...form, images: allFiles });

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  // ✅ حذف صورة من القائمة
  const handleRemoveImage = (index) => {
    const updatedImages = [...form.images];
    const updatedPreviews = [...previews];
    updatedImages.splice(index, 1);
    updatedPreviews.splice(index, 1);
    setForm({ ...form, images: updatedImages });
    setPreviews(updatedPreviews);
  };

  // ✅ إرسال النموذج للتحديث
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // 🧩 الحقول النصية والرقمية
    for (const key in form) {
      if (key === "images") continue;
      if (form[key] !== undefined && form[key] !== null)
        data.append(key, form[key]);
    }

    // 🧩 إرسال الصور القديمة بدون http://localhost:5000
    const oldImages = previews
      .filter((p) => !p.startsWith("blob:"))
      .map((url) => url.replace("http://localhost:5000", ""));
    data.append("oldImages", JSON.stringify(oldImages));

    // 🧩 إرسال الصور الجديدة فقط
    if (Array.isArray(form.images)) {
      form.images.forEach((file) => {
        if (file instanceof File) data.append("images", file);
      });
    }

    try {
      await axiosClient.put(`/vehicles/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Vehicle updated successfully!");
      navigate("/admin/vehicles");
    } catch (err) {
      console.error("❌ Error updating vehicle:", err);
      alert("❌ Error updating vehicle");
    }
  };

  return (
    <div className="page">
      <h2 className="page-title">Edit Vehicle</h2>

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="form-grid">

          {/* BASIC INFO */}
          <div><label>VIN *</label><input name="VIN" value={form.VIN || ""} onChange={handleChange} required /></div>

          <div>
            <label>Make *</label>
            <select name="make" value={form.make || "Toyota"} onChange={handleChange}>
              <option>Toyota</option><option>Kia</option><option>BMW</option>
              <option>Mercedes</option><option>Ford</option><option>Nissan</option>
            </select>
          </div>

          <div><label>Model *</label><input name="model" value={form.model || ""} onChange={handleChange} required /></div>
          <div><label>Year *</label><input type="number" name="year" value={form.year || ""} onChange={handleChange} required /></div>

          {/* PRICES */}
          <div><label>Price *</label><input type="number" name="price" value={form.price || ""} onChange={handleChange} required /></div>
          <div>
  <label>Stock (Quantity)</label>
  <input type="number" name="stock" value={form.stock || ""} onChange={handleChange} />
</div>

          <div><label>Cost</label><input type="number" name="cost" value={form.cost || ""} onChange={handleChange} /></div>
          <div><label>Maintenance Cost</label><input type="number" name="maintenanceCost" value={form.maintenanceCost || ""} onChange={handleChange} /></div>
          <div><label>Fuel Cost</label><input type="number" name="fuelCost" value={form.fuelCost || ""} onChange={handleChange} /></div>

          {/* DATES */}
          <div><label>Purchase Date</label><input type="date" name="purchaseDate" value={form.purchaseDate ? form.purchaseDate.slice(0, 10) : ""} onChange={handleChange} /></div>
          <div><label>Insurance Provider</label><input name="insuranceProvider" value={form.insuranceProvider || ""} onChange={handleChange} /></div>
          <div><label>Insurance Expiry</label><input type="date" name="insuranceExpiry" value={form.insuranceExpiry ? form.insuranceExpiry.slice(0, 10) : ""} onChange={handleChange} /></div>

          {/* TECHNICAL */}
          <div><label>Fuel Type</label>
            <select name="fuelType" value={form.fuelType || "Petrol"} onChange={handleChange}>
              <option>Petrol</option><option>Diesel</option><option>Electric</option><option>Hybrid</option>
            </select>
          </div>
          <div><label>Transmission</label>
            <select name="transmission" value={form.transmission || "Automatic"} onChange={handleChange}>
              <option>Automatic</option><option>Manual</option>
            </select>
          </div>
          <div><label>Cylinders</label>
            <select name="cylinders" value={form.cylinders || "4"} onChange={handleChange}>
              <option>4</option><option>6</option><option>8</option><option>Electric</option>
            </select>
          </div>
          <div><label>Condition</label>
            <select name="condition" value={form.condition || "New"} onChange={handleChange}>
              <option>New</option><option>Used</option>
            </select>
          </div>
          <div><label>Status</label>
            <select name="status" value={form.status || "Active"} onChange={handleChange}>
              <option>Active</option><option>Sold</option><option>Maintenance</option>
            </select>
          </div>
          <div><label>Color</label><input type="color" name="color" value={form.color || "#000000"} onChange={handleChange} /></div>

          {/* IMAGES SECTION */}
          <div className="upload-section">
            <label>Images</label>
            <input type="file" multiple accept="image/*" onChange={handleImages} />
            <div className="preview-multi">
              {previews.map((src, i) => (
                <div key={i} className="image-wrapper">
                  <img src={src} alt={`Vehicle ${i}`} className="preview" />
                  <button type="button" className="remove-btn" onClick={() => handleRemoveImage(i)}>✖</button>
                </div>
              ))}
            </div>
          </div>

          {/* ACTIONS */}
          <div className="form-actions">
            <button type="submit" className="btn-primary">Update</button>
            <button type="button" className="btn-cancel" onClick={() => navigate("/admin/vehicles")}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
