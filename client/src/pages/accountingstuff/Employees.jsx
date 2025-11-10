import React, { useState } from "react";
import "../../styles/accountant/employees.css";
import { UserPlus, Edit2, Trash2, Mail, Phone, Calendar } from "react-feather";

export default function Employees() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Ali Hassan", role: "Driver", email: "ali@autopos.com", phone: "0501234567", salary: 2500, joinDate: "2023-10-01" },
    { id: 2, name: "Sara Khaled", role: "Accountant", email: "sara@autopos.com", phone: "0559876543", salary: 3200, joinDate: "2022-07-15" },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    salary: "",
    joinDate: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrUpdate = (e) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployees(
        employees.map((emp) =>
          emp.id === editingEmployee.id ? { ...editingEmployee, ...formData } : emp
        )
      );
      setEditingEmployee(null);
    } else {
      const newEmployee = {
        id: Date.now(),
        ...formData,
      };
      setEmployees([...employees, newEmployee]);
    }
    setFormData({
      name: "",
      role: "",
      email: "",
      phone: "",
      salary: "",
      joinDate: "",
    });
    setShowForm(false);
  };

  const handleEdit = (emp) => {
    setEditingEmployee(emp);
    setFormData(emp);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      setEmployees(employees.filter((emp) => emp.id !== id));
    }
  };

  const totalSalary = employees.reduce((sum, emp) => sum + Number(emp.salary), 0);

  return (
    <div className="employees-page">
      <div className="employees-header">
        <h2>Employees</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <UserPlus size={18} /> Add Employee
        </button>
      </div>

      {/* Salary Summary */}
      <div className="salary-summary">
        <p>Total Employees: <strong>{employees.length}</strong></p>
        <p>Total Monthly Payroll: <strong>{totalSalary.toLocaleString()} AED</strong></p>
      </div>

      {/* Employee Table */}
      <table className="employees-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Salary (AED)</th>
            <th>Join Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.name}</td>
                <td>{emp.role}</td>
                <td><Mail size={14} /> {emp.email}</td>
                <td><Phone size={14} /> {emp.phone}</td>
                <td>{emp.salary}</td>
                <td><Calendar size={14} /> {emp.joinDate}</td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(emp)}>
                    <Edit2 size={16} />
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(emp.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="7" className="no-data">No employees found</td></tr>
          )}
        </tbody>
      </table>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingEmployee ? "Edit Employee" : "Add New Employee"}</h3>
            <form onSubmit={handleAddOrUpdate}>
              <div className="form-group">
                <label>Name:</label>
                <input name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <input name="role" value={formData.role} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input name="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input name="phone" value={formData.phone} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Salary (AED):</label>
                <input name="salary" type="number" value={formData.salary} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Join Date:</label>
                <input name="joinDate" type="date" value={formData.joinDate} onChange={handleChange} required />
              </div>

              <div className="modal-actions">
                <button type="submit" className="save-btn">Save</button>
                <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
