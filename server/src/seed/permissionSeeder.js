const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const Permission = require("../models/Permission");

const permissions = [
  // DASHBOARD
  { name: "dashboard.show" },

  // VEHICLE
  { name: "vehicle.create" },
  { name: "vehicle.edit" },
  { name: "vehicle.show" },
  { name: "vehicle.delete" },

  // USERS
  { name: "user.create" },
  { name: "user.edit" },
  { name: "user.show" },
  { name: "user.delete" },

  // REPORT
  { name: "report.show" },

  // CUSTOMER
  { name: "customer.create" },
  { name: "customer.edit" },
  { name: "customer.show" },
  { name: "customer.delete" },

  // SALES
  { name: "sales.create" },
  { name: "sales.edit" },
  { name: "sales.show" },
  { name: "sales.delete" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected");

    await Permission.deleteMany();
    console.log("🗑️ Previous permissions cleared");

    await Permission.insertMany(permissions);
    console.log("🔐 Permissions Seeded Successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

seed();
