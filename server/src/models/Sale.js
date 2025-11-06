// server/src/models/Sale.js
const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    vehicleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cash", "credit_card", "financing"],
      default: "cash",
    },
    invoiceNumber: { type: String, required: true, unique: true },
    status: { type: String, default: "completed" },
  },
  { timestamps: true } // ✅ createdAt + updatedAt
);

module.exports = mongoose.model("Sale", saleSchema);
