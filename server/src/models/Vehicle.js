// server/src/models/Vehicle.js
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    VIN: { type: String, required: true, unique: true },
    make: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
    type: {
      type: String,
      enum: ["Sedan", "SUV", "Truck", "Coupe", "Hatchback", "Van"],
      default: "Sedan",
    },
    price: { type: Number, required: true },
    cost: { type: Number, default: 0 },
    purchaseDate: { type: Date },
    insuranceProvider: { type: String },
    insuranceExpiry: { type: Date },
    maintenanceCost: { type: Number },
    fuelCost: { type: Number },
    transmission: {
      type: String,
      enum: ["Automatic", "Manual"],
      default: "Automatic",
    },
    cylinders: {
      type: String,
      enum: ["4", "6", "8", "Electric"],
      default: "4",
    },
    fuelType: {
      type: String,
      enum: ["Petrol", "Diesel", "Electric", "Hybrid"],
      default: "Petrol",
    },
    condition: { type: String, enum: ["New", "Used"], default: "New" },
    color: { type: String, default: "#000000" },
    status: {
      type: String,
      enum: ["Active", "Sold", "Maintenance"],
      default: "Active",
    },
    images: [{ type: String }], // ✅ صور متعددة
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
