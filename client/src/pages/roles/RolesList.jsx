import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";

export default function RolesList() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState({ name: "", permissions: [] });

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Fetch roles
  const fetchRoles = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/roles");
      setRoles(data);
    } catch (err) {
      console.error("❌ Error fetching roles:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch permissions
  const fetchPermissions = async () => {
    try {
      const { data } = await axiosClient.get("/permissions");
      setPermissions(data);
    } catch (err) {
      console.error("❌ Error fetching permissions:", err);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  // 🔹 Filter roles
  const filtered = useMemo(() => {
    if (!q.trim()) return roles;
    const s = q.toLowerCase();
    return roles.filter((r) => r.name.toLowerCase().includes(s));
  }, [roles, q]);

  // 🔹 Open create modal
  const openCreate = () => {
    setEditingRole(null);
    setForm({ name: "", permissions: [] });
    setModalOpen(true);
  };

  // 🔹 Open edit modal
  const openEdit = (r) => {
    setEditingRole(r);
    setForm({
      name: r.name,
      permissions: r.permissions.map((p) => (typeof p === "object" ? p._id : p)),
    });
    setModalOpen(true);
  };

  // 🔹 Delete role
  const deleteRole = async (id) => {
    if (!confirm("Are you sure you want to delete this role?")) return;
    try {
      await axiosClient.delete(`/roles/${id}`);
      alert("🗑️ Role deleted successfully!");
      fetchRoles();
    } catch (err) {
      console.error("❌ Error deleting role:", err);
      alert("❌ Failed to delete role!");
    }
  };

  // 🔹 Submit form (Create / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRole) {
        await axiosClient.put(`/roles/${editingRole._id}`, form);
        alert("✅ Role updated successfully!");
      } else {
        await axiosClient.post("/roles/create", form);
        alert("✅ Role created successfully!");
      }
      setModalOpen(false);
      fetchRoles();
    } catch (err) {
      console.error("❌ Error saving role:", err);
      alert("❌ Failed to save role!");
    }
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="roles-header">
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

          {/* ✅ Navigation Buttons */}
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
      <div className="roles-body card" style={{ marginTop: "25px" }}>
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
                  {r.permissions && r.permissions.length > 0
                    ? r.permissions
                        .map((p) => (typeof p === "object" ? p.name : p))
                        .join(", ")
                    : "No permissions"}
                </td>
                <td>
                  <button className="ghost" onClick={() => openEdit(r)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => deleteRole(r._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={3} className="muted">
                  No roles found
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
              <h3>{editingRole ? "Edit Role" : "Create Role"}</h3>
              <button className="icon" onClick={() => setModalOpen(false)}>
                ✕
              </button>
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

              {/* ✅ Dynamic Permissions from DB */}
              <label>
                <span>Permissions</span>
                <div className="permissions-checkboxes">
                  {permissions.map((perm) => (
                    <label key={perm._id} style={{ display: "block" }}>
                      <input
                        type="checkbox"
                        checked={form.permissions.includes(perm._id)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...form.permissions, perm._id]
                            : form.permissions.filter((p) => p !== perm._id);
                          setForm({ ...form, permissions: updated });
                        }}
                      />
                      {perm.name}
                    </label>
                  ))}
                </div>
              </label>

              <div className="actions-row">
                <button
                  type="button"
                  className="ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary">
                  {editingRole ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
