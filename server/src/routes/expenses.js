const express = require("express");
const router = express.Router();
const {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense
} = require("../controllers/expensesController");

router.get("/", getExpenses);
router.post("/", addExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;
