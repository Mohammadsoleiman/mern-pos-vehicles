const mongoose = require("mongoose");

const incomeSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ["Vehicle Sale", "Service & Maintenance", "Taxes", "Other Services"],
      required: true,
    },
    type: { type: String, default: "" },
    model: { type: String, default: "" },
    plate: { type: String, default: "" },
    vin: { type: String, default: "" },
    cost: { type: Number, required: true },
    serviceType: { type: String, default: "" },
    servicePart: { type: String, default: "" },
    taxType: { type: String, default: "" },
    description: { type: String, default: "" },

    // 🗓️ Automatically save today's date (YYYY-MM-DD)
    date: {
      type: String,
      default: () => new Date().toISOString().split("T")[0],
    },

    // 📅 Automatically store month name and year
    month: {
      type: String,
      default: () => {
        const now = new Date();
        return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`;
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
