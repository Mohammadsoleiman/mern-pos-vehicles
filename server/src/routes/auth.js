// const express = require("express");
// const router = express.Router();

// const auth = require("../middlewares/auth");
// const {
//   login,
//   register,
//   updateRole,
//   getAllUsers,
//   createUser,
//   updateUser,
//   deleteUser,
//   updateSettings
// } = require("../controllers/authController");

// // Auth
// router.post("/login", login);
// router.post("/register", register);

// // Users
// router.get("/users", auth(["admin"]), getAllUsers);
// router.post("/users", auth(["admin"]), createUser);
// router.put("/users/:id", auth(["admin"]), updateUser);
// router.delete("/users/:id", auth(["admin"]), deleteUser);

// // Roles
// router.put("/update-role", auth(["admin"]), updateRole);

// // ✅ Update settings per role (admin/clerk/accountant)
// router.put("/settings", auth(["admin", "clerk", "accounting"]), updateSettings);


// module.exports = router;
const express = require("express"); // ← هذا السطر كان ناقص
const router = express.Router();

const auth = require("../middlewares/auth");

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

// Auth routes
router.post("/login", login);
router.post("/register", register);

// Users management
router.get("/users", auth(["admin"]), getAllUsers);
router.post("/users", auth(["admin"]), createUser);
router.put("/users/:id", auth(["admin"]), updateUser);
router.delete("/users/:id", auth(["admin"]), deleteUser);

// Role update
router.put("/update-role", auth(["admin"]), updateRole);

// ✅ Correct role list → accountant not accounting
router.put("/settings", auth(["admin", "clerk", "accounting"]), updateSettings);

module.exports = router;
