const express = require("express");
const router = express.Router();
const {
  createRole,
  getRoles,
  updateRole,
  deleteRole,
} = require("../controllers/roleController");

router.post("/create", createRole);
router.get("/", getRoles);
router.put("/:id", updateRole); // ✅ Edit role
router.delete("/:id", deleteRole); // ✅ Delete role

module.exports = router;
