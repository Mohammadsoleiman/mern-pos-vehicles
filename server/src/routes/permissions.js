const express = require("express");
const router = express.Router();
const {
  createPermission,
  getPermissions,
  updatePermission,
  deletePermission,
} = require("../controllers/permissionController");

// 🔹 CRUD routes
router.get("/", getPermissions);
router.post("/create", createPermission);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

module.exports = router;
