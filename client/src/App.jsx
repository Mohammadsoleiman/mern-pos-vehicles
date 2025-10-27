// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🧠 Contexts
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";

// 🔒 Role-based Route
import RoleRoute from "./components/RoleRoute";

// 🎨 Layout
import Admin from "./components/admin/Admin";

// 🟢 صفحات عامة
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// 📊 صفحات الإدمن
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/users/index";
import RolesPage from "./pages/roles/index";
import PermissionsPage from "./pages/permissions/PermissionsPage";

// 💼 باقي الصفحات
import Accounting from "./pages/Accounting";
import Cashier from "./pages/Cashier";

// 📈 صفحات المحاسب (شريكك)
import FeaturesOverview from "./pages/accountingstuff/FeaturesOverview.jsx";
import Transactions from "./pages/accountingstuff/Transactions.jsx";
import Reports from "./pages/accountingstuff/Reports.jsx";
import Accounts from "./pages/accountingstuff/Accounts.jsx";
import Vehicles from "./pages/accountingstuff/Vehicles.jsx";
import Employees from "./pages/accountingstuff/Employees.jsx";
import Settings from "./pages/accountingstuff/Settings.jsx";
// 🚗 Admin Vehicles pages
import VehiclesList from "./pages/Vehicles/VehiclesList";
import VehicleCreate from "./pages/Vehicles/VehicleCreate";
import VehicleEdit from "./pages/Vehicles/VehicleEdit";
import VehicleShow from "./pages/Vehicles/VehicleShow"; // تأكد الاسم

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <ExpenseProvider>
          <VehicleProvider>
            <BrowserRouter>
              <Routes>

                {/* 🟢 Public Route */}
                <Route path="/" element={<Login />} />

                {/* 🟣 Admin Layout */}
             <Route element={<RoleRoute allowedRoles={["admin"]} />}>
  <Route path="/admin" element={<Admin />}>
    <Route index element={<Dashboard />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="roles" element={<RolesPage />} />
    <Route path="permissions" element={<PermissionsPage />} />
    <Route path="reports" element={<div>📊 Reports</div>} />
    <Route path="settings" element={<div>⚙️ Settings</div>} />

    {/* 🚗 Vehicles Section */}
    <Route path="vehicles" element={<VehiclesList />} />
    <Route path="vehicles/create" element={<VehicleCreate />} />
    <Route path="vehicles/edit/:id" element={<VehicleEdit />} />
    <Route path="vehicles/show/:id" element={<VehicleShow />} />

  </Route>
</Route>


                {/* 🧾 Accounting */}
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

                {/* 💰 Cashier */}
                <Route
                  path="/cashier"
                  element={
                    <RoleRoute allowedRoles={["clerk", "cashier", "admin"]}>
                      <Cashier />
                    </RoleRoute>
                  }
                />

                {/* 🚫 Unauthorized + fallback */}
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<Navigate to="/unauthorized" replace />} />
              </Routes>
            </BrowserRouter>
          </VehicleProvider>
        </ExpenseProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}
