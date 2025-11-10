const express = require("express");
const router = express.Router();
const {
  getPayroll,
  addPayroll,
  updatePayroll,
  deletePayroll
} = require("../controllers/payrollController");

router.get("/", getPayroll);
router.post("/", addPayroll);
router.put("/:id", updatePayroll);
router.delete("/:id", deletePayroll);

module.exports = router;
