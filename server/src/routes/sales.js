// server/src/routes/sales.js
const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");

// 🧾 CREATE a new Sale
router.post("/", async (req, res) => {
  try {
    const count = await Sale.countDocuments();
    const invoiceNumber = `INV-${(count + 1).toString().padStart(4, "0")}`;

    const sale = await Sale.create({
      ...req.body,
      invoiceNumber,
      status: "completed",
    });

    res.status(201).json(sale);
  } catch (err) {
    console.error("❌ Error saving sale:", err);
    res
      .status(500)
      .json({ message: "Error saving sale", error: err.message });
  }
});

// 📋 GET all Sales
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("vehicleId", "make model year price")
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 }); // ✅ Fixed sorting field

    res.json(sales);
  } catch (err) {
    console.error("❌ Error fetching sales:", err);
    res.status(500).json({ message: "Failed to fetch sales", error: err.message });
  }
});

// 📆 FILTER Sales by Date Range
router.get("/range", async (req, res) => {
  try {
    const { start, end } = req.query;

    // Validate dates
    if (!start || !end) {
      return res.status(400).json({ message: "Please provide start and end dates" });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const sales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate("vehicleId", "make model year price")
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 });

    res.json(sales);
  } catch (err) {
    console.error("❌ Error filtering sales by date:", err);
    res.status(500).json({ message: "Failed to filter sales", error: err.message });
  }
});

// 🔍 GET a specific Sale by ID
router.get("/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("vehicleId", "make model year price")
      .populate("customerId", "name email phone");

    if (!sale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(sale);
  } catch (err) {
    console.error("❌ Error getting sale by ID:", err);
    res.status(500).json({ message: "Failed to get sale", error: err.message });
  }
});

// ✏️ UPDATE a Sale
router.put("/:id", async (req, res) => {
  try {
    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json(updatedSale);
  } catch (err) {
    console.error("❌ Error updating sale:", err);
    res.status(500).json({ message: "Failed to update sale", error: err.message });
  }
});

// 🗑️ DELETE a Sale
router.delete("/:id", async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);

    if (!deletedSale) {
      return res.status(404).json({ message: "Sale not found" });
    }

    res.json({ message: "Sale deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting sale:", err);
    res.status(500).json({ message: "Failed to delete sale", error: err.message });
  }
});

module.exports = router;
