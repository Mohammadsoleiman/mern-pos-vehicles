const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    account: { type: String, required: true },
    type: {
      type: String,
      enum: ["Asset", "Liability", "Equity"],
      default: "Asset",
    },
    balance: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
