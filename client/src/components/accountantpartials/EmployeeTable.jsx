import React, { useState } from "react";
import "../../styles/accountant/table.css";

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "John Doe", position: "Accountant", salary: 1500 },
    { id: 2, name: "Sara Ali", position: "Cashier", salary: 1200 },
  ]);

  const [form, setForm] = useState({ id: null, name: "", position: "", salary: "" });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name || !form.position || !form.salary) return;
    setEmployees([...employees, { ...form, id: Date.now() }]);
    setForm({ id: null, name: "", position: "", salary: "" });
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setIsEditing(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setEmployees(
      employees.map((emp) => (emp.id === form.id ? form : emp))
    );
    setForm({ id: null, name: "", position: "", salary: "" });
    setIsEditing(false);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter((emp) => emp.id !== id));
  };

  return (
    <div className="table-container">
      <h2>Employee Salary Table</h2>

      <form className="employee-form" onSubmit={isEditing ? handleUpdate : handleAdd}>
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
        />
        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
        />
        <button type="submit">{isEditing ? "Update" : "Add"}</button>
      </form>

      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Salary ($)</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.position}</td>
              <td>{emp.salary}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(emp)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(emp.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
