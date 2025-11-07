const express = require("express");
const router = express.Router();
const { getDashboard } = require("../controllers/dashboardController");

// GET /api/dashboard
router.get("/", getDashboard);

module.exports = router;
