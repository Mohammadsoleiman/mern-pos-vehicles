import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RoleRoute({ allowedRoles, children }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/" replace />;

  // ✅ تطبيع الدور ليصير String مهما كان Object أو ObjectId
  const normalizedRole =
    user.role?.name ||
    user.role ||
    "";

  // ✅ clerk و cashier نفس الشي (ما غيرنا المنطق)
  if (!allowedRoles.includes(normalizedRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children || <Outlet />;
}
