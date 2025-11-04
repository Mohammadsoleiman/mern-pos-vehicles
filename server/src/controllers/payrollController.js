const Payroll = require("../models/Payroll");

// 🧮 Helper to get the current month name + year
const getCurrentMonth = () => {
  const now = new Date();
  return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
};

// 👀 Get payroll records (TEMP: show ALL months)
exports.getPayroll = async (req, res) => {
  try {
    // 🧩 Show everything (old + new)
    const payrolls = await Payroll.find().sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (err) {
    console.error("❌ Error fetching payrolls:", err);
    res.status(500).json({ error: err.message });
  }
};

// ➕ Add new payroll record (auto month/date)
exports.addPayroll = async (req, res) => {
  try {
    const currentMonth = getCurrentMonth();
    const payroll = new Payroll({
      ...req.body,
      month: currentMonth,
      date: new Date().toISOString().split("T")[0], // 📅 YYYY-MM-DD
    });

    await payroll.save();
    res.json(payroll);
  } catch (err) {
    console.error("❌ Error adding payroll:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update payroll record
exports.updatePayroll = async (req, res) => {
  try {
    const updated = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Payroll not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating payroll:", err);
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete payroll record
exports.deletePayroll = async (req, res) => {
  try {
    const deleted = await Payroll.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Payroll not found" });
    res.json({ message: "Payroll record deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting payroll:", err);
    res.status(500).json({ error: err.message });
  }
};
