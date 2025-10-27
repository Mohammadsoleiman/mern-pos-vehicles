import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";

export default function PermissionsList() {
  const [permissions, setPermissions] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Fetch permissions
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

  // 🔹 Filter permissions
  const filtered = useMemo(() => {
    if (!q.trim()) return permissions;
    const s = q.toLowerCase();
    return permissions.filter((p) => p.name.toLowerCase().includes(s));
  }, [permissions, q]);

  // 🔹 Open create modal
  const openCreate = () => {
    setEditingPermission(null);
    setForm({ name: "" });
    setModalOpen(true);
  };

  // 🔹 Open edit modal
  const openEdit = (p) => {
    setEditingPermission(p);
    setForm({ name: p.name });
    setModalOpen(true);
  };

  // 🔹 Delete permission
  const deletePermission = async (id) => {
    if (!confirm("Are you sure you want to delete this permission?")) return;
    try {
      await axiosClient.delete(`/permissions/${id}`);
      alert("🗑️ Permission deleted successfully!");
      fetchPermissions();
    } catch (err) {
      console.error("❌ Error deleting permission:", err);
      alert("❌ Failed to delete permission!");
    }
  };

  // 🔹 Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPermission) {
        await axiosClient.put(`/permissions/${editingPermission._id}`, form);
        alert("✅ Permission updated successfully!");
      } else {
        await axiosClient.post("/permissions/create", form);
        alert("✅ Permission created successfully!");
      }
      setModalOpen(false);
      fetchPermissions();
    } catch (err) {
      console.error("❌ Error saving permission:", err);
      alert("❌ Failed to save permission!");
    }
  };

  return (
    <div>
      <div className="permissions-header">
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

          {/* ✅ Navigation buttons */}
          <button
            type="button"
            className={`secondary ${location.pathname === "/users" ? "active" : ""}`}
            style={{ marginLeft: "8px" }}
            onClick={() => navigate("/admin/users")}
          >
            👤 Users
          </button>

          <button
            type="button"
            className={`secondary ${location.pathname === "/roles" ? "active" : ""}`}
            style={{ marginLeft: "8px" }}
            onClick={() => navigate("/admin/roles")}
          >
            🧩 Roles
          </button>

          <button
            type="button"
            className={`secondary ${location.pathname === "/permissions" ? "active" : ""}`}
            style={{ marginLeft: "8px" }}
            onClick={() => navigate("/admin/permissions")}
          >
            🔒 Permissions
          </button>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="permissions-body card" style={{ marginTop: "25px" }}>
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
                  <button className="ghost" onClick={() => openEdit(p)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => deletePermission(p._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={2} className="muted">
                  No permissions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ===== Modal (Create / Edit) ===== */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target.classList.contains("modal-backdrop")) setModalOpen(false);
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingPermission ? "Edit Permission" : "Create Permission"}</h3>
              <button className="icon" onClick={() => setModalOpen(false)}>
                ✕
              </button>
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
                <button type="button" className="ghost" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {editingPermission ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
