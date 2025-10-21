require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedUsers = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const users = [
      { name: "Admin User", email: "admin@example.com", password: "admin123", role: "admin" },
      { name: "Manager User", email: "accountant@example.com", password: "acc123", role: "accountant" },
      { name: "Clerk User", email: "clerk@example.com", password: "clerk123", role: "clerk" },
    ];

    for (const u of users) {
      const existing = await User.findOne({ email: u.email });

      if (!existing) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashedPassword });
        console.log(`✅ User ${u.email} created`);
      } else {
        console.log(`⚠️  User ${u.email} already exists`);
      }
    }

    console.log("🌱 Seeding complete!");
  } catch (error) {
    console.error("❌ Error during seeding:", error.message);
  } finally {
    mongoose.connection.close();
    console.log("🔒 MongoDB connection closed.");
  }
};

seedUsers();
