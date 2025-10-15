const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");

router.get("/admin", auth(["admin"]), (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

router.get("/manager", auth(["manager"]), (req, res) => {
  res.json({ message: "Welcome Manager!" });
});

router.get("/clerk", auth(["clerk"]), (req, res) => {
  res.json({ message: "Welcome Clerk!" });
});

module.exports = router;
