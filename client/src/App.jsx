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
// ???/
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔐 Contexts
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";

// 🔒 Role-based route
import RoleRoute from "./components/RoleRoute";

// 🧭 Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Accounting from "./pages/Accounting";
import Cashier from "./pages/Cashier";
import Unauthorized from "./pages/Unauthorized";

// 📊 Accounting sub-pages
import FeaturesOverview from "./pages/accountingstuff/FeaturesOverview.jsx";
import Transactions from "./pages/accountingstuff/Transactions.jsx";
import Reports from "./pages/accountingstuff/Reports.jsx";
import Accounts from "./pages/accountingstuff/Accounts.jsx";
import Vehicles from "./pages/accountingstuff/Vehicles.jsx";
import Settings from "./pages/accountingstuff/Settings.jsx";
import Employees from "./pages/accountingstuff/Employees.jsx";

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <ExpenseProvider>
          <VehicleProvider>
            <BrowserRouter>
              <Routes>
                {/* Public /}
                <Route path="/" element={<Login />} />

                {/ Admin Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <RoleRoute allowedRoles={["admin"]}>
                      <Dashboard />
                    </RoleRoute>
                  }
                />
{/* Accounting /}
                <Route
                  path="/accounting/"
                  element={
                    <RoleRoute allowedRoles={["accounting", "admin"]}>
                      <Accounting />
                    </RoleRoute>
                  }
                >
                  <Route index element={<FeaturesOverview />} />
                  <Route path="transactions" element={<Transactions />} />
                  <Route path="reports" element={<Reports />} />
                  <Route path="accounts" element={<Accounts />} />
                  <Route path="vehicles" element={<Vehicles />} />
                  <Route path="employees" element={<Employees />} />
                  <Route path="settings" element={<Settings />} />
                </Route>

                {/* Cashier /}
                <Route
                  path="/cashier"
                  element={
                    <RoleRoute allowedRoles={["clerk", "cashier", "admin"]}>
                      <Cashier />
                    </RoleRoute>
                  }
                />

                {/ Unauthorized /}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/ Fallback /}
                <Route path="" element={<Navigate to="/unauthorized" replace />} />
              </Routes>
            </BrowserRouter>
          </VehicleProvider>
        </ExpenseProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}