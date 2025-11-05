const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");

// CREATE a sale
router.post("/", async (req, res) => {
  try {
    const count = await Sale.countDocuments();
    const invoiceNumber = `INV-${(count + 1).toString().padStart(3, "0")}`;
    const sale = await Sale.create({ ...req.body, invoiceNumber });
    res.status(201).json(sale);
  } catch (err) {
    console.error("Error saving sale:", err);
    res.status(500).json({ message: "Error saving sale", error: err.message });
  }
});

// GET all sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("vehicleId")
      .populate("customerId")
      .sort({ date: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// FILTER by date range
router.get("/range", async (req, res) => {
  const { start, end } = req.query;
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const sales = await Sale.find({
      date: { $gte: startDate, $lte: endDate },
    })
      .populate("vehicleId")
      .populate("customerId");
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
