import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate, useLocation } from "react-router-dom";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/auth/users");
      setUsers(data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch roles
  const fetchRoles = async () => {
    try {
      const { data } = await axiosClient.get("/roles");
      setRoles(data);
    } catch (err) {
      console.error("❌ Error fetching roles:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // 🔹 Filter users by search
  const filtered = useMemo(() => {
    if (!q.trim()) return users;
    const s = q.toLowerCase();
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s) ||
        (u.role?.name || u.role)?.toString().toLowerCase().includes(s)
    );
  }, [users, q]);

  // 🔹 Open Create Modal
  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", role: "" });
    setModalOpen(true);
  };

  // 🔹 Open Edit Modal
  const openEdit = (u) => {
    setEditingUser(u);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role?._id || u.role || "",
    });
    setModalOpen(true);
  };

  // 🔹 Delete user
  const deleteUser = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await axiosClient.delete(`/auth/users/${id}`);
      alert("🗑️ User deleted successfully!");
      fetchUsers();
    } catch (err) {
      console.error("❌ Error deleting user:", err);
      alert("❌ Failed to delete user!");
    }
  };

  // 🔹 Submit form (Create / Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    if (form.password && form.password.trim() !== "") {
      payload.password = form.password;
    }
    try {
      if (editingUser) {
        await axiosClient.put(`/auth/users/${editingUser._id || editingUser.id}`, payload);
        alert("✅ User updated successfully!");
      } else {
        await axiosClient.post("/auth/users", payload);
        alert("✅ User created successfully!");
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error("❌ Error saving user:", err);
      alert("❌ Failed to save user!");
    }
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <div className="users-header">
        <h2>Users</h2>
        <div className="toolbar">
          <input
            placeholder="Search users..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="primary" onClick={openCreate}>
            + Create User
          </button>

          {/* 🔹 Navigation Buttons */}
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
            className={`secondary ${location.pathname.includes("/permissions") ? "active" : ""}`}
            style={{ marginLeft: "8px" }}
            onClick={() => navigate("/admin/permissions")}
          >
            🔒 Permissions
          </button>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="users-body card" style={{ marginTop: "25px" }}>
        {loading && <div className="muted">Loading…</div>}
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ width: 160 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u._id || u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role?.name || u.role || "no-role"}</td>
                <td>
                  <button className="ghost" onClick={() => openEdit(u)}>
                    Edit
                  </button>
                  <button className="danger" onClick={() => deleteUser(u._id || u.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={4} className="muted">
                  No users
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
              <h3>{editingUser ? "Edit User" : "Create User"}</h3>
              <button className="icon" onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="form modal-body">
              <label>
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editingUser ? "Leave blank to keep current" : ""}
                />
              </label>

              <label>
                <span>Role</span>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="">Select role</option>
                  {roles.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name}
                    </option>
                  ))}
                </select>
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
                  {editingUser ? "Save Changes" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
