// src/pages/accountingstuff/employees/EmployeeList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Edit2, Trash2, Plus } from "react-feather";
import { useNavigate } from "react-router-dom";
import { getEmployees, deleteEmployee } from "../../../api/employeesApi";
import styles from "../../../styles/accountant/employees.module.css";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const data = await getEmployees();
        setEmployees(data || []);
      } catch (e) {
        console.error("Load employees failed:", e);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(id);
      setEmployees((prev) => prev.filter((e) => e._id !== id));
    } catch (e) {
      console.error("Delete failed:", e);
    }
  };

  // ✅ Calculate total salary
  const totalSalary = useMemo(
    () => employees.reduce((sum, e) => sum + Number(e.salary || 0), 0),
    [employees]
  );

  // ✅ Format salary in USD
  const formatUSD = (amount) =>
    Number(amount || 0).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    });

  return (
    <div className={styles.employeesPage}>
      {/* Header */}
      <div className={styles.employeesHeader}>
        <h2>Employees</h2>
        <div className={styles.headerRight}>
          <span className={styles.totalBadge}>
            Total Salary: <strong>{formatUSD(totalSalary)}</strong>
          </span>
          <button
            className={styles.addBtn}
            onClick={() => navigate("/accounting/employees/create")}
          >
            <Plus size={16} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Table */}
      <table className={styles.employeesTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Salary (USD)</th>
            <th>Join Date</th>
            <th>Status</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length ? (
            employees.map((e) => (
              <tr key={e._id}>
                <td>{e.name}</td>
                <td>{e.role}</td>
                <td>{e.email}</td>
                <td>{e.phone}</td>
                <td>{formatUSD(e.salary)}</td>
                <td>
                  {e.joinDate ? new Date(e.joinDate).toLocaleDateString() : "-"}
                </td>
                <td>{e.status || "Active"}</td>
                <td className={styles.actionButtons}>
                  <button
                    className={styles.editBtn}
                    onClick={() => navigate(`/accounting/employees/edit/${e._id}`)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(e._id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className={styles.noData} colSpan={8}>
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
