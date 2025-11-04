import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext"; // ✅ NEW
import "../../styles/usersGrid.css"; // ✅ نفس التصميم

export default function PermissionsList() {
  const { settings } = useSettings(); // ✅ للـ list/grid switch
  const layout = settings.layout || "list";

  const [permissions, setPermissions] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const navigate = useNavigate();
  const location = useLocation();

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/permissions");
      setPermissions(data);
    } catch (err) {
      console.error("❌ Error fetching permissions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return permissions;
    const s = q.toLowerCase();
    return permissions.filter((p) => p.name.toLowerCase().includes(s));
  }, [permissions, q]);

  const openCreate = () => {
    setEditingPermission(null);
    setForm({ name: "" });
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingPermission(p);
    setForm({ name: p.name });
    setModalOpen(true);
  };

  const deletePermission = async (id) => {
    if (!confirm("Are you sure?")) return;
    await axiosClient.delete(`/permissions/${id}`);
    fetchPermissions();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingPermission) {
      await axiosClient.put(`/permissions/${editingPermission._id}`, form);
    } else {
      await axiosClient.post("/permissions/create", form);
    }
    setModalOpen(false);
    fetchPermissions();
  };

  return (
    <div>
      {/* Header */}
      <div className="users-header">
        <h2>Permissions</h2>
        <div className="toolbar">
          <input
            placeholder="Search permissions..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button className="primary" onClick={openCreate}>
            + Create Permission
          </button>

          <button className="secondary" onClick={() => navigate("/admin/users")}>👤 Users</button>
          <button className="secondary" onClick={() => navigate("/admin/roles")}>🧩 Roles</button>
          <button className="secondary" onClick={() => navigate("/admin/permissions")}>🔒 Permissions</button>
        </div>
      </div>

      {/* ✅ LIST MODE */}
      {layout === "list" && (
        <div className="users-body card" style={{ marginTop: 25 }}>
          {loading && <div className="muted">Loading…</div>}
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>
                    <button className="ghost" onClick={() => openEdit(p)}>✏ Edit</button>
                    <button className="danger" onClick={() => deletePermission(p._id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={2} className="muted">No permissions found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ GRID MODE */}
      {layout === "grid" && (
        <div className="grid-users">
          {filtered.map((p) => (
            <div className="user-card" key={p._id}>
              <div className="avatar-circle">{p.name.charAt(0).toUpperCase()}</div>

              <p><strong>{p.name}</strong></p>

              <div className="card-actions">
                <button className="edit" onClick={() => openEdit(p)}>✏ Edit</button>
                <button className="delete" onClick={() => deletePermission(p._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingPermission ? "Edit Permission" : "Create Permission"}</h3>
              <button className="icon" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="form modal-body">
              <label>
                <span>Permission Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <div className="actions-row">
                <button type="button" className="ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary">{editingPermission ? "Save Changes" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
