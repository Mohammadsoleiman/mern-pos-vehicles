const express = require("express");
const router = express.Router();
const { login, register, updateRole } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", register);
router.put("/update-role", updateRole);

module.exports = router;
