const Vehicle = require("../models/Vehicle");

// ✅ Helper لتحويل النصوص إلى أرقام أو تواريخ
function normalize(body) {
  const out = { ...body };
  const numFields = ["year", "price", "cost", "maintenanceCost", "fuelCost"];
  numFields.forEach((k) => {
    if (out[k] !== undefined && out[k] !== "") out[k] = Number(out[k]);
  });

  // ✅ تأكد أن التواريخ فعلاً بصيغة صحيحة قبل تحويلها
  const dateFields = ["purchaseDate", "insuranceExpiry"];
  dateFields.forEach((k) => {
    if (out[k] && /^\d{4}-\d{2}-\d{2}/.test(out[k])) {
      out[k] = new Date(out[k]);
    } else {
      delete out[k];
    }
  });

  return out;
}

// ✅ Create Vehicle
const createVehicle = async (req, res) => {
  try {
    const data = normalize(req.body);

    // حفظ الصور
    if (req.files?.length) {
      data.images = req.files.map((f) => `/uploads/${f.filename}`);
    }

    const vehicle = await Vehicle.create(data);
    return res.status(201).json(vehicle);
  } catch (err) {
    if (err?.code === 11000)
      return res.status(409).json({ message: "VIN already exists" });

    console.error("❌ Error creating vehicle:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// ✅ Get All
const getVehicles = async (_req, res) => {
  try {
    const all = await Vehicle.find().sort({ createdAt: -1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get One
const getVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle)
      return res.status(404).json({ message: "Vehicle not found" });
    res.json(vehicle);
  } catch (err) {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// ✅ Update Vehicle (يحافظ على الصور القديمة + يضيف الجديدة)
const updateVehicle = async (req, res) => {
  try {
    const existing = await Vehicle.findById(req.params.id);
    if (!existing)
      return res.status(404).json({ message: "Vehicle not found" });

    const data = normalize(req.body);

    // الصور القديمة: إزالة http://localhost:5000 منها لو موجودة
    const oldImages = JSON.parse(req.body.oldImages || "[]").map((img) =>
      img.replace("http://localhost:5000", "")
    );

    // الصور الجديدة
    const newImages = req.files?.map((f) => `/uploads/${f.filename}`) || [];

    // دمج الصور القديمة + الجديدة
    data.images = [...oldImages, ...newImages];

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    res.json(updated);
  } catch (err) {
    if (err?.code === 11000)
      return res.status(409).json({ message: "VIN already exists" });

    console.error("❌ Error updating vehicle:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ✅ Delete Vehicle
const deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Vehicle deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
};
 