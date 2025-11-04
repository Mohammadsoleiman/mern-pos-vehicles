import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext"; // ✅ NEW
import "../../styles/usersGrid.css"; // ✅ نستخدم نفس ستايل الـ grid

export default function RolesList() {
  const { settings } = useSettings(); // ✅ نقرأ إعداد الواجهة
  const layout = settings.layout || "list"; // ✅ list أو grid

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState({ name: "", permissions: [] });

  const navigate = useNavigate();
  const location = useLocation();

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/roles");
      setRoles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const { data } = await axiosClient.get("/permissions");
      setPermissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const filtered = useMemo(() => {
    if (!q.trim()) return roles;
    const s = q.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(s));
  }, [roles, q]);

  const openCreate = () => {
    setEditingRole(null);
    setForm({ name: "", permissions: [] });
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditingRole(r);
    setForm({
      name: r.name,
      permissions: r.permissions.map((p) => (typeof p === "object" ? p._id : p)),
    });
    setModalOpen(true);
  };

  const deleteRole = async (id) => {
    if (!confirm("Delete role?")) return;
    await axiosClient.delete(`/roles/${id}`);
    fetchRoles();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingRole) {
      await axiosClient.put(`/roles/${editingRole._id}`, form);
    } else {
      await axiosClient.post("/roles/create", form);
    }
    setModalOpen(false);
    fetchRoles();
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="users-header">
        <h2>Roles</h2>
        <div className="toolbar">
          <input
            placeholder="Search roles..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="primary" onClick={openCreate}>
            + Create Role
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
                <th>Permissions</th>
                <th style={{ width: 160 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id}>
                  <td>{r.name}</td>
                  <td>
                    {r.permissions?.length
                      ? r.permissions.map((p) => (typeof p === "object" ? p.name : p)).join(", ")
                      : "No permissions"}
                  </td>
                  <td>
                    <button className="ghost" onClick={() => openEdit(r)}>✏ Edit</button>
                    <button className="danger" onClick={() => deleteRole(r._id)}>🗑 Delete</button>
                  </td>
                </tr>
              ))}
              {!filtered.length && <tr><td colSpan={3} className="muted">No roles found</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ GRID MODE */}
      {layout === "grid" && (
        <div className="grid-users">
          {filtered.map((r) => (
            <div className="user-card" key={r._id}>
              <div className="avatar-circle">{r.name.charAt(0).toUpperCase()}</div>

              <p><strong>{r.name}</strong></p>
              <p className="role small">
                {r.permissions?.length
                  ? r.permissions.map((p) => (typeof p === "object" ? p.name : p)).join(", ")
                  : "No permissions"}
              </p>

              <div className="card-actions">
                <button className="edit" onClick={() => openEdit(r)}>✏ Edit</button>
                <button className="delete" onClick={() => deleteRole(r._id)}>🗑 Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== MODAL ===== */}
      {modalOpen && (
        <div className="modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h3>{editingRole ? "Edit Role" : "Create Role"}</h3>
              <button className="icon" onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSubmit} className="form modal-body">
              <label>
                <span>Role Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <label>
                <span>Permissions</span>
                <div className="permissions-checkboxes">
                  {permissions.map((perm) => (
                    <label key={perm._id} style={{ display: "block" }}>
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(perm._id)}
                        onChange={() => {
                          setForm((prev) => ({
                            ...prev,
                            permissions: prev.permissions.includes(perm._id)
                              ? prev.permissions.filter((p) => p !== perm._id)
                              : [...prev.permissions, perm._id],
                          }));
                        }}
                      />
                      {perm.name}
                    </label>
                  ))}
                </div>
              </label>

              <div className="actions-row">
                <button type="button" className="ghost" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary">{editingRole ? "Save Changes" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
