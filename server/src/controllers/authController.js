const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔑 Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email })
      .populate({
        path: "role",
        populate: {
          path: "permissions",
          select: "name",
        },
      });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role?._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

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
      role: role || "clerk",
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

// 📋 Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate({
        path: "role",
        select: "name permissions",
        populate: { path: "permissions", select: "name" },
      })
      .select("-password");

    res.json(
      users.map((u) => ({
        id: u._id,
        name: u.name,
        email: u.email,
        role: u.role?.name || "no-role",
        permissions: u.role?.permissions?.map((p) => p.name) || [],
      }))
    );
  } catch (err) {
    console.error("❌ Get users error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ➕ Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // ✅ تأكد أن role هو ObjectId صالح
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role, // رح يكون _id من Role
    });

    // رجّع مع الـ role details
    const populated = await newUser.populate({
      path: "role",
      select: "name",
    });

    res.status(201).json({
      message: "✅ User created successfully!",
      user: {
        id: populated._id,
        name: populated.name,
        email: populated.email,
        role: populated.role?.name || null,
      },
    });
  } catch (err) {
    console.error("❌ Create user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✏️ Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    // ✅ تأكد أن role هو ObjectId صالح
    if (role) user.role = role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const populated = await user.populate({
      path: "role",
      select: "name",
    });

    res.json({
      message: "✅ User updated successfully!",
      user: {
        id: populated._id,
        name: populated.name,
        email: populated.email,
        role: populated.role?.name || null,
      },
    });
  } catch (err) {
    console.error("❌ Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ❌ Delete user
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "🗑️ User deleted successfully!" });
  } catch (err) {
    console.error("❌ Delete user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
