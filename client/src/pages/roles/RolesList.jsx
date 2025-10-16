// // client/src/pages/roles/RolesList.jsx
// import { useEffect, useState } from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import axiosClient from "../../api/axiosClient";

// export default function RolesList() {
//   const [roles, setRoles] = useState([]);
//   const [name, setName] = useState("");

//   const load = async () => {
//     const r = await axiosClient.get("/roles");
//     setRoles(r.data);
//   };

//   const create = async (e) => {
//     e.preventDefault();
//     await axiosClient.post("/roles/create", { name, permissions: [] });
//     setName("");
//     load();
//   };

//   useEffect(() => { load(); }, []);

//   return (
//     <DashboardLayout>
//       <h2>Roles</h2>
//       <form onSubmit={create} className="inline-form">
//         <input placeholder="Role name" value={name} onChange={e=>setName(e.target.value)} />
//         <button className="btn">Create</button>
//       </form>
//       <ul className="list">
//         {roles.map(r => (
//           <li key={r._id}>{r.name} — {r.permissions?.length || 0} perms</li>
//         ))}
//       </ul>
//     </DashboardLayout>
//   );
// }
