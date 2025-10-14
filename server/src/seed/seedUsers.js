require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

const seedUsers = async () => {
  await connectDB();

  const users = [
    { name: "Admin User", email: "admin@example.com", password: "admin123", role: "admin" },
    { name: "Manager User", email: "manager@example.com", password: "manager123", role: "manager" },
    { name: "Clerk User", email: "clerk@example.com", password: "clerk123", role: "clerk" },
  ];

  for (let u of users) {
    const existing = await User.findOne({ email: u.email });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(u.password, 10);
      await User.create({ ...u, password: hashedPassword });
      console.log(`User ${u.email} created`);
    } else {
      console.log(`User ${u.email} already exists`);
    }
  }

  mongoose.connection.close();
};

seedUsers();
