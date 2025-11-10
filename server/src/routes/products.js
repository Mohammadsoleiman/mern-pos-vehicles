const express = require("express");
const router = express.Router();
const { createProduct, getProducts } = require("../controllers/productController");
const checkPermission = require("../middlewares/checkPermission");

router.post("/create", checkPermission("create_product"), createProduct);
router.get("/", checkPermission("view_product"), getProducts);

module.exports = router;
