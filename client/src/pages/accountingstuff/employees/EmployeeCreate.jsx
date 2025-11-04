import React, { useState } from "react";
import { createEmployee } from "../../../api/employeesApi";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/accountant/employees.module.css"; // ✅ Correct import for CSS Module

export default function EmployeeCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    salary: "",
    joinDate: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEmployee(formData);
      navigate("/accounting/employees");
    } catch (err) {
      console.error("❌ Create error:", err);
      alert("Error creating employee. Please try again.");
    }
  };

  return (
    <div className={styles.employeePage}>
      <div className={styles.employeeHeader}>
        <h2>Add New Employee</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.employeeForm}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>Name:</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Role:</label>
            <input
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Phone:</label>
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Salary ($):</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Join Date:</label>
            <input
              type="date"
              name="joinDate"
              value={formData.joinDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn}>
            Save
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate("/accounting/employees")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
