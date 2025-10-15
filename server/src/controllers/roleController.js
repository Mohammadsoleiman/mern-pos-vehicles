const Role = require("../models/Role");

exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const role = await Role.create({ name, permissions });
    res.status(201).json({ message: "✅ Role created", role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoles = async (_req, res) => {
  try {
    const roles = await Role.find().populate("permissions");
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
