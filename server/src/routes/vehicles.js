// server/src/routes/vehicles.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const Vehicle = require("../models/Vehicle"); // ✅ Import model for lowstock route
const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

/* ==========================================================
   🚨 GET vehicles with low stock (less than 5)
   ========================================================== */
// ⚠️ Place this BEFORE /:id so it isn't mistaken for an ID
router.get("/lowstock", async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 5;

    const vehicles = await Vehicle.find({ stock: { $lt: threshold } })
      .sort({ stock: 1 })
      .select("make model stock price");

    res.status(200).json({
      message: "✅ Low stock vehicles fetched successfully",
      total: vehicles.length,
      vehicles,
    });
  } catch (err) {
    console.error("❌ Error fetching low stock vehicles:", err);
    res.status(500).json({
      message: "❌ Failed to fetch low stock vehicles",
      error: err.message,
    });
  }
});

/* ==========================================================
   🚗 VEHICLE CRUD ROUTES
   ========================================================== */

// name = "images" (نفس اسم الحقل في frontend)
router.post("/", upload.array("images", 10), createVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicle);
router.put("/:id", upload.array("images", 10), updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;
