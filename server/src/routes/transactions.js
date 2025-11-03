const express = require("express");
const router = express.Router();
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Purchase = require("../models/Purchase");
const Payroll = require("../models/Payroll");

// 📊 GET /api/transactions/summary
router.get("/summary", async (req, res) => {
  try {
    const [incomes, expenses, purchases, payroll] = await Promise.all([
      Income.find(),
      Expense.find(),
      Purchase.find(),
      Payroll.find(),
    ]);

    const totalIncome = incomes.reduce((sum, i) => sum + parseFloat(i.cost || 0), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.unitCost * e.quantity || 0), 0);
    const totalPurchases = purchases.reduce((sum, p) => sum + (p.unitCost * p.quantity || 0), 0);
    const totalPayroll = payroll.reduce(
      (sum, emp) => sum + (emp.totalPaid || (emp.salary - emp.deduction + emp.bonus) || 0),
      0
    );

    const grandExpenses = totalExpenses + totalPurchases + totalPayroll;
    const netBalance = totalIncome - grandExpenses;

    res.json({
      totalIncome,
      totalExpenses: grandExpenses,
      totalPayroll,
      totalPurchases,
      netBalance,
    });
  } catch (err) {
    console.error("❌ Error fetching summary:", err.message);
    res.status(500).json({ error: "Failed to calculate financial summary" });
  }
});

module.exports = router;
// 📜 Combined Transactions History
router.get("/history", async (req, res) => {
  try {
    const [incomes, expenses, purchases, payroll] = await Promise.all([
      Income.find(),
      Expense.find(),
      Purchase.find(),
      Payroll.find(),
    ]);

    // Standardize fields so all entries have the same structure
    const formatted = [
      ...incomes.map((i) => ({
        _id: i._id,
        date: i.createdAt || i.date || new Date(),
        type: "Income",
        category: i.category || "General Income",
        description: i.description || i.serviceType || i.servicePart || "-",
        amount: parseFloat(i.cost || 0),
        source: "Incomes",
      })),
      ...expenses.map((e) => ({
        _id: e._id,
        date: e.date || new Date(),
        type: "Expense",
        category: "Expense",
        description: e.itemName || e.company || "-",
        amount: -(e.unitCost * e.quantity || 0),
        source: "Expenses",
      })),
      ...purchases.map((p) => ({
        _id: p._id,
        date: p.date || new Date(),
        type: "Expense",
        category: "Purchase",
        description: p.itemName || p.company || "-",
        amount: -(p.unitCost * p.quantity || 0),
        source: "Purchases",
      })),
      ...payroll.map((emp) => ({
        _id: emp._id,
        date: emp.date || new Date(),
        type: "Expense",
        category: "Payroll",
        description: emp.name || emp.role || "Employee Payment",
        amount: -(emp.totalPaid || emp.salary - emp.deduction + emp.bonus || 0),
        source: "Payroll",
      })),
    ];

    // Sort newest first
    const sorted = formatted.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    res.json(sorted);
  } catch (err) {
    console.error("❌ Error generating transaction history:", err.message);
    res.status(500).json({ error: "Failed to load transaction history" });
  }
});
