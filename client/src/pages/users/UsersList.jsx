import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import styles from "../../styles/users.module.css";

export default function UsersList() {
  const { settings } = useSettings();
  const layout = settings.layout || "list";

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

  const openCreate = () => {
    setEditingUser(null);
    setForm({ name: "", email: "", password: "", role: "" });
    setModalOpen(true);
  };

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

  const deleteUser = async (id) => {
    if (!confirm("Delete user?")) return;
    await axiosClient.delete(`/auth/users/${id}`);
    fetchUsers();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: form.name, email: form.email, role: form.role };
    if (form.password.trim() !== "") payload.password = form.password;

    if (editingUser) {
      await axiosClient.put(`/auth/users/${editingUser._id || editingUser.id}`, payload);
    } else {
      await axiosClient.post("/auth/users", payload);
    }

    setModalOpen(false);
    fetchUsers();
  };

  return (
    <div>
      {/* ===== Header ===== */}
      <div className={styles.usersHeader}>
        <h2>Users</h2>

        <div className={styles.toolbar}>
          <input
            placeholder="Search users..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button className={styles.primary} onClick={openCreate}>
            + Create User
          </button>

          <button className={styles.secondary} onClick={() => navigate("/admin/roles")}>
            🧩 Roles
          </button>

          <button className={styles.secondary} onClick={() => navigate("/admin/permissions")}>
            🔒 Permissions
          </button>
        </div>
      </div>

      {/* ✅ LIST VIEW */}
      {layout === "list" && (
        <div className={styles.usersBody}>
          <div className={styles.card}>
            {loading && <div className={styles.muted}>Loading…</div>}
            {!loading && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th style={{ width: 180 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u._id || u.id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role?.name || u.role || "no-role"}</td>
 <td>
  <div className={styles.tableActions} style={{ display: "flex", flexWrap: "nowrap", gap: "6px" }}>
    <button className={styles.ghost} style={{ whiteSpace: "nowrap" }} onClick={() => openEdit(u)}>
      ✏ Edit
    </button>
    <button className={styles.danger} style={{ whiteSpace: "nowrap" }} onClick={() => deleteUser(u._id || u.id)}>
      🗑 Delete
    </button>
  </div>
</td>
            </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td colSpan={4} className={styles.muted}>
                        No users found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ✅ GRID VIEW */}
      {layout === "grid" && (
        <div className={styles.gridUsers}>
          {filtered.map((u) => (
            <div className={styles.userCard} key={u._id || u.id}>
              <div className={styles.avatarCircle}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <p><strong>{u.name}</strong></p>
              <p className={styles.email}>{u.email}</p>
              <p className={styles.role}>{u.role?.name || u.role || "No Role"}</p>
              <div className={styles.cardActions}>
                <button className={styles.edit} onClick={() => openEdit(u)}>
                  ✏ Edit
                </button>
                <button className={styles.delete} onClick={() => deleteUser(u._id || u.id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
          {!filtered.length && !loading && (
            <div className={styles.muted}>No users found</div>
          )}
        </div>
      )}

      {/* ===== Modal ===== */}
      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h3>{editingUser ? "Edit User" : "Create User"}</h3>
              <button className={styles.icon} onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={`${styles.form} ${styles.modalBody}`}>
              <label>
                <span>Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="Enter full name"
                />
              </label>

              <label>
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="user@example.com"
                />
              </label>

              <label>
                <span>Password</span>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={editingUser ? "Leave blank to keep current" : "Enter password"}
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

              <div className={styles.actionsRow}>
                <button
                  type="button"
                  className={styles.ghost}
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primary}>
                  {editingUser ? "Save" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}