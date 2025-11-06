const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");
const Sale = require("../models/Sale"); // ✅ Needed for recalculating totals

/* ==========================================================
   🧾 CREATE a new customer
   ========================================================== */
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Customer already exists." });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      totalSpent: 0,
      purchaseCount: 0,
    });

    res.status(201).json(customer);
  } catch (err) {
    console.error("❌ Error adding customer:", err);
    res.status(500).json({ message: "Server error while adding customer." });
  }
});

/* ==========================================================
   📋 GET all customers
   ========================================================== */
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error("❌ Error fetching customers:", err);
    res.status(500).json({ message: "Error fetching customers." });
  }
});

/* ==========================================================
   💰 UPDATE totals for a single customer (recalculate all sales)
   ========================================================== */
router.post("/updateTotals", async (req, res) => {
  try {
    const { customerId } = req.body;
    if (!customerId)
      return res.status(400).json({ message: "Customer ID is required" });

    // 🔹 Find all sales linked to this customer
    const sales = await Sale.find({ customerId });
    const totalSpent = sales.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
    const purchaseCount = sales.length;

    // 🔹 Update in database
    const updated = await Customer.findByIdAndUpdate(
      customerId,
      { totalSpent, purchaseCount },
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Customer not found" });

    res.json({
      message: "✅ Totals recalculated successfully",
      customer: updated,
      totalSpent,
      purchaseCount,
    });
  } catch (err) {
    console.error("❌ Error recalculating totals:", err);
    res.status(500).json({ message: "Failed to recalc totals", error: err.message });
  }
});

/* ==========================================================
   ✏️ UPDATE a customer (general info)
   ========================================================== */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Customer not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating customer:", err);
    res.status(500).json({ message: "Failed to update customer." });
  }
});

/* ==========================================================
   🗑️ DELETE a customer
   ========================================================== */
router.delete("/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting customer:", err);
    res.status(500).json({ message: "Failed to delete customer." });
  }
});

module.exports = router;
