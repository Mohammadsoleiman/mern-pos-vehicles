const express = require("express");
const router = express.Router();
const { getClerkDashboardStats } = require("../controllers/dashboardController");

// Clerk dashboard stats
router.get("/", getClerkDashboardStats);

module.exports = router;
