// server/src/models/Employee.js
const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    salary: { type: Number, required: true },
    joinDate: { type: Date, required: true },
    status: { 
      type: String, 
      enum: ["Active", "Inactive"], 
      default: "Active" 
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", employeeSchema);
