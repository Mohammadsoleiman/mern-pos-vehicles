const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboardController"); // ✅ صح

// Clerk Dashboard Route
router.get("/", getDashboard); // ✅ استخدم نفس الدالة

module.exports = router;
