const Notification = require("../models/Notification");

exports.getLatestNotifications = async (req, res) => {
  try {
    const list = await Notification.find().sort({ createdAt: -1 }).limit(8);
    const unreadCount = await Notification.countDocuments({ isRead: false });
    res.json({ list, unreadCount });
  } catch (err) {
    res.status(500).json({ message: "Failed to load notifications" });
  }
};

exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ isRead: false }, { isRead: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark read" });
  }
};
