// server/routes/sales.js
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Sale = require("../models/Sale");
const Customer = require("../models/Customer");
const Vehicle = require("../models/Vehicle");

/* ==========================================================
   🧾 CREATE a new Sale
   ========================================================== */
router.post("/", async (req, res) => {
  try {
    // Generate invoice number dynamically
    const count = await Sale.countDocuments();
    const invoiceNumber = `INV-${(count + 1).toString().padStart(4, "0")}`;

    // Create new sale
    const sale = await Sale.create({
      ...req.body,
      invoiceNumber,
      status: "completed",
    });

    // Populate for instant frontend usage
    const populatedSale = await sale.populate([
      { path: "customerId", select: "name email phone" },
      { path: "vehicleId", select: "make model year price" },
    ]);

    res.status(201).json({
      message: "✅ Sale created successfully",
      sale: populatedSale,
    });
  } catch (err) {
    console.error("❌ Error saving sale:", err);
    res.status(500).json({
      message: "❌ Error saving sale",
      error: err.message,
    });
  }
});

/* ==========================================================
   📋 GET all Sales (with full population)
   ========================================================== */
router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("vehicleId", "make model year price")
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "✅ Sales fetched successfully",
      total: sales.length,
      sales,
    });
  } catch (err) {
    console.error("❌ Error fetching sales:", err);
    res.status(500).json({
      message: "❌ Failed to fetch sales",
      error: err.message,
    });
  }
});

/* ==========================================================
   📆 FILTER Sales by Date Range
   ========================================================== */
router.get("/range", async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Please provide both start and end dates." });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    const sales = await Sale.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .populate("vehicleId", "make model year price")
      .populate("customerId", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "✅ Sales filtered successfully",
      total: sales.length,
      sales,
    });
  } catch (err) {
    console.error("❌ Error filtering sales by date:", err);
    res.status(500).json({
      message: "❌ Failed to filter sales",
      error: err.message,
    });
  }
});

/* ==========================================================
   🔍 GET a specific Sale by ID
   ========================================================== */
router.get("/:id", async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id)
      .populate("vehicleId", "make model year price")
      .populate("customerId", "name email phone");

    if (!sale) {
      return res.status(404).json({ message: "❌ Sale not found" });
    }

    res.status(200).json({
      message: "✅ Sale found",
      sale,
    });
  } catch (err) {
    console.error("❌ Error fetching sale by ID:", err);
    res.status(500).json({
      message: "❌ Failed to fetch sale",
      error: err.message,
    });
  }
});

/* ==========================================================
   ✏️ UPDATE a Sale
   ========================================================== */
router.put("/:id", async (req, res) => {
  try {
    const updatedSale = await Sale.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
      .populate("vehicleId", "make model year price")
      .populate("customerId", "name email phone");

    if (!updatedSale) {
      return res.status(404).json({ message: "❌ Sale not found" });
    }

    res.status(200).json({
      message: "✅ Sale updated successfully",
      sale: updatedSale,
    });
  } catch (err) {
    console.error("❌ Error updating sale:", err);
    res.status(500).json({
      message: "❌ Failed to update sale",
      error: err.message,
    });
  }
});

/* ==========================================================
   🗑️ DELETE a Sale
   ========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    const deletedSale = await Sale.findByIdAndDelete(req.params.id);
    if (!deletedSale) {
      return res.status(404).json({ message: "❌ Sale not found" });
    }

    res.status(200).json({
      message: "🗑️ Sale deleted successfully",
      id: req.params.id,
    });
  } catch (err) {
    console.error("❌ Error deleting sale:", err);
    res.status(500).json({
      message: "❌ Failed to delete sale",
      error: err.message,
    });
  }
});

/* ==========================================================
   🧰 PATCH /api/sales/repair
   Convert string IDs → ObjectIds + recalc totals
   ========================================================== */
router.patch("/repair", async (req, res) => {
  try {
    const sales = await Sale.find();
    let fixedSales = 0;
    let recalculatedCustomers = 0;

    for (const sale of sales) {
      let updated = false;

      // Fix string IDs → ObjectIds
      if (typeof sale.customerId === "string" && sale.customerId.length === 24) {
        sale.customerId = new mongoose.Types.ObjectId(sale.customerId);
        updated = true;
      }

      if (typeof sale.vehicleId === "string" && sale.vehicleId.length === 24) {
        sale.vehicleId = new mongoose.Types.ObjectId(sale.vehicleId);
        updated = true;
      }

      if (!sale.createdAt) {
        sale.createdAt = new Date();
        updated = true;
      }

      if (updated) {
        await sale.save();
        fixedSales++;
      }
    }

    // Recalculate totals for customers
    const customers = await Customer.find();
    for (const customer of customers) {
      const customerSales = await Sale.find({ customerId: customer._id });
      const totalSpent = customerSales.reduce(
        (sum, s) => sum + (s.totalAmount || 0),
        0
      );
      const purchaseCount = customerSales.length;

      if (
        customer.totalSpent !== totalSpent ||
        customer.purchaseCount !== purchaseCount
      ) {
        customer.totalSpent = totalSpent;
        customer.purchaseCount = purchaseCount;
        await customer.save();
        recalculatedCustomers++;
      }
    }

    res.status(200).json({
      message: "✅ Deep data repair completed successfully",
      fixedSales,
      recalculatedCustomers,
      totalSales: sales.length,
    });
  } catch (err) {
    console.error("❌ Repair error:", err);
    res.status(500).json({
      message: "❌ Repair failed",
      error: err.message,
    });
  }
});

module.exports = router;
