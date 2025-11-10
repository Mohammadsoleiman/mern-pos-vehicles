const User = require("../models/User");
const Role = require("../models/Role"); // 👈 ضروري نستورد الموديل
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🔑 Login
exports.login = async (req, res) => {
  try {
    const { emailOrName, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: emailOrName }, { name: emailOrName }],
    }).populate({
      path: "role",
      populate: { path: "permissions", select: "name" },
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ تأكد من وجود settings بـ 3 لوحات (admin / clerk / accountant)
    if (!user.settings || typeof user.settings !== "object") {
      user.settings = {
        admin: { theme: "light", layout: "list", profilePic: "" },
        clerk: { theme: "light", layout: "list", profilePic: "" },
    accounting: { theme: "light", layout: "list", profilePic: "" },   
      };
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, role: user.role?.name || "no-role" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      role: user.role?.name || "no-role",
      permissions: user.role?.permissions?.map((p) => p.name) || [],
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role?.name || null,
        settings: user.settings   // ✅ هنا أرجعنا settings
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// 🧾 Register
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({
      $or: [{ email }, { name }],
    });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // ✅ نبحث عن الـ role بالاسم (مثل clerk أو admin)
    let roleId = null;
    if (role) {
      const foundRole = await Role.findOne({ name: role });
      if (foundRole) roleId = foundRole._id;
    } else {
      const defaultRole = await Role.findOne({ name: "clerk" });
      if (defaultRole) roleId = defaultRole._id;
    }

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: roleId,
    });

    res.status(201).json({
      message: "✅ User registered successfully!",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: role || "clerk",
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
      .populate("role", "name") // ✅ رجع بس اسم الرول
      .select("name email role") // ✅ رجع بس الأشياء المهمة
      .lean(); // 🚀 تسريع القراءة من DB

    res.json(users);
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

    // ✅ هون أهم سطر : إذا role جاي ObjectId لا تعمله findOne
    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role: role || (await Role.findOne({ name: "clerk" }))._id,
    });

    const populated = await newUser.populate("role", "name");

    res.status(201).json({
      message: "✅ User created successfully!",
      user: {
        id: populated._id,
        name: populated.name,
        email: populated.email,
        role: populated.role?.name,
      },
    });
  } catch (err) {
    console.error("❌ Create user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ✏️ Update user
// ✏️ Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.email = email || user.email;

    // ✅ عطيناه الـ ObjectId مباشرة
    if (role) user.role = role;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    const populated = await user.populate("role", "name");

    res.json({
      message: "✅ User updated successfully!",
      user: {
        id: populated._id,
        name: populated.name,
        email: populated.email,
        role: populated.role?.name,
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
// ✅ Update Settings Per Role (admin / accounting / clerk)
exports.updateSettings = async (req, res) => {
  try {
    const { role, theme, layout, profilePic } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // ✅ تأكد أن user.settings موجودة وبهيكلها الصحيح
    if (!user.settings || typeof user.settings !== "object") {
      user.settings = {
        admin: { theme: "light", layout: "list", profilePic: "" },
        clerk: { theme: "light", layout: "list", profilePic: "" },
        accounting: { theme: "light", layout: "list", profilePic: "" },
      };
    }

    // ✅ حدّث الإعدادات حسب الدور الحالي فقط
    user.settings[role] = {
      theme: theme ?? user.settings[role].theme,
      layout: layout ?? user.settings[role].layout,
      profilePic: profilePic ?? user.settings[role].profilePic,
    };

    await user.save();

    return res.json({
      message: "✅ Settings updated!",
      settings: user.settings,
    });
  } catch (err) {
    console.error("❌ updateSettings error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
