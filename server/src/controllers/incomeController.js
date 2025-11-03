const Income = require("../models/Income");

// ➕ Create income
exports.createIncome = async (req, res) => {
  try {
    const newIncome = await Income.create(req.body);
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// 📜 Get all incomes
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ createdAt: -1 });
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update income
exports.updateIncome = async (req, res) => {
  try {
    const updated = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Income not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ❌ Delete income
exports.deleteIncome = async (req, res) => {
  try {
    const deleted = await Income.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Income not found" });
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
