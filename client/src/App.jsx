import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import RoleRoute from "./components/RoleRoute";

import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout"; // ✅
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/users/index";

// ✅ فقط Roles
import RolesPage from "./pages/roles/index";

// ✅ أضفنا PermissionsPage هنا 👇
import PermissionsPage from "./pages/permissions/PermissionsPage";

import Unauthorized from "./pages/Unauthorized";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<Login />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <RoleRoute allowedRoles={["admin"]}>
                <DashboardLayout /> {/* ✅ ثابت */}
              </RoleRoute>
            }
          >
            {/* ⬇️ صفحات داخل نفس الـ Layout */}
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersPage />} />

            {/* ✅ فقط صفحة Roles */}
            <Route path="roles" element={<RolesPage />} />

            {/* ✅ أضفنا صفحة Permissions هون */}
            <Route path="permissions" element={<PermissionsPage />} />
          </Route>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Navigate to="/unauthorized" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
