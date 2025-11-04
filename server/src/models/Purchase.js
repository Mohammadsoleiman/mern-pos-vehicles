const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  company: String,
  quantity: { type: Number, default: 1 },
  unitCost: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  paid: { type: Boolean, default: false },
  date: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Purchase", purchaseSchema);
