import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import styles from "../../styles/users.module.css";

export default function RolesList() {
  const { settings } = useSettings();
  const layout = settings.layout || "list";

  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [form, setForm] = useState({ name: "", permissions: [] });

  const navigate = useNavigate();

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
      <div className={styles.usersHeader}>
        <h2>Roles</h2>
        <div className={styles.toolbar}>
          <input
            placeholder="Search roles..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className={styles.primary} onClick={openCreate}>
            + Create Role
          </button>

          <button className={styles.secondary} onClick={() => navigate("/admin/users")}>
            👤 Users
          </button>
          <button className={styles.secondary} onClick={() => navigate("/admin/roles")}>
            🧩 Roles
          </button>
          <button className={styles.secondary} onClick={() => navigate("/admin/permissions")}>
            🔒 Permissions
          </button>
        </div>
      </div>

      {/* ✅ LIST MODE */}
      {layout === "list" && (
        <div className={styles.usersBody}>
          <div className={styles.card}>
            {loading && <div className={styles.muted}>Loading…</div>}
            {!loading && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Permissions</th>
                    <th style={{ width: 180 }}>Actions</th>
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
  <div className={styles.tableActions} style={{ display: "flex", flexWrap: "nowrap", gap: "6px" }}>
    <button className={styles.ghost} style={{ whiteSpace: "nowrap" }} onClick={() => openEdit(r)}>
      ✏ Edit
    </button>
    <button className={styles.danger} style={{ whiteSpace: "nowrap" }} onClick={() => deleteRole(r._id)}>
      🗑 Delete
    </button>
  </div>
</td>

                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td colSpan={3} className={styles.muted}>
                        No roles found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ✅ GRID MODE */}
      {layout === "grid" && (
        <div className={styles.gridUsers}>
          {filtered.map((r) => (
            <div className={styles.userCard} key={r._id}>
              <div className={styles.avatarCircle}>{r.name.charAt(0).toUpperCase()}</div>

              <p><strong>{r.name}</strong></p>
              <p className={styles.role}>
                {r.permissions?.length
                  ? r.permissions.map((p) => (typeof p === "object" ? p.name : p)).join(", ")
                  : "No permissions"}
              </p>

              <div className={styles.cardActions}>
                <button className={styles.edit} onClick={() => openEdit(r)}>
                  ✏ Edit
                </button>
                <button className={styles.delete} onClick={() => deleteRole(r._id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== MODAL ===== */}
      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h3>{editingRole ? "Edit Role" : "Create Role"}</h3>
              <button className={styles.icon} onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={`${styles.form} ${styles.modalBody}`}>
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
                <div className={styles.permGrid}>
                  {permissions.map((perm) => (
                    <div key={perm._id} className={styles.check}>
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
                      <span>{perm.name}</span>
                    </div>
                  ))}
                </div>
              </label>

              <div className={styles.actionsRow}>
                <button type="button" className={styles.ghost} onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primary}>
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