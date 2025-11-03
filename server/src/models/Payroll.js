const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  salary: { type: Number, required: true },
  deduction: { type: Number, default: 0 },
  bonus: { type: Number, default: 0 },
  totalPaid: { type: Number, default: 0 },
  paid: { type: Boolean, default: false },
  date: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Payroll", payrollSchema);
