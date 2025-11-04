import React, { useEffect, useState } from "react";
import { getEmployee, updateEmployee } from "../../../api/employeesApi";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../../styles/accountant/employees.module.css"; // ✅ Correct import for CSS Module

export default function EmployeeEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    loadEmployee();
  }, []);

  const loadEmployee = async () => {
    try {
      const data = await getEmployee(id);
      setFormData(data);
    } catch (err) {
      console.error("❌ Load error:", err);
      alert("Error loading employee data.");
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateEmployee(id, formData);
      navigate("/accounting/employees");
    } catch (err) {
      console.error("❌ Update error:", err);
      alert("Error updating employee. Please try again.");
    }
  };

  if (!formData) return <p>Loading...</p>;

  return (
    <div className={styles.employeePage}>
      <div className={styles.employeeHeader}>
        <h2>Edit Employee</h2>
      </div>

      <form onSubmit={handleSubmit} className={styles.employeeForm}>
        <div className={styles.formGrid}>
          {Object.keys(formData).map(
            (key) =>
              key !== "_id" &&
              key !== "__v" && (
                <div key={key} className={styles.formGroup}>
                  <label>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </label>
                  <input
                    name={key}
                    value={formData[key] ?? ""}
                    onChange={handleChange}
                    type={
                      key === "joinDate"
                        ? "date"
                        : key === "salary"
                        ? "number"
                        : "text"
                    }
                    required={["name", "email", "role"].includes(key)}
                  />
                </div>
              )
          )}
        </div>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn}>
            Update
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
