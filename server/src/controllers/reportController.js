const Income = require("../models/Income");
const Expense = require("../models/Expense");
const Purchase = require("../models/Purchase");
const Payroll = require("../models/Payroll");

// =============================
// 📊 1. Summary Report (Cards)
// =============================
exports.getReportSummary = async (req, res) => {
  try {
    const { from, to } = req.query;
    const fromDate = from ? new Date(from) : new Date(new Date().getFullYear(), 0, 1);
    const toDate = to ? new Date(to) : new Date();

    // ✅ Total Income (sum of cost)
    const incomeAgg = await Income.aggregate([
      { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
      { $group: { _id: null, total: { $sum: "$cost" } } },
    ]);

    // ✅ Expenses + Purchases + Payroll (grand total)
    const expenseAgg = await Expense.aggregate([
      { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const purchaseAgg = await Purchase.aggregate([
      { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const payrollAgg = await Payroll.aggregate([
      { $match: { createdAt: { $gte: fromDate, $lte: toDate } } },
      { $group: { _id: null, total: { $sum: "$totalPaid" } } },
    ]);

    const totalIncome = incomeAgg[0]?.total || 0;
    const totalExpenses =
      (expenseAgg[0]?.total || 0) +
      (purchaseAgg[0]?.total || 0) +
      (payrollAgg[0]?.total || 0);

    const netProfit = totalIncome - totalExpenses;

    res.status(200).json({ totalIncome, totalExpenses, netProfit });
  } catch (error) {
    console.error("❌ Error generating report summary:", error);
    res.status(500).json({ message: "Error generating report summary" });
  }
};

// =============================
// 📈 2. Trend Report (Chart)
// =============================
exports.getIncomeExpenseTrend = async (req, res) => {
  try {
    const { period = "monthly" } = req.query;
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // === DAILY ===
    if (period === "daily") {
      const start = new Date();
      start.setDate(start.getDate() - 7); // last 7 days

      const incomeDaily = await Income.aggregate([
        { $match: { createdAt: { $gte: start } } },
        { $group: { _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } }, income: { $sum: "$cost" } } },
        { $sort: { "_id.month": 1, "_id.day": 1 } },
      ]);

      const expenseDaily = await Expense.aggregate([
        { $match: { createdAt: { $gte: start } } },
        { $group: { _id: { day: { $dayOfMonth: "$createdAt" }, month: { $month: "$createdAt" } }, expense: { $sum: "$total" } } },
        { $sort: { "_id.month": 1, "_id.day": 1 } },
      ]);

      const daily = incomeDaily.map((inc) => ({
        name: `${inc._id.day}/${inc._id.month}`,
        income: inc.income,
        expense:
          expenseDaily.find(
            (exp) =>
              exp._id.day === inc._id.day && exp._id.month === inc._id.month
          )?.expense || 0,
      }));

      return res.json(daily);
    }

    // === MONTHLY ===
    if (period === "monthly") {
      const monthlyIncome = await Income.aggregate([
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, income: { $sum: "$cost" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      const monthlyExpense = await Expense.aggregate([
        { $group: { _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } }, expense: { $sum: "$total" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      const monthly = monthlyIncome.map((inc) => ({
        name: `${months[inc._id.month - 1]} ${inc._id.year}`,
        income: inc.income,
        expense:
          monthlyExpense.find(
            (exp) =>
              exp._id.month === inc._id.month && exp._id.year === inc._id.year
          )?.expense || 0,
      }));

      return res.json(monthly);
    }

    // === YEARLY ===
    const yearlyIncome = await Income.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" } }, income: { $sum: "$cost" } } },
      { $sort: { "_id.year": 1 } },
    ]);

    const yearlyExpense = await Expense.aggregate([
      { $group: { _id: { year: { $year: "$createdAt" } }, expense: { $sum: "$total" } } },
      { $sort: { "_id.year": 1 } },
    ]);

    const yearly = yearlyIncome.map((inc) => ({
      name: inc._id.year.toString(),
      income: inc.income,
      expense:
        yearlyExpense.find((exp) => exp._id.year === inc._id.year)?.expense ||
        0,
    }));

    res.json(yearly);
  } catch (error) {
    console.error("❌ Error generating trend report:", error);
    res.status(500).json({ message: "Error generating trend report" });
  }
};
