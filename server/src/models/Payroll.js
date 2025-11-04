const mongoose = require("mongoose");

const payrollSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: String,
    salary: { type: Number, required: true },
    deduction: { type: Number, default: 0 },
    bonus: { type: Number, default: 0 },
    totalPaid: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0], // 📅 today's date by default
    },
    month: { // ✅ auto-assign current month and year
      type: String,
      default: () => {
        const now = new Date();
        return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payroll", payrollSchema);
