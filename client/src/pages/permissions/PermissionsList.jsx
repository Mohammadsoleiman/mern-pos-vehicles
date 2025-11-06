import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { useSettings } from "../../context/SettingsContext";
import styles from "../../styles/users.module.css";

export default function PermissionsList() {
  const { settings } = useSettings();
  const layout = settings.layout || "list";

  const [permissions, setPermissions] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [form, setForm] = useState({ name: "" });

  const navigate = useNavigate();

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
      <div className={styles.usersHeader}>
        <h2>Permissions</h2>
        <div className={styles.toolbar}>
          <input
            placeholder="Search permissions..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <button className={styles.primary} onClick={openCreate}>
            + Create Permission
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
                    <th style={{ width: 180 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p._id}>
                      <td>{p.name}</td>
                    <td>
  <div className={styles.tableActions} style={{ display: "flex", flexWrap: "nowrap", gap: "6px" }}>
    <button className={styles.ghost} style={{ whiteSpace: "nowrap" }} onClick={() => openEdit(p)}>
      ✏ Edit
    </button>
    <button className={styles.danger} style={{ whiteSpace: "nowrap" }} onClick={() => deletePermission(p._id)}>
      🗑 Delete
    </button>
  </div>
</td>

                    </tr>
                  ))}
                  {!filtered.length && (
                    <tr>
                      <td colSpan={2} className={styles.muted}>
                        No permissions found
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
          {filtered.map((p) => (
            <div className={styles.userCard} key={p._id}>
              <div className={styles.avatarCircle}>{p.name.charAt(0).toUpperCase()}</div>

              <p><strong>{p.name}</strong></p>

              <div className={styles.cardActions}>
                <button className={styles.edit} onClick={() => openEdit(p)}>
                  ✏ Edit
                </button>
                <button className={styles.delete} onClick={() => deletePermission(p._id)}>
                  🗑 Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className={styles.modalBackdrop} onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHead}>
              <h3>{editingPermission ? "Edit Permission" : "Create Permission"}</h3>
              <button className={styles.icon} onClick={() => setModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className={`${styles.form} ${styles.modalBody}`}>
              <label>
                <span>Permission Name</span>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </label>

              <div className={styles.actionsRow}>
                <button type="button" className={styles.ghost} onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primary}>
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