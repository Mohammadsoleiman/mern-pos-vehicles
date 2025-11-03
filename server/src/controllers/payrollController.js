const Payroll = require("../models/Payroll");

// 👀 Get all payroll records
exports.getPayroll = async (req, res) => {
  try {
    const payrolls = await Payroll.find().sort({ createdAt: -1 });
    res.json(payrolls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ➕ Add payroll record
exports.addPayroll = async (req, res) => {
  try {
    const payroll = new Payroll(req.body);
    await payroll.save();
    res.json(payroll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✏️ Update payroll record
exports.updatePayroll = async (req, res) => {
  try {
    const updated = await Payroll.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🗑️ Delete payroll record
exports.deletePayroll = async (req, res) => {
  try {
    await Payroll.findByIdAndDelete(req.params.id);
    res.json({ message: "Payroll record deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
