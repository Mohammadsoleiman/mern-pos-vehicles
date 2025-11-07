const express = require("express");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Vehicle = require("../models/Vehicle");
const Customer = require("../models/Customer");
const Sale = require("../models/Sale");
const router = express.Router();
const {
  getReportSummary,
  getIncomeExpenseTrend,
} = require("../controllers/reportController");

// Summary Cards API
router.get("/summary", getReportSummary);

// Chart Data API
router.get("/trend", getIncomeExpenseTrend);
// ✅ Income vs Expenses (BAR CHART)
router.get("/admin/timeseries", async (req, res) => {
  try {
    const income = await Income.aggregate([
      { $group: { _id: "$month", totalIncome: { $sum: "$cost" } } }
    ]);

    const expenses = await Expense.aggregate([
      { $group: { _id: "$month", totalExpense: { $sum: "$total" } } }
    ]);

    const months = [...new Set([...income.map(i => i._id), ...expenses.map(e => e._id)])];

    const result = months.map(month => ({
      month,
      income: income.find((i) => i._id === month)?.totalIncome || 0,
      expense: expenses.find((e) => e._id === month)?.totalExpense || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/top-customers", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const top = await Sale.aggregate([
      {
        $group: {
          _id: "$customerId",
          purchases: { $sum: 1 },
          totalSpent: { $sum: "$totalAmount" }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "customers",
          localField: "_id",
          foreignField: "_id",
          as: "customer"
        }
      },
      { $unwind: "$customer" },
    ]);

    res.json(top.map(t => ({
      name: t.customer.name,
      purchases: t.purchases,
      totalSpent: t.totalSpent,
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Sales Trend (LINE CHART)
router.get("/admin/sales-trend", async (req, res) => {
  try {
    const sales = await Sale.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%B %Y", date: "$createdAt" } },
          sales: { $sum: "$quantity" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    res.json(sales.map(s => ({
      month: s._id,
      sales: s.sales
    })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.get("/admin/vehicle-types", async (req, res) => {
  try {
    const types = await Vehicle.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const formatted = types.map(t => ({
      type: t._id || "Unknown",
      count: t.count
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ✅ Recent Transactions API
router.get("/recent-transactions", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 8;

    const tx = await Sale.find()
      .populate("customerId", "name")
      .populate("vehicleId", "model")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(
      tx.map(t => ({
        date: t.createdAt.toISOString().split("T")[0],
        customer: t.customerId?.name || "N/A",
        vehicle: t.vehicleId?.model || "N/A",
        amount: t.totalAmount,
        method: t.paymentMethod,
      }))
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
