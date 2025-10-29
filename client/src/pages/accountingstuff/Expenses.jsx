// src/pages/accountingstuff/ExpensesPurchasesPayroll.jsx
import React, { useState } from "react";
import "../../styles/accountant/expenses.css";

export default function ExpensesPurchasesPayroll() {
  const [expenses, setExpenses] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [payroll, setPayroll] = useState([]);

  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(null);
  const [currentTab, setCurrentTab] = useState("expenses"); // expenses, purchases, payroll
  const [showForm, setShowForm] = useState(false); // control form visibility

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({});
    setEditing(null);
    setShowForm(false); // hide form on cancel
  };

  const handleAddOrEdit = () => {
    let newItem = { ...formData, id: editing || Date.now() };

    // Convert numeric fields
    if (currentTab === "expenses" || currentTab === "purchases") {
      newItem.unitCost = Number(newItem.unitCost || 0);
      newItem.quantity = Number(newItem.quantity || 1);
      newItem.total = newItem.unitCost * newItem.quantity;
    }
    if (currentTab === "payroll") {
      newItem.salary = Number(newItem.salary || 0);
      newItem.deduction = Number(newItem.deduction || 0);
      newItem.bonus = Number(newItem.bonus || 0);
      newItem.totalPaid = newItem.salary - newItem.deduction + newItem.bonus;
    }

    if (editing) {
      if (currentTab === "expenses") setExpenses(expenses.map(e => e.id === editing ? newItem : e));
      if (currentTab === "purchases") setPurchases(purchases.map(p => p.id === editing ? newItem : p));
      if (currentTab === "payroll") setPayroll(payroll.map(p => p.id === editing ? newItem : p));
    } else {
      if (currentTab === "expenses") setExpenses([...expenses, newItem]);
      if (currentTab === "purchases") setPurchases([...purchases, newItem]);
      if (currentTab === "payroll") setPayroll([...payroll, newItem]);
    }

    resetForm();
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditing(item.id);
    setShowForm(true); // show form when editing
  };

  const handleDelete = (id) => {
    if (currentTab === "expenses") setExpenses(expenses.filter(e => e.id !== id));
    if (currentTab === "purchases") setPurchases(purchases.filter(p => p.id !== id));
    if (currentTab === "payroll") setPayroll(payroll.filter(p => p.id !== id));
  };

  const handlePrint = (item) => {
    let printWindow = window.open("", "PRINT", "width=600,height=600");
    printWindow.document.write("<html><head><title>Invoice</title>");
    printWindow.document.write("<style>body{font-family:sans-serif;} table{width:100%;border-collapse:collapse;} th, td{border:1px solid #333;padding:8px;text-align:left;} </style>");
    printWindow.document.write("</head><body>");
    printWindow.document.write(`<h2>${currentTab.toUpperCase()} INVOICE</h2>`);
    printWindow.document.write("<table>");
    for (let key in item) {
      if (key !== "id") printWindow.document.write(`<tr><th>${key}</th><td>${item[key]}</td></tr>`);
    }
    printWindow.document.write("</table>");
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const renderTable = () => {
    if (currentTab === "expenses") {
      return (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Company/Supplier</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id}>
                <td>{e.itemName}</td>
                <td>{e.company}</td>
                <td>{e.quantity}</td>
                <td>${e.unitCost.toFixed(2)}</td>
                <td>${(e.quantity * e.unitCost).toFixed(2)}</td>
                <td>{e.paid ? "✅ Paid" : "❌ Not Paid"}</td>
                <td>{e.date}</td>
                <td>
                  <button onClick={() => handleEdit(e)}>✏️</button>
                  <button onClick={() => handleDelete(e.id)}>🗑️</button>
                  <button onClick={() => handlePrint(e)}>🖨️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (currentTab === "purchases") {
      return (
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Company/Supplier</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p.id}>
                <td>{p.itemName}</td>
                <td>{p.company}</td>
                <td>{p.quantity}</td>
                <td>${p.unitCost.toFixed(2)}</td>
                <td>${(p.quantity * p.unitCost).toFixed(2)}</td>
                <td>{p.paid ? "✅ Paid" : "❌ Not Paid"}</td>
                <td>{p.date}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>✏️</button>
                  <button onClick={() => handleDelete(p.id)}>🗑️</button>
                  <button onClick={() => handlePrint(p)}>🖨️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    if (currentTab === "payroll") {
      return (
        <table>
          <thead>
            <tr>
              <th>Employee Name</th>
              <th>Role</th>
              <th>Salary</th>
              <th>Deduction</th>
              <th>Bonus</th>
              <th>Total Paid</th>
              <th>Paid</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payroll.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.role}</td>
                <td>${Number(p.salary).toFixed(2)}</td>
                <td>${Number(p.deduction).toFixed(2)}</td>
                <td>${Number(p.bonus).toFixed(2)}</td>
                <td>${(Number(p.salary) - Number(p.deduction) + Number(p.bonus)).toFixed(2)}</td>
                <td>{p.paid ? "✅ Paid" : "❌ Not Paid"}</td>
                <td>{p.date}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>✏️</button>
                  <button onClick={() => handleDelete(p.id)}>🗑️</button>
                  <button onClick={() => handlePrint(p)}>🖨️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="expenses-page">
      <h1>💼 Expenses, Purchases & Payroll</h1>
      <div className="tabs">
        <button className={currentTab === "expenses" ? "active" : ""} onClick={() => setCurrentTab("expenses")}>Expenses</button>
        <button className={currentTab === "purchases" ? "active" : ""} onClick={() => setCurrentTab("purchases")}>Purchases</button>
        <button className={currentTab === "payroll" ? "active" : ""} onClick={() => setCurrentTab("payroll")}>Payroll</button>
      </div>

      <div className="form-toggle">
        <button onClick={() => setShowForm(true)}>➕ Add {currentTab === "payroll" ? "Employee" : "Item"}</button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2>{editing ? "Edit" : "Add New"} {currentTab === "payroll" ? "Employee" : "Item"}</h2>
          <div className="form-grid">
            {currentTab !== "payroll" && (
              <>
                <div>
                  <label>Item Name</label>
                  <input name="itemName" value={formData.itemName || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Company/Supplier</label>
                  <input name="company" value={formData.company || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Quantity</label>
                  <input type="number" name="quantity" value={formData.quantity || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Unit Cost</label>
                  <input type="number" name="unitCost" value={formData.unitCost || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Paid</label>
                  <select name="paid" value={formData.paid || false} onChange={handleChange}>
                    <option value={true}>Paid</option>
                    <option value={false}>Not Paid</option>
                  </select>
                </div>
              </>
            )}

            {currentTab === "payroll" && (
              <>
                <div>
                  <label>Employee Name</label>
                  <input name="name" value={formData.name || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Role</label>
                  <input name="role" value={formData.role || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Salary</label>
                  <input type="number" name="salary" value={formData.salary || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Deduction</label>
                  <input type="number" name="deduction" value={formData.deduction || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Bonus</label>
                  <input type="number" name="bonus" value={formData.bonus || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Date</label>
                  <input type="date" name="date" value={formData.date || ""} onChange={handleChange} />
                </div>
                <div>
                  <label>Paid</label>
                  <select name="paid" value={formData.paid || false} onChange={handleChange}>
                    <option value={true}>Paid</option>
                    <option value={false}>Not Paid</option>
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="form-actions">
            <button onClick={handleAddOrEdit}>{editing ? "Update" : "Add"}</button>
            <button onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      <div className="table-card">
        {renderTable()}
      </div>
    </div>
  );
}
