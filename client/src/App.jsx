// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🧠 Contexts
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";
import { ClerkAuthProvider } from "./context/clerk/ClerkAuthContext";
import { ClerkVehicleProvider } from "./context/clerk/VehicleContext";
import { ClerkSalesProvider } from "./context/clerk/SalesContext";
import { ClerkCustomerProvider } from "./context/clerk/CustomerContext";

// 🔒 Role Route
import RoleRoute from "./components/RoleRoute";

// 🧭 Layouts & Pages
import Admin from "./components/admin/Admin";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// 📊 Admin Pages
import Dashboard from "./pages/Dashboard";
import Setting from "./pages/Settings";
import UsersPage from "./pages/users/index";
import RolesPage from "./pages/roles/index";
import PermissionsPage from "./pages/permissions/PermissionsPage";

// 🚗 Admin Vehicles
import VehiclesList from "./pages/Vehicles/VehiclesList";
import VehicleCreate from "./pages/Vehicles/VehicleCreate";
import VehicleEdit from "./pages/Vehicles/VehicleEdit";
import VehicleShow from "./pages/Vehicles/VehicleShow";

// 💼 Accounting Pages
import Accounting from "./pages/Accounting";
import FeaturesOverview from "./pages/accountingstuff/FeaturesOverview";
import Transactions from "./pages/accountingstuff/Transactions";
import Reports from "./pages/accountingstuff/Reports";
import Accounts from "./pages/accountingstuff/Accounts";
import Vehicles from "./pages/accountingstuff/Vehicles";
import Employees from "./pages/accountingstuff/Employees";
import Settings from "./pages/accountingstuff/Settings";

// 💰 Clerk Pages
import Cashier from "./pages/Cashier";
import ClerkDashboard from "./pages/clerk/ClerkDashboard";
import ClerkSales from "./pages/clerk/ClerkSales";
import ClerkVehicles from "./pages/clerk/ClerkVehicles";
import ClerkCustomers from "./pages/clerk/ClerkCustomers";
import ClerkReports from "./pages/clerk/ClerkReports";
import ClerkSettings from "./pages/clerk/ClerkSettings";

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <ExpenseProvider>
          <VehicleProvider>
            <ClerkAuthProvider>
              <ClerkVehicleProvider>
                <ClerkSalesProvider>
                  <ClerkCustomerProvider>
                    <BrowserRouter>
                      <Routes>
                        {/* 🟢 Public */}
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />

                        {/* 🟣 ADMIN SECTION */}
                        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                          <Route path="/admin" element={<Admin />}>
                            <Route index element={<Dashboard />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="users" element={<UsersPage />} />
                            <Route path="roles" element={<RolesPage />} />
                            <Route path="permissions" element={<PermissionsPage />} />
                              <Route path="reports" element={<div>📊 Reports</div>} />
                            <Route path="settings" element={<Setting />} />
                            <Route path="vehicles" element={<VehiclesList />} />
                            <Route path="vehicles/create" element={<VehicleCreate />} />
                            <Route path="vehicles/edit/:id" element={<VehicleEdit />} />
                            <Route path="vehicles/show/:id" element={<VehicleShow />} />
                            {/* ✅ Added these inside Admin layout */}
                            <Route path="reports" element={<Reports />} />
                            <Route path="settings" element={<Settings />} />
                          </Route>
                        </Route>

                        {/* 🧾 ACCOUNTING SECTION */}
                        <Route
                          path="/accounting"
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

                        {/* 💵 CLERK SECTION */}
                        <Route
                          path="/Cashier"
                          element={
                            <RoleRoute allowedRoles={["clerk", "cashier", "admin"]}>
                              <Cashier /> {/* Cashier.jsx acts as layout for clerk */}
                            </RoleRoute>
                          }
                        >
                          <Route index element={<ClerkDashboard />} />
                          <Route path="dashboard" element={<ClerkDashboard />} />
                          <Route path="sales" element={<ClerkSales />} />
                          <Route path="vehicles" element={<ClerkVehicles />} />
                          <Route path="customers" element={<ClerkCustomers />} />
                          <Route path="reports" element={<ClerkReports />} />
                          <Route path="settings" element={<ClerkSettings />} />
                        </Route>

                        {/* 🚫 Unauthorized */}
                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route path="*" element={<Navigate to="/unauthorized" replace />} />
                      </Routes>
                    </BrowserRouter>
                  </ClerkCustomerProvider>
                </ClerkSalesProvider>
              </ClerkVehicleProvider>
            </ClerkAuthProvider>
          </VehicleProvider>
        </ExpenseProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}
