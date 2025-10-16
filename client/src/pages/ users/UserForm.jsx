// // client/src/pages/users/UserForm.jsx
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import axiosClient from "../../api/axiosClient";

// export default function UserForm() {
//   const { id } = useParams();
//   const nav = useNavigate();
//   const isEdit = Boolean(id);

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [roles, setRoles] = useState([]);
//   const [roleId, setRoleId] = useState("");

//   useEffect(() => {
//     (async () => {
//       const r = await axiosClient.get("/roles");
//       setRoles(r.data);
//       if (r.data.length && !roleId) setRoleId(r.data[0]._id);
//     })();
//   }, []);

//   useEffect(() => {
//     if (!isEdit) return;
//     (async () => {
//       const u = await axiosClient.get(`/users/${id}`); // اعمل endpoint show بالباك
//       setName(u.data.name);
//       setEmail(u.data.email);
//       setRoleId(u.data.role?._id || u.data.role);
//     })();
//   }, [id, isEdit]);

//   const submit = async (e) => {
//     e.preventDefault();
//     if (isEdit) {
//       await axiosClient.put("/users/update-role", { userId: id, roleId });
//       nav("/users");
//     } else {
//       await axiosClient.post("/auth/register", { name, email, password, role: roleId });
//       nav("/users");
//     }
//   };

//   return (
//     <DashboardLayout>
//       <h2>{isEdit ? "Edit User" : "Create User"}</h2>
//       <form className="form" onSubmit={submit}>
//         {!isEdit && (
//           <>
//             <label>Name</label>
//             <input value={name} onChange={e=>setName(e.target.value)} required />
//             <label>Email</label>
//             <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
//             <label>Password</label>
//             <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
//           </>
//         )}

//         <label>Role</label>
//         <select value={roleId} onChange={e=>setRoleId(e.target.value)}>
//           {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
//         </select>

//         <div className="form-actions">
//           <button type="submit" className="btn">{isEdit ? "Save" : "Create"}</button>
//         </div>
//       </form>
//     </DashboardLayout>
//   );
// }
