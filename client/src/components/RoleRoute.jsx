import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 🧠 RoleRoute: يسمح بالدخول فقط لمن لديهم صلاحيات محددة
export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  // 🚪 المستخدم مش داخل النظام
  if (!user) return <Navigate to="/" replace />;

  const userRole = user.role;

  // ✅ إذا كان الدور ضمن المسموح
  if (allowedRoles.includes(userRole)) {
    return children;
  }

  // 🚫 إذا ما عنده صلاحية
  return <Navigate to="/unauthorized" replace />;
}
