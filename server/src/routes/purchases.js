const express = require("express");
const router = express.Router();
const {
  getPurchases,
  addPurchase,
  updatePurchase,
  deletePurchase
} = require("../controllers/purchasesController");

router.get("/", getPurchases);
router.post("/", addPurchase);
router.put("/:id", updatePurchase);
router.delete("/:id", deletePurchase);

module.exports = router;
