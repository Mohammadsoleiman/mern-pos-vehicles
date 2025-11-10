const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["sale", "service", "other"], required: true },
    amount: { type: Number, required: true },
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
