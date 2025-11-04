import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../../styles/accountant/income.css";

export default function Income() {
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);

  const [formData, setFormData] = useState({
    category: "Vehicle Sale",
    type: "",
    model: "",
    plate: "",
    vin: "",
    cost: "",
    serviceType: "",
    servicePart: "",
    taxType: "",
    description: "",
  });

  const API_URL = "http://localhost:5000/api/incomes";

  const vehicleModelsByType = {
    Sedan: ["Toyota Camry", "Honda Accord", "Nissan Altima"],
    SUV: ["Toyota RAV4", "Honda CR-V", "Ford Explorer"],
    Truck: ["Ford F-150", "Chevrolet Silverado", "Ram 1500"],
    Van: ["Honda Odyssey", "Toyota Sienna", "Chrysler Pacifica"],
    Coupe: ["Ford Mustang", "Chevrolet Camaro", "BMW 4 Series"],
  };

  const [vehicleModels, setVehicleModels] = useState([]);

  // ✅ Load all incomes
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(API_URL);
        setIncomeList(res.data);
      } catch (err) {
        console.error("❌ Error fetching incomes:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "type") setVehicleModels(vehicleModelsByType[value] || []);
  };

  // ✅ Reset
  const resetForm = () => {
    setFormData({
      category: "Vehicle Sale",
      type: "",
      model: "",
      plate: "",
      vin: "",
      cost: "",
      serviceType: "",
      servicePart: "",
      taxType: "",
      description: "",
    });
    setVehicleModels([]);
    setShowAdd(false);
    setShowEdit(false);
    setEditingIncome(null);
  };

  // ✅ Add new income
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(API_URL, formData);
      setIncomeList([res.data, ...incomeList]);
      resetForm();
    } catch (err) {
      console.error("❌ Failed to add:", err);
    }
  };

  // ✅ Edit
  const openEdit = (income) => {
    setEditingIncome(income);
    setFormData(income);
    setVehicleModels(vehicleModelsByType[income.type] || []);
    setShowEdit(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${API_URL}/${editingIncome._id}`, formData);
      setIncomeList(
        incomeList.map((i) => (i._id === editingIncome._id ? res.data : i))
      );
      resetForm();
    } catch (err) {
      console.error("❌ Failed to update:", err);
    }
  };

  // ✅ Delete
  const handleDelete = async (id) => {
    if (window.confirm("Delete this income?")) {
      await axios.delete(`${API_URL}/${id}`);
      setIncomeList(incomeList.filter((i) => i._id !== id));
    }
  };

  // ✅ Print invoice
  const printInvoice = (income) => {
    const win = window.open("", "PRINT", "height=700,width=900");
    win.document.write(`
      <html>
        <head>
          <title>Invoice - ${income.category}</title>
          <style>
            body { font-family: Arial; padding: 30px; color: #1e293b; }
            h1 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            td, th { padding: 10px; border-bottom: 1px solid #e2e8f0; }
            th { background: #f1f5f9; text-align: left; color: #475569; }
            .total { text-align: right; font-weight: 700; color: #16a34a; }
          </style>
        </head>
        <body>
          <h1>Income Invoice</h1>
          <p><strong>Date:</strong> ${
            income.date || new Date(income.createdAt).toISOString().split("T")[0]
          }</p>
          <p><strong>Month:</strong> ${income.month || "N/A"}</p>
          <p><strong>Category:</strong> ${income.category}</p>
          <table>
            <tr><th>Field</th><th>Details</th></tr>
            <tr><td>Type</td><td>${income.type || "-"}</td></tr>
            <tr><td>Model</td><td>${income.model || "-"}</td></tr>
            <tr><td>Plate</td><td>${income.plate || "-"}</td></tr>
            <tr><td>VIN</td><td>${income.vin || "-"}</td></tr>
            <tr><td>Service Type</td><td>${income.serviceType || "-"}</td></tr>
            <tr><td>Part</td><td>${income.servicePart || "-"}</td></tr>
            <tr><td>Tax Type</td><td>${income.taxType || "-"}</td></tr>
            <tr><td>Description</td><td>${income.description || "-"}</td></tr>
            <tr><td class="total">Total</td><td class="total">$${parseFloat(
              income.cost || 0
            ).toFixed(2)}</td></tr>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  // ✅ Totals
  const totalIncome = useMemo(
    () => incomeList.reduce((sum, i) => sum + parseFloat(i.cost || 0), 0),
    [incomeList]
  );

  const categoryTotals = useMemo(() => {
    const totals = {
      "Vehicle Sale": 0,
      "Service & Maintenance": 0,
      Taxes: 0,
      "Other Services": 0,
    };
    incomeList.forEach((i) => {
      totals[i.category] += parseFloat(i.cost || 0);
    });
    return totals;
  }, [incomeList]);

  return (
    <div className="income-page">
      <div className="page-header">
        <div>
          <h1>💰 Income</h1>
          <p>Track all revenue and services in one place</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          + Add Income
        </button>
      </div>

      {/* Summary Cards */}
      <div className="income-summary-cards">
        {Object.keys(categoryTotals).map((cat) => (
          <div key={cat} className="summary-card">
            <h4>{cat}</h4>
            <p>${categoryTotals[cat].toLocaleString()}</p>
          </div>
        ))}
        <div className="summary-card total">
          <h4>Total Income</h4>
          <p>${totalIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Table */}
      <div className="income-table">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Month</th>
                <th>Category</th>
                <th>Type / Model</th>
                <th>Plate / VIN</th>
                <th>Service / Tax</th>
                <th>Cost</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomeList.map((inc) => (
                <tr key={inc._id}>
                  <td>{inc._id.slice(-5).toUpperCase()}</td>
                  <td>
                    {inc.date ||
                      new Date(inc.createdAt).toISOString().split("T")[0]}
                  </td>
                  <td>{inc.month || "N/A"}</td>
                  <td>{inc.category}</td>
                  <td>{inc.type ? `${inc.type} / ${inc.model}` : "-"}</td>
                  <td>
                    {inc.plate || inc.vin
                      ? `${inc.plate} / ${inc.vin}`
                      : "-"}
                  </td>
                  <td>
                    {inc.serviceType
                      ? `${inc.serviceType} / ${inc.servicePart}`
                      : inc.taxType || "-"}
                  </td>
                  <td>${parseFloat(inc.cost).toFixed(2)}</td>
                  <td>{inc.description || "-"}</td>
                  <td>
                    <button
                      className="btn-edit"
                      onClick={() => openEdit(inc)}
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(inc._id)}
                    >
                      🗑️
                    </button>
                    <button
                      className="btn-print"
                      onClick={() => printInvoice(inc)}
                    >
                      🖨️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* -------- ADD MODAL -------- */}
      {showAdd && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Add New Income</h3>
            <form onSubmit={handleSubmit}>
              <div className="formGroup">
                <label>Category</label>
                <input
                  list="catOpt"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
                <datalist id="catOpt">
                  <option value="Vehicle Sale" />
                  <option value="Service & Maintenance" />
                  <option value="Taxes" />
                  <option value="Other Services" />
                </datalist>
              </div>

              {/* Vehicle Sale Fields */}
              {formData.category === "Vehicle Sale" && (
                <>
                  <div className="formGroup">
                    <label>Vehicle Type</label>
                    <input
                      list="typeOpt"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    />
                    <datalist id="typeOpt">
                      {Object.keys(vehicleModelsByType).map((t) => (
                        <option key={t} value={t} />
                      ))}
                    </datalist>
                  </div>
                  <div className="formGroup">
                    <label>Model</label>
                    <input
                      list="modelOpt"
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                    />
                    <datalist id="modelOpt">
                      {(vehicleModelsByType[formData.type] || []).map((m) => (
                        <option key={m} value={m} />
                      ))}
                    </datalist>
                  </div>
                  <div className="formGroup">
                    <label>Plate</label>
                    <input
                      name="plate"
                      value={formData.plate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>VIN</label>
                    <input
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* Service & Maintenance */}
              {formData.category === "Service & Maintenance" && (
                <>
                  <div className="formGroup">
                    <label>Service Type</label>
                    <input
                      list="serviceOpt"
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                    />
                    <datalist id="serviceOpt">
                      <option value="Repair" />
                      <option value="Oil Change" />
                      <option value="Tire Service" />
                      <option value="Polishing" />
                      <option value="Cleaning" />
                    </datalist>
                  </div>
                  <div className="formGroup">
                    <label>Part</label>
                    <input
                      name="servicePart"
                      value={formData.servicePart}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {/* Taxes */}
              {formData.category === "Taxes" && (
                <div className="formGroup">
                  <label>Tax Type</label>
                  <input
                    list="taxOpt"
                    name="taxType"
                    value={formData.taxType}
                    onChange={handleChange}
                  />
                  <datalist id="taxOpt">
                    <option value="Late Payment" />
                    <option value="Shipping" />
                    <option value="Delivery Tax" />
                  </datalist>
                </div>
              )}

              <div className="formGroup">
                <label>Description</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="formGroup">
                <label>Cost ($)</label>
                <input
                  type="number"
                  name="cost"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modalActions">
                <button className="saveBtn">Save</button>
                <button
                  type="button"
                  className="cancelBtn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------- EDIT MODAL -------- */}
      {showEdit && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Edit Income</h3>
            <form onSubmit={handleEditSubmit}>
              <div className="formGroup">
                <label>Category</label>
                <input
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              {formData.category === "Vehicle Sale" && (
                <>
                  <div className="formGroup">
                    <label>Vehicle Type</label>
                    <input
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Model</label>
                    <input
                      name="model"
                      value={formData.model}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Plate</label>
                    <input
                      name="plate"
                      value={formData.plate}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>VIN</label>
                    <input
                      name="vin"
                      value={formData.vin}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {formData.category === "Service & Maintenance" && (
                <>
                  <div className="formGroup">
                    <label>Service Type</label>
                    <input
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="formGroup">
                    <label>Part</label>
                    <input
                      name="servicePart"
                      value={formData.servicePart}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {formData.category === "Taxes" && (
                <div className="formGroup">
                  <label>Tax Type</label>
                  <input
                    name="taxType"
                    value={formData.taxType}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="formGroup">
                <label>Description</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="formGroup">
                <label>Cost ($)</label>
                <input
                  type="number"
                  name="cost"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="modalActions">
                <button className="saveBtn">Update</button>
                <button
                  type="button"
                  className="cancelBtn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
