import React, { useState, useEffect, useMemo } from "react";
import axiosClient from "../../api/axiosClient";
import "../../styles/accountant/expenses.css";

export default function ExpensesPurchasesPayroll() {
  const [expenses, setExpenses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(null);
  const [currentTab, setCurrentTab] = useState("expenses");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH DATA ----------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/${currentTab}`);
        if (currentTab === "expenses") setExpenses(data);
        else if (currentTab === "purchases") setPurchases(data);
        else setPayroll(data);
      } catch (err) {
        console.error(`❌ Error fetching ${currentTab}:`, err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentTab]);

  // ---------------- HANDLE FORM ----------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({});
    setEditing(null);
    setShowForm(false);
  };

  // ---------------- ADD OR UPDATE ----------------
  const handleAddOrEdit = async () => {
    try {
      setLoading(true);
      const endpoint = `/${currentTab}`;
      let payload = { ...formData };

      if (currentTab !== "payroll") {
        payload.total =
          (Number(payload.unitCost) || 0) * (Number(payload.quantity) || 1);
      } else {
        payload.totalPaid =
          Number(payload.salary || 0) -
          Number(payload.deduction || 0) +
          Number(payload.bonus || 0);
      }

      if (!payload.date)
        payload.date = new Date().toISOString().split("T")[0];

      if (editing) {
        await axiosClient.put(`${endpoint}/${editing}`, payload);
      } else {
        await axiosClient.post(endpoint, payload);
      }

      const { data } = await axiosClient.get(endpoint);
      if (currentTab === "expenses") setExpenses(data);
      if (currentTab === "purchases") setPurchases(data);
      if (currentTab === "payroll") setPayroll(data);
      resetForm();
    } catch (err) {
      console.error(`❌ Error saving ${currentTab}:`, err.message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- EDIT / DELETE / PRINT ----------------
  const handleEdit = (item) => {
    setFormData(item);
    setEditing(item._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      const endpoint = `/${currentTab}`;
      await axiosClient.delete(`${endpoint}/${id}`);
      const { data } = await axiosClient.get(endpoint);
      if (currentTab === "expenses") setExpenses(data);
      if (currentTab === "purchases") setPurchases(data);
      if (currentTab === "payroll") setPayroll(data);
    } catch (err) {
      console.error(`❌ Error deleting ${currentTab}:`, err.message);
    }
  };

  const handlePrint = (item) => {
    const w = window.open("", "PRINT", "width=600,height=600");
    w.document.write("<html><head><title>Invoice</title>");
    w.document.write(
      "<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;} th,td{border:1px solid #333;padding:8px;text-align:left;}</style>"
    );
    w.document.write("</head><body>");
    w.document.write(`<h2>${currentTab.toUpperCase()} RECORD</h2><table>`);
    for (let key in item) {
      if (key !== "_id" && key !== "__v")
        w.document.write(`<tr><th>${key}</th><td>${item[key]}</td></tr>`);
    }
    w.document.write("</table></body></html>");
    w.document.close();
    w.print();
  };

  // ---------------- TOTALS ----------------
  const totals = useMemo(() => {
    const expensesTotal = expenses.reduce(
      (sum, e) => sum + (e.unitCost * e.quantity || 0),
      0
    );
    const purchasesTotal = purchases.reduce(
      (sum, p) => sum + (p.unitCost * p.quantity || 0),
      0
    );
    const payrollTotal = payroll.reduce(
      (sum, emp) =>
        sum +
        (emp.totalPaid ||
          (emp.salary - emp.deduction + emp.bonus) ||
          0),
      0
    );
    const grandTotal = expensesTotal + purchasesTotal + payrollTotal;

    return {
      expensesTotal,
      purchasesTotal,
      payrollTotal,
      grandTotal,
    };
  }, [expenses, purchases, payroll]);

  // ---------------- TABLE ----------------
  const renderTable = () => {
    const data =
      currentTab === "expenses"
        ? expenses
        : currentTab === "purchases"
        ? purchases
        : payroll;

    if (loading) return <p>Loading...</p>;
    if (!data.length) return <p>No records yet.</p>;

    return (
      <table>
        <thead>
          <tr>
            {currentTab === "payroll" ? (
              <>
                <th>Employee Name</th>
                <th>Role</th>
                <th>Salary</th>
                <th>Deduction</th>
                <th>Bonus</th>
                <th>Total Paid</th>
                <th>Paid</th>
                <th>Date</th>
                <th>Actions</th>
              </>
            ) : (
              <>
                <th>Item Name</th>
                <th>Company/Supplier</th>
                <th>Quantity</th>
                <th>Unit Cost</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Date</th>
                <th>Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              {currentTab === "payroll" ? (
                <>
                  <td>{row.name}</td>
                  <td>{row.role}</td>
                  <td>${Number(row.salary).toFixed(2)}</td>
                  <td>${Number(row.deduction).toFixed(2)}</td>
                  <td>${Number(row.bonus).toFixed(2)}</td>
                  <td>
                    $
                    {row.totalPaid ||
                      (
                        Number(row.salary) -
                        Number(row.deduction) +
                        Number(row.bonus)
                      ).toFixed(2)}
                  </td>
                  <td>{row.paid ? "✅" : "❌"}</td>
                  <td>{row.date}</td>
                </>
              ) : (
                <>
                  <td>{row.itemName}</td>
                  <td>{row.company}</td>
                  <td>{row.quantity}</td>
                  <td>${Number(row.unitCost).toFixed(2)}</td>
                  <td>${(row.unitCost * row.quantity).toFixed(2)}</td>
                  <td>{row.paid ? "✅" : "❌"}</td>
                  <td>{row.date}</td>
                </>
              )}
              <td>
                <button className="btn-edit" onClick={() => handleEdit(row)}>✏️</button>
                <button className="btn-delete" onClick={() => handleDelete(row._id)}>🗑️</button>
                <button className="btn-print" onClick={() => handlePrint(row)}>🖨️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // ---------------- FORM ----------------
  const renderForm = () => {
    if (currentTab === "payroll") {
      return (
        <>
          <input type="text" name="name" placeholder="Employee Name" value={formData.name || ""} onChange={handleChange} />
          <input type="text" name="role" placeholder="Role" value={formData.role || ""} onChange={handleChange} />
          <input type="number" name="salary" placeholder="Salary" value={formData.salary || ""} onChange={handleChange} />
          <input type="number" name="deduction" placeholder="Deduction" value={formData.deduction || ""} onChange={handleChange} />
          <input type="number" name="bonus" placeholder="Bonus" value={formData.bonus || ""} onChange={handleChange} />
          <input type="date" name="date" value={formData.date || ""} onChange={handleChange} />
          <label>
            <input type="checkbox" name="paid" checked={formData.paid || false} onChange={handleChange} /> Paid
          </label>
        </>
      );
    }

    return (
      <>
        <input type="text" name="itemName" placeholder="Item Name" value={formData.itemName || ""} onChange={handleChange} />
        <input type="text" name="company" placeholder="Company / Supplier" value={formData.company || ""} onChange={handleChange} />
        <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity || ""} onChange={handleChange} />
        <input type="number" name="unitCost" placeholder="Unit Cost" value={formData.unitCost || ""} onChange={handleChange} />
        <input type="date" name="date" value={formData.date || ""} onChange={handleChange} />
        <label>
          <input type="checkbox" name="paid" checked={formData.paid || false} onChange={handleChange} /> Paid
        </label>
      </>
    );
  };

  // ---------------- UI ----------------
  return (
    <div className="expenses-page">
      <h1>💼 Expenses, Purchases & Payroll</h1>

      {/* TOTALS */}
      <div className="summary-cards">
        <div className="card"><h3>💰 Expenses Total</h3><p>${totals.expensesTotal.toFixed(2)}</p></div>
        <div className="card"><h3>🛒 Purchases Total</h3><p>${totals.purchasesTotal.toFixed(2)}</p></div>
        <div className="card"><h3>👥 Payroll Total</h3><p>${totals.payrollTotal.toFixed(2)}</p></div>
        <div className="card grand"><h3>📊 Grand Total</h3><p>${totals.grandTotal.toFixed(2)}</p></div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button className={currentTab === "expenses" ? "active" : ""} onClick={() => setCurrentTab("expenses")}>Expenses</button>
        <button className={currentTab === "purchases" ? "active" : ""} onClick={() => setCurrentTab("purchases")}>Purchases</button>
        <button className={currentTab === "payroll" ? "active" : ""} onClick={() => setCurrentTab("payroll")}>Payroll</button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="form-card">
          <h2>{editing ? "Edit" : "Add New"} {currentTab === "payroll" ? "Employee" : "Item"}</h2>
          <div className="form-grid">{renderForm()}</div>
          <div className="form-actions">
            <button onClick={handleAddOrEdit}>💾 Save</button>
            <button onClick={resetForm}>❌ Cancel</button>
          </div>
        </div>
      )}

      <div className="form-toggle">
        <button onClick={() => setShowForm(true)}>➕ Add {currentTab === "payroll" ? "Employee" : "Item"}</button>
      </div>

      {/* TABLE */}
      <div className="table-card">{renderTable()}</div>
    </div>
  );
}
