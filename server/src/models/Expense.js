const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    company: String,
    quantity: { type: Number, default: 1 },
    unitCost: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    paid: { type: Boolean, default: false },
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0], // 📅 default to today's date
    },
    month: { // ✅ auto set current month for filtering
      type: String,
      default: () => {
        const now = new Date();
        return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Expense", expenseSchema);
