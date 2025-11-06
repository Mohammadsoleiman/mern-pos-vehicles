const Customer = require("../models/Customer");

// 📥 Get all customers
exports.getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error("❌ Error fetching customers:", error);
    res.status(500).json({ message: "Failed to fetch customers" });
  }
};

// ➕ Add new customer
exports.addCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone)
      return res.status(400).json({ message: "All fields are required" });

    const existing = await Customer.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Customer already exists" });

    const newCustomer = new Customer({ name, email, phone });
    const saved = await newCustomer.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Error adding customer:", error);
    res.status(500).json({ message: "Failed to add customer" });
  }
};

// ✏️ Update customer info
exports.updateCustomer = async (req, res) => {
  try {
    const updated = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Customer not found" });
    res.json(updated);
  } catch (error) {
    console.error("❌ Error updating customer:", error);
    res.status(500).json({ message: "Failed to update customer" });
  }
};

// 🗑️ Delete customer
exports.deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Customer not found" });
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting customer:", error);
    res.status(500).json({ message: "Failed to delete customer" });
  }
};

// 🔍 Get customer by ID
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    res.json(customer);
  } catch (error) {
    console.error("❌ Error getting customer:", error);
    res.status(500).json({ message: "Failed to get customer" });
  }
};

// 💰 Update totals after sale
exports.updateCustomerTotals = async (req, res) => {
  try {
    const { customerId, amount } = req.body;
    const customer = await Customer.findById(customerId);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    customer.totalSpent += amount;
    customer.purchases += 1;
    await customer.save();

    res.json(customer);
  } catch (error) {
    console.error("❌ Error updating totals:", error);
    res.status(500).json({ message: "Failed to update customer totals" });
  }
};
