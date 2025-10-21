const Permission = require("../models/Permission");

// ✅ Create
exports.createPermission = async (req, res) => {
  try {
    const { name } = req.body;
    const perm = await Permission.create({ name });
    res.status(201).json({ message: "✅ Permission created", perm });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get all
exports.getPermissions = async (_req, res) => {
  try {
    const perms = await Permission.find().sort({ name: 1 });
    res.json(perms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update
exports.updatePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const perm = await Permission.findByIdAndUpdate(id, { name }, { new: true });
    if (!perm) return res.status(404).json({ message: "Permission not found" });
    res.json({ message: "✅ Permission updated", perm });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete
exports.deletePermission = async (req, res) => {
  try {
    const { id } = req.params;
    const perm = await Permission.findByIdAndDelete(id);
    if (!perm) return res.status(404).json({ message: "Permission not found" });
    res.json({ message: "🗑️ Permission deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
