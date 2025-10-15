const express = require("express");
const router = express.Router();
const { createPermission, getPermissions } = require("../controllers/permissionController");

router.post("/create", createPermission);
router.get("/", getPermissions);

module.exports = router;
