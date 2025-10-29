// server/src/routes/vehicles.js
const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deleteVehicle,
} = require("../controllers/vehicleController");

// name = "images" (نفس اسم الحقل في frontend)
router.post("/", upload.array("images", 10), createVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicle);
router.put("/:id", upload.array("images", 10), updateVehicle);
router.delete("/:id", deleteVehicle);

module.exports = router;
