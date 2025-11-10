const router = require("express").Router();
const { getLatestNotifications, markAllRead } = require("../controllers/notificationController");

router.get("/latest", getLatestNotifications);
router.put("/mark-read", markAllRead);

module.exports = router;
