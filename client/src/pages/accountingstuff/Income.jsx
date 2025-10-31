import React, { useState, useMemo } from "react";
import "../../styles/accountant/income.css";

export default function Income() {
  const [incomeList, setIncomeList] = useState([]);
  const [showForm, setShowForm] = useState(false);
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

  const vehicleModelsByType = {
    Sedan: ["Toyota Camry", "Honda Accord", "Nissan Altima"],
    SUV: ["Toyota RAV4", "Honda CR-V", "Ford Explorer"],
    Truck: ["Ford F-150", "Chevrolet Silverado", "Ram 1500"],
    Van: ["Honda Odyssey", "Toyota Sienna", "Chrysler Pacifica"],
    Coupe: ["Ford Mustang", "Chevrolet Camaro", "BMW 4 Series"],
  };

  const [vehicleModels, setVehicleModels] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "type") {
      setVehicleModels(vehicleModelsByType[value] || []);
      setFormData({ ...formData, type: value, model: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIncome = { ...formData, id: "I" + Date.now() };
    setIncomeList([newIncome, ...incomeList]);
    resetForm();
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
    setShowForm(false);
  };

  const deleteIncome = (id) => {
    if (window.confirm("Are you sure you want to delete this income?")) {
      setIncomeList(incomeList.filter((i) => i.id !== id));
    }
  };

  const printInvoice = (income) => {
    const newWindow = window.open("", "PRINT", "height=600,width=800");
    newWindow.document.write(`<html><head><title>Invoice</title></head><body>`);
    newWindow.document.write(`<h2>📄 Income Invoice</h2>`);
    newWindow.document.write(`<p><strong>Category:</strong> ${income.category}</p>`);
    if (income.category === "Vehicle Sale") {
      newWindow.document.write(`<p><strong>Type:</strong> ${income.type}</p>`);
      newWindow.document.write(`<p><strong>Model:</strong> ${income.model}</p>`);
      newWindow.document.write(`<p><strong>Plate:</strong> ${income.plate}</p>`);
      newWindow.document.write(`<p><strong>VIN:</strong> ${income.vin}</p>`);
    } else if (income.category === "Service & Maintenance") {
      newWindow.document.write(`<p><strong>Service Type:</strong> ${income.serviceType}</p>`);
      newWindow.document.write(`<p><strong>Part:</strong> ${income.servicePart}</p>`);
    } else if (income.category === "Taxes") {
      newWindow.document.write(`<p><strong>Tax Type:</strong> ${income.taxType}</p>`);
    }
    newWindow.document.write(`<p><strong>Cost:</strong> $${income.cost}</p>`);
    newWindow.document.write(`<p><strong>Description:</strong> ${income.description}</p>`);
    newWindow.document.write(`</body></html>`);
    newWindow.document.close();
    newWindow.print();
  };

  // ------------------------
  // Calculations
  // ------------------------
  const totalIncome = useMemo(
    () => incomeList.reduce((sum, i) => sum + parseFloat(i.cost || 0), 0),
    [incomeList]
  );

  const categoryTotals = useMemo(() => {
    const totals = { "Vehicle Sale": 0, "Service & Maintenance": 0, Taxes: 0, "Other Services": 0 };
    incomeList.forEach((i) => {
      totals[i.category] += parseFloat(i.cost || 0);
    });
    return totals;
  }, [incomeList]);

  return (
    <div className="income-page">
      <div className="page-header">
        <h1>💰 Income</h1>
        <p>Track all incoming revenue and financial activities</p>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "✕ Cancel" : "+ Add Income"}
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

      {/* Add Income Form */}
      {showForm && (
        <div className="income-form-card">
          <h3>Add New Income</h3>
          <form onSubmit={handleSubmit} className="income-form">
            <div className="form-group">
              <label>Category</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="Vehicle Sale">Vehicle Sale</option>
                <option value="Service & Maintenance">Service & Maintenance</option>
                <option value="Taxes">Taxes</option>
                <option value="Other Services">Other Services</option>
              </select>
            </div>

            {formData.category === "Vehicle Sale" && (
              <>
                <div className="form-group">
                  <label>Vehicle Type</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Select Type</option>
                    {Object.keys(vehicleModelsByType).map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <select name="model" value={formData.model} onChange={handleChange}>
                    <option value="">Select Model</option>
                    {vehicleModels.map((model) => (
                      <option key={model} value={model}>
                        {model}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Plate</label>
                  <input
                    type="text"
                    name="plate"
                    value={formData.plate}
                    onChange={handleChange}
                    placeholder="Enter plate number"
                  />
                </div>
                <div className="form-group">
                  <label>VIN</label>
                  <input
                    type="text"
                    name="vin"
                    value={formData.vin}
                    onChange={handleChange}
                    placeholder="Enter VIN number"
                  />
                </div>
              </>
            )}

            {formData.category === "Service & Maintenance" && (
              <>
                <div className="form-group">
                  <label>Service Type</label>
                  <select name="serviceType" value={formData.serviceType} onChange={handleChange}>
                    <option value="">Select Service</option>
                    <option value="Repair">Repair</option>
                    <option value="Oil Change">Oil Change</option>
                    <option value="Tire Service">Tire Service</option>
                    <option value="Polishing">Polishing</option>
                    <option value="Cleaning">Cleaning</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Part</label>
                  <input
                    type="text"
                    name="servicePart"
                    value={formData.servicePart}
                    onChange={handleChange}
                    placeholder="Which part?"
                  />
                </div>
              </>
            )}

            {formData.category === "Taxes" && (
              <div className="form-group">
                <label>Tax Type</label>
                <select name="taxType" value={formData.taxType} onChange={handleChange}>
                  <option value="">Select Tax</option>
                  <option value="Late Payment">Late Payment</option>
                  <option value="Shipping">Shipping</option>
                  <option value="Delivery Tax">Delivery Tax</option>
                </select>
              </div>
            )}

            {formData.category === "Other Services" && (
              <div className="form-group">
                <label>Service Name</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Vehicle registration, parts sale, etc."
                />
              </div>
            )}

            <div className="form-group">
              <label>Cost</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                required
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit">
                Add Income
              </button>
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Income Table */}
      <div className="income-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
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
              <tr key={inc.id}>
                <td>{inc.id}</td>
                <td>{inc.category}</td>
                <td>
                  {inc.category === "Vehicle Sale" ? `${inc.type} / ${inc.model}` : "-"}
                </td>
                <td>
                  {inc.category === "Vehicle Sale" ? `${inc.plate} / ${inc.vin}` : "-"}
                </td>
                <td>
                  {inc.category === "Service & Maintenance"
                    ? `${inc.serviceType} / ${inc.servicePart}`
                    : inc.category === "Taxes"
                    ? inc.taxType
                    : "-"}
                </td>
                <td>${parseFloat(inc.cost).toFixed(2)}</td>
                <td>{inc.description || "-"}</td>
                <td>
                  <button className="btn-edit" onClick={() => alert("Edit feature coming!")}>
                    ✏️
                  </button>
                  <button className="btn-delete" onClick={() => deleteIncome(inc.id)}>
                    🗑️
                  </button>
                  <button className="btn-print" onClick={() => printInvoice(inc)}>
                    🖨️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
