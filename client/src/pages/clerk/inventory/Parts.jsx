import React, { useEffect, useState } from "react";
import axiosClient from "../../../api/axiosClient";
import { Search, Wrench, Plus, Pencil, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../../styles/clerk/clerkVehicles.css";

export default function Parts() {
    const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", description: "" });

  const loadItems = () => {
    axiosClient.get("/parts").then((res) => setItems(res.data));
  };

  useEffect(() => { loadItems(); }, []);

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editItem) axiosClient.put(`/parts/${editItem._id}`, form).then(loadItems);
    else axiosClient.post("/parts", form).then(loadItems);

    setShowForm(false);
    setEditItem(null);
    setForm({ name: "", price: "", description: "" });
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this part?"))
      axiosClient.delete(`/parts/${id}`).then(loadItems);
  };

  return (
    <div className="vehicles-page">
      <header className="vehicles-header">
        <h1><Wrench size={28}/> Parts</h1>
      </header>

      <div className="vehicles-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input placeholder="Search parts..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
 <select
          className="add-vehicle-btn"
          onChange={(e) => {
            if (!e.target.value) return;
            navigate(`/cashier/inventory/${e.target.value}`);
          }}
        >
          <option value="">More...</option>
          <option value="accessories">Accessories</option>
          <option value="parts">Parts</option>
          <option value="services">Services</option>
        </select>
        <button className="add-vehicle-btn" onClick={() => setShowForm(true)}>
          <Plus size={16}/> Add Part
        </button>
      </div>

      <div className="vehicles-grid">
        {filtered.map((i) => (
          <div key={i._id} className="vehicle-card">
            <h3>{i.name}</h3>
            <p style={{ minHeight: 40 }}>{i.description}</p>
            <p className="vehicle-price">${i.price}</p>

            <div className="vehicle-actions">
              <button className="btn-edit" onClick={() => { setEditItem(i); setForm(i); setShowForm(true); }}>
                <Pencil size={16}/> Edit
              </button>

              <button className="btn-delete" onClick={() => handleDelete(i._id)}>
                <Trash size={16}/>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="modalOverlay">
          <div className="modalContent">
            <h3>{editItem ? "Edit Part" : "Add Part"}</h3>
            <form onSubmit={handleSubmit}>
              <input required placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
              <input required type="number" placeholder="Price" value={form.price} onChange={(e)=>setForm({...form,price:e.target.value})}/>
              <textarea placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})}/>
              <div className="modalActions">
                <button className="saveBtn">Save</button>
                <button type="button" className="cancelBtn" onClick={()=>{ setShowForm(false); setEditItem(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
