// server/src/controllers/employeeController.js
const Employee = require("../models/Employee");

// ✅ Create Employee
const createEmployee = async (req, res) => {
  try {
    const newEmp = await Employee.create(req.body);
    res.status(201).json(newEmp);
  } catch (err) {
    console.error("❌ Error creating employee:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ✅ Get All Employees
const getEmployees = async (_req, res) => {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get Single Employee
const getEmployee = async (req, res) => {
  try {
    const emp = await Employee.findById(req.params.id);
    if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.json(emp);
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
};

// ✅ Update Employee
const updateEmployee = async (req, res) => {
  try {
    const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ message: "Employee not found" });
    res.json(updated);
  } catch (err) {
    console.error("❌ Error updating employee:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
};

// ✅ Delete Employee
const deleteEmployee = async (req, res) => {
  try {
    const deleted = await Employee.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    res.json({ message: "Employee deleted successfully" });
  } catch {
    res.status(400).json({ message: "Invalid ID" });
  }
};

module.exports = {
  createEmployee,
  getEmployees,
  getEmployee,
  updateEmployee,
  deleteEmployee,
};
