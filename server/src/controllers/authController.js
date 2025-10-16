const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔑 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Populate role + nested permissions (with names)
    const user = await User.findOne({ email })
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          select: "name", // نرجّع بس الاسم
        },
      });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🔐 Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role?._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ Send full response (clean, readable)
    res.json({
      token,
      role: user.role?.name || "no-role",
      permissions: user.role?.permissions?.map((p) => p.name) || [],
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name || null,
      },
    });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧾 Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: role || "clerk", // Default role
    });

    res.status(201).json({
      message: "✅ User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ⚙️ Update Role
exports.updateRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId || !roleId)
      return res
        .status(400)
        .json({ message: "userId and roleId are required" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = roleId;
    await user.save();

    // ✅ Populate new role info
    await user.populate({
      path: "role",
      populate: { path: "permissions", select: "name" },
    });

    res.json({
      message: "✅ Role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name,
        permissions: user.role?.permissions?.map((p) => p.name) || [],
      },
    });
  } catch (err) {
    console.error("❌ Update role error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
