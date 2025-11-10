const express = require("express");
const router = express.Router();
const { getClerkReportData } = require("../controllers/clerkReportController");

// ✅ Fetch full report data for Clerk dashboard & reports
router.get("/", getClerkReportData);

module.exports = router;
