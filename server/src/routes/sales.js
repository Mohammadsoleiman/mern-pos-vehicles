// server/src/routes/sales.js
const express = require("express");
const router = express.Router();
const {
  getSales,
  addSale,
  updateSale,
  deleteSale,
  getSaleById,
} = require("../controllers/salesController");

// ✅ Get all sales (used in dashboard, reports, etc.)
router.get("/", getSales);

// ✅ Add a new sale (used when completing a sale in POS)
router.post("/", addSale);

// ✅ Get a specific sale by ID (used for invoices)
router.get("/:id", getSaleById);

// ✅ Update sale (optional — used for admin edits)
router.put("/:id", updateSale);

// ✅ Delete sale (optional — used for admin or accountant)
router.delete("/:id", deleteSale);

module.exports = router;
