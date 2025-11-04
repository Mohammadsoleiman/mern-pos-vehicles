const Income = require("../models/Income");

// 🧮 Helper: get current month name + year
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
};

// 📜 Get all incomes (temporary: show ALL months)
exports.getIncomes = async (req, res) => {
  try {
    const incomes = await Income.find().sort({ createdAt: -1 });
    res.json(incomes);
  } catch (error) {
    console.error("❌ Error fetching incomes:", error);
    res.status(500).json({ message: error.message });
  }
};

// ➕ Create income (auto-assign date + month)
exports.createIncome = async (req, res) => {
  try {
    const currentMonth = getCurrentMonth();
    const income = new Income({
      ...req.body,
      date: new Date().toISOString().split("T")[0], // 📅 e.g. 2025-11-04
      month: currentMonth, // 🗓️ e.g. November 2025
    });

    await income.save();
    res.status(201).json(income);
  } catch (error) {
    console.error("❌ Error creating income:", error);
    res.status(400).json({ message: error.message });
  }
};

// ✏️ Update income
exports.updateIncome = async (req, res) => {
  try {
    const updated = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Income not found" });
    res.json(updated);
  } catch (error) {
    console.error("❌ Error updating income:", error);
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
    console.error("❌ Error deleting income:", error);
    res.status(500).json({ message: error.message });
  }
};
