const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: mongoose.Schema.Types.ObjectId, ref: "Role" },

  settings: {
    admin: {
      theme: { type: String, default: "light" },
      layout: { type: String, default: "list" },
      profilePic: { type: String, default: "" },
    },
    clerk: {
      theme: { type: String, default: "light" },
      layout: { type: String, default: "list" },
      profilePic: { type: String, default: "" },
    },
    accounting: {                                // ✅ بدل accountant → accounting
      theme: { type: String, default: "light" },
      layout: { type: String, default: "list" },
      profilePic: { type: String, default: "" },
    },
  }
});

module.exports = mongoose.model("User", userSchema);
