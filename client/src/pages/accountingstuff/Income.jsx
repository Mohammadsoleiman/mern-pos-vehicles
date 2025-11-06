import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import "../../styles/accountant/income.css";

export default function Income() {
  const [incomeList, setIncomeList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showView, setShowView] = useState(false);
  const [viewingIncome, setViewingIncome] = useState(null);
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

  useEffect(() => {
    document.body.classList.toggle(
      "modal-open",
      showAdd || showEdit || showView
    );
    return () => document.body.classList.remove("modal-open");
  }, [showAdd, showEdit, showView]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "type") setVehicleModels(vehicleModelsByType[value] || []);
  };

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
    setShowView(false);
    setEditingIncome(null);
    setViewingIncome(null);
  };

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

  const openEdit = (income) => {
    setEditingIncome(income);
    setFormData(income);
    setVehicleModels(vehicleModelsByType[income.type] || []);
    setShowEdit(true);
  };

  const openView = (income) => {
    setViewingIncome(income);
    setShowView(true);
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

  const handleDelete = async (id) => {
    if (window.confirm("Delete this income?")) {
      await axios.delete(`${API_URL}/${id}`);
      setIncomeList(incomeList.filter((i) => i._id !== id));
    }
  };

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
      if (totals[i.category] !== undefined)
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
                <th>Cost</th>
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
                  <td>${parseFloat(inc.cost).toFixed(2)}</td>
                  <td>
                    <button
                      className="btn-show"
                      onClick={() => openView(inc)}
                      title="View Details"
                    >
                      👁️
                    </button>
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- VIEW MODAL --- */}
      {showView && viewingIncome && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>Income Details</h3>
            <div className="view-details">
              <p>
                <strong>Type / Model:</strong>{" "}
                {viewingIncome.type
                  ? `${viewingIncome.type} / ${viewingIncome.model}`
                  : "-"}
              </p>
              <p>
                <strong>Plate / VIN:</strong>{" "}
                {viewingIncome.plate || viewingIncome.vin
                  ? `${viewingIncome.plate || ""} / ${
                      viewingIncome.vin || ""
                    }`
                  : "-"}
              </p>
              <p>
                <strong>Service / Tax:</strong>{" "}
                {viewingIncome.serviceType
                  ? `${viewingIncome.serviceType} / ${
                      viewingIncome.servicePart
                    }`
                  : viewingIncome.taxType || "-"}
              </p>
              <p>
                <strong>Description:</strong>{" "}
                {viewingIncome.description || "-"}
              </p>
            </div>
            <div className="modalActions">
              <button className="cancelBtn" onClick={resetForm}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* existing add/edit modals remain here */}
      {(showAdd || showEdit) && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>{showAdd ? "Add New Income" : "Edit Income"}</h3>
            <form onSubmit={showAdd ? handleSubmit : handleEditSubmit}>
              {/* ... same form fields as before ... */}
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
                <button className="saveBtn">
                  {showAdd ? "Save" : "Update"}
                </button>
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
