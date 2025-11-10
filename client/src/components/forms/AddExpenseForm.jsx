import React, { useState, useContext } from "react";
import { ExpenseContext } from "../../context/ExpenseContext";
import "../../styles/accountant/forms.css";

export default function AddExpenseForm() {
  const { addExpense } = useContext(ExpenseContext);

  const [formData, setFormData] = useState({
    id: "",
    date: "",
    category: "",
    amount: ""
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    addExpense(formData);
    setFormData({ id: "", date: "", category: "", amount: "" });
  };

  return (
    <form className="form-container" onSubmit={handleSubmit}>
      <h3>Add Expense</h3>
      <label>ID</label>
      <input type="text" name="id" value={formData.id} onChange={handleChange} required />
      
      <label>Date</label>
      <input type="date" name="date" value={formData.date} onChange={handleChange} required />
      
      <label>Category</label>
      <input type="text" name="category" value={formData.category} onChange={handleChange} required />
      
      <label>Amount</label>
      <input type="number" name="amount" value={formData.amount} onChange={handleChange} required />
      
      <button type="submit">Add Expense</button>
    </form>
  );
}
