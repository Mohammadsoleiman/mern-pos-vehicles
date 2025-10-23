// client/src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔐 Contexts
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";

// 🔒 Role-based route
import RoleRoute from "./components/RoleRoute";

// 🧭 Layout
import DashboardLayout from "./layouts/DashboardLayout";

// 🧭 Pages
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// 🧩 Admin Pages
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/users/index";
import RolesPage from "./pages/roles/index";
import PermissionsPage from "./pages/permissions/PermissionsPage";

// 🧾 Accounting Pages
import Accounting from "./pages/Accounting";
import FeaturesOverview from "./pages/accountingstuff/FeaturesOverview.jsx";
import Transactions from "./pages/accountingstuff/Transactions.jsx";
import Reports from "./pages/accountingstuff/Reports.jsx";
import Accounts from "./pages/accountingstuff/Accounts.jsx";
import Vehicles from "./pages/accountingstuff/Vehicles.jsx";
import Settings from "./pages/accountingstuff/Settings.jsx";
import Employees from "./pages/accountingstuff/Employees.jsx";

// 💰 Cashier
import Cashier from "./pages/Cashier";

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <ExpenseProvider>
          <VehicleProvider>
            <BrowserRouter>
              <Routes>
                {/* ================= PUBLIC ================= */}
                <Route path="/" element={<Login />} />

                {/* ================= ADMIN ================= */}
  <Route
  path="/admin"
  element={
    <RoleRoute allowedRoles={["admin"]}>
      <DashboardLayout />
    </RoleRoute>
  }
>
  <Route index element={<Navigate to="dashboard" replace />} />
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="users" element={<UsersPage />} />
    <Route path="vehicles" element={<div>🚗 Vehicles Page Coming Soon</div>} />
  <Route path="reports" element={<div>📊 Reports Page Coming Soon</div>} />
  <Route path="settings" element={<div>⚙️ Settings Page Coming Soon</div>} />
  <Route path="roles" element={<RolesPage />} />
  <Route path="permissions" element={<PermissionsPage />} />
</Route>


                {/* ================= ACCOUNTING ================= */}
                <Route
                  path="/accounting/*"
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

                {/* ================= CASHIER ================= */}
                <Route
                  path="/cashier"
                  element={
                    <RoleRoute allowedRoles={["clerk", "cashier", "admin"]}>
                      <Cashier />
                    </RoleRoute>
                  }
                />

                {/* ✅ TEST ROUTE (للتأكد أن الداشبورد شغال) */}
                <Route path="/test" element={<UsersPage />} />

                {/* ================= FALLBACK ================= */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
              </Routes>
            </BrowserRouter>
          </VehicleProvider>
        </ExpenseProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}
