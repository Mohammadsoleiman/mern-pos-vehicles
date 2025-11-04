const Expense = require("../models/Expense");

// 🧮 Helper to get current month name + year
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
};

// 📦 Get all expenses (TEMP: show ALL months)
exports.getExpenses = async (req, res) => {
  try {
    // 🧩 Show all old + new expenses
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (err) {
    console.error("❌ Error fetching expenses:", err);
    res.status(500).json({ error: err.message });
  }
};

// ➕ Add new expense (auto month/date)
exports.addExpense = async (req, res) => {
  try {
    const currentMonth = getCurrentMonth();
    const expense = new Expense({
      ...req.body,
      month: currentMonth,
      date: new Date().toISOString().split("T")[0], // 📅 e.g. 2025-11-04
    });
    await expense.save();
    res.json(expense);
  } catch (err) {
    console.error("❌ Error adding expense:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update expense
exports.updateExpense = async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Expense not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating expense:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete expense
exports.deleteExpense = async (req, res) => {
  try {
    const deleted = await Expense.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting expense:", err);
    res.status(500).json({ error: err.message });
  }
};
