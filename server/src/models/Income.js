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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Income", incomeSchema);
