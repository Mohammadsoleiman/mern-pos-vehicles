const express = require("express");
const router = express.Router();
const {
  login,
  register,
  updateRole,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/authController");

// Auth routes
router.post("/login", login);
router.post("/register", register);
router.put("/update-role", updateRole);

// User management
router.get("/users", getAllUsers);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
