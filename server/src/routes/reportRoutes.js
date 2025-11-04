const express = require("express");
const router = express.Router();
const {
  getReportSummary,
  getIncomeExpenseTrend,
} = require("../controllers/reportController");

// Summary Cards API
router.get("/summary", getReportSummary);

// Chart Data API
router.get("/trend", getIncomeExpenseTrend);

module.exports = router;
