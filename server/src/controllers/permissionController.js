const Permission = require("../models/Permission");

exports.createPermission = async (req, res) => {
  try {
    const { name } = req.body;
    const perm = await Permission.create({ name });
    res.status(201).json({ message: "✅ Permission created", perm });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPermissions = async (_req, res) => {
  try {
    const perms = await Permission.find();
    res.json(perms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
