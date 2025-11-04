const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth"); // ✅ مش authMiddleware

const {
  login,
  register,
  updateRole,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateSettings,
} = require("../controllers/authController");

// ---------------- Auth ----------------
router.post("/login", login);
router.post("/register", register);

// ------------ Users & Roles -----------
router.put("/update-role", auth(["admin"]), updateRole);
router.get("/users", auth(["admin"]), getAllUsers);
router.post("/users", auth(["admin"]), createUser);
router.put("/users/:id", auth(["admin"]), updateUser);
router.delete("/users/:id", auth(["admin"]), deleteUser);

// -------------- Settings --------------
router.put("/settings", auth(["admin"]), updateSettings);

module.exports = router;
