// import { Navigate, Outlet } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// export default function RoleRoute({ allowedRoles, children }) {
//   const { user, loading } = useAuth();

//   if (loading) return <div>Loading...</div>;

//   if (!user) return <Navigate to="/" replace />;

//   // ✅ تطبيع الدور ليصير String مهما كان Object أو ObjectId
//   const normalizedRole =
//     user.role?.name ||
//     user.role ||
//     "";

//   // ✅ clerk و cashier نفس الشي (ما غيرنا المنطق)
//   if (!allowedRoles.includes(normalizedRole)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   return children || <Outlet />;
// }
// src/components/RoleRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  // ✅ نطبع الدور مهما كان شكل البيانات
  const userRole =
    (typeof user.role === "string" ? user.role : user.role?.name)?.toLowerCase();

  const normalizedAllowedRoles = allowedRoles.map(r => r.toLowerCase());

  // ✅ إذا الدور غير مسموح → Unauthorized
  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}
