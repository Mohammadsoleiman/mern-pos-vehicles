import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoleRoute from "./components/RoleRoute";

// 🧭 Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Accounting from "./pages/Accounting";
import Cashier from "./pages/Cashier";
import Unauthorized from "./pages/Unauthorized"; // ✅ تم الاستيراد هنا

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 🔓 Public Route */}
          <Route path="/" element={<Login />} />

          {/* 🔒 Protected Routes by Role */}
          <Route
            path="/dashboard"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <Dashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/accounting"
            element={
              <RoleRoute allowedRoles={["accounting", "admin"]}>
                <Accounting />
              </RoleRoute>
            }
          />

          <Route
            path="/cashier"
            element={
              <RoleRoute allowedRoles={["clerk", "cashier", "admin"]}>
                <Cashier />
              </RoleRoute>
            }
          />

          {/* 🚫 Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ❌ Fallback 404 */}
          <Route path="*" element={<Navigate to="/unauthorized" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
