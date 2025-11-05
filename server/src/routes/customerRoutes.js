const express = require("express");
const router = express.Router();
const Customer = require("../models/Customer");

// ✅ Create a new customer
router.post("/", async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(400).json({
        message: "Customer with this email already exists.",
      });
    }

    const customer = await Customer.create({ name, email, phone });
    res.status(201).json(customer);
  } catch (err) {
    console.error("❌ Error adding customer:", err.message);
    res.status(500).json({ message: "Server error while adding customer." });
  }
});

// ✅ Get all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error("❌ Error fetching customers:", err.message);
    res.status(500).json({ message: "Error fetching customers." });
  }
});

// ✅ Update customer totals (used when sale completes)
router.post("/updateTotals", async (req, res) => {
  const { customerId, amount } = req.body;

  try {
    const updated = await Customer.findByIdAndUpdate(
      customerId,
      { $inc: { totalSpent: amount, purchaseCount: 1 } },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Customer not found" });

    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating totals:", err.message);
    res.status(500).json({ message: "Failed to update customer totals." });
  }
});

// ✅ Delete a customer
router.delete("/:id", async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting customer:", err.message);
    res.status(500).json({ message: "Failed to delete customer." });
  }
});

module.exports = router;
