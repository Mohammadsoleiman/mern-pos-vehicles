const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },

  // ✅ New settings field
  settings: {
    dashboardName: { type: String, default: "Admin Panel" },
    layout: { type: String, default: "grid" }, // grid | list
    theme: { type: String, default: "light" }, // light | dark
    profilePic: { type: String, default: "" }, // will store cloudinary URL later
  }
});

module.exports = mongoose.model("User", userSchema);
