// client/src/pages/users/UserEdit.jsx
import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function UserEdit({ user, onBack }) {
  const [roles, setRoles] = useState([]);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    role: user?.role?._id || user?.role || "",
  });

  useEffect(() => {
    (async () => {
      const { data } = await axiosClient.get("/roles");
      setRoles(data);
    })();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.password) delete payload.password;
      await axiosClient.put(`/auth/users/${user._id}`, payload);
      alert("✅ User updated!");
      onBack();
    } catch (err) {
      console.error("❌ Error updating user:", err);
      alert("Failed to update user");
    }
  };

  return (
    <div className="card form-page">
      <h2>Edit User</h2>
      <form onSubmit={submit} className="form">
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
            placeholder="•••••••• (unchanged)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </label>

        <label>
          <span>Role</span>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            required
          >
            <option value="">Select role…</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </label>

        <div className="actions-row">
          <button type="button" className="ghost" onClick={onBack}>
            Cancel
          </button>
          <button className="primary">Save</button>
        </div>
      </form>
    </div>
  );
}
