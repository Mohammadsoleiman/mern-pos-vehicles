import React, { useState, useContext } from "react";
import { TransactionContext } from "../../context/ACCOUNTANT/TransactionContext.jsx";
import "../../styles/accountant/forms.css";

export default function AddTransactionForm() {
  const { addTransaction } = useContext(TransactionContext);

  const [formData, setFormData] = useState({
    id: "",
    date: "",
    type: "",
    amount: ""
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    addTransaction(formData);
    setFormData({ id: "", date: "", type: "", amount: "" });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>Add Transaction</h3>
      <label>ID</label>
      <input type="text" name="id" value={formData.id} onChange={handleChange} required />
      
      <label>Date</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      
      <label>Type</label>
      <input type="text" name="type" value={formData.type} onChange={handleChange} required />
      
      <label>Amount</label>
      <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
      
      <button type="submit">Add Transaction</button>
    </form>
  );
}
