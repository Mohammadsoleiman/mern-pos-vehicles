const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    type: { type: String, default: "info" },
    isRead: { type: Boolean, default: false } // ✅ مهم
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
