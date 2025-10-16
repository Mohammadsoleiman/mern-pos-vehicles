// // client/src/pages/permissions/PermissionsList.jsx
// import { useEffect, useState } from "react";
// import DashboardLayout from "../../layouts/DashboardLayout";
// import axiosClient from "../../api/axiosClient";

// export default function PermissionsList() {
//   const [perms, setPerms] = useState([]);
//   const [name, setName]   = useState("");

//   const load = async () => {
//     const r = await axiosClient.get("/permissions");
//     setPerms(r.data);
//   };

//   const create = async (e) => {
//     e.preventDefault();
//     await axiosClient.post("/permissions/create", { name });
//     setName("");
//     load();
//   };

//   useEffect(() => { load(); }, []);

//   return (
//     <DashboardLayout>
//       <h2>Permissions</h2>
//       <form onSubmit={create} className="inline-form">
//         <input placeholder="permission key, e.g. create_product" value={name} onChange={e=>setName(e.target.value)} />
//         <button className="btn">Create</button>
//       </form>

//       <ul className="list">
//         {perms.map(p => <li key={p._id}>{p.name}</li>)}
//       </ul>
//     </DashboardLayout>
//   );
// }
