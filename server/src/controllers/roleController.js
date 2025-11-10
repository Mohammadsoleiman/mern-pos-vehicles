const Role = require("../models/Role");

// ✅ Create Role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.create({ name, permissions });
    res.status(201).json({ message: "✅ Role created", role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get All Roles
exports.getRoles = async (_req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Role
exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    const role = await Role.findByIdAndUpdate(
      id,
      { name, permissions },
      { new: true }
    ).populate("permissions");
    if (!role) return res.status(404).json({ message: "❌ Role not found" });
    res.json({ message: "✅ Role updated", role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Role
exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);
    if (!role) return res.status(404).json({ message: "❌ Role not found" });
    res.json({ message: "🗑️ Role deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
