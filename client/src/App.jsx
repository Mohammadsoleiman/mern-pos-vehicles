// src/App.jsx
import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// 🔐 Contexts
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";

import { ClerkAuthProvider } from "./context/clerk/ClerkAuthContext";
import { ClerkVehicleProvider } from "./context/clerk/VehicleContext";
import { ClerkSalesProvider } from "./context/clerk/SalesContext";
import { ClerkCustomerProvider } from "./context/clerk/CustomerContext";

// 🔒 Role-based Route
import RoleRoute from "./components/RoleRoute";

// 🧭 Layouts & Pages
import Admin from "./components/admin/Admin";
import Accounting from "./pages/Accounting";
import Cashier from "./pages/Cashier";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

// 📊 Admin Pages
import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/users";
import RolesPage from "./pages/roles";
import PermissionsPage from "./pages/permissions/PermissionsPage";
import VehiclesList from "./pages/Vehicles/VehiclesList";
import VehicleCreate from "./pages/Vehicles/VehicleCreate";
import VehicleEdit from "./pages/Vehicles/VehicleEdit";
import VehicleShow from "./pages/Vehicles/VehicleShow";

// 💼 Accounting Pages
import FeaturesOverview from "./pages/accountingstuff/FeaturesOverview";
import Transactions from "./pages/accountingstuff/Transactions";
import Income from "./pages/accountingstuff/Income";
import Expenses from "./pages/accountingstuff/Expenses";
import Reports from "./pages/accountingstuff/Reports";
import Accounts from "./pages/accountingstuff/Accounts";
import Employees from "./pages/accountingstuff/Employees";
import Settings from "./pages/accountingstuff/Settings";

// 🧩 Modular Accounting Vehicle Pages
import VehicleList from "./pages/accountingstuff/vehicles/VehicleList";
import VehicleCreatePage from "./pages/accountingstuff/vehicles/VehicleCreate";
import VehicleEditPage from "./pages/accountingstuff/vehicles/VehicleEdit";
import VehicleShowPage from "./pages/accountingstuff/vehicles/VehicleShow";

// 💰 Clerk Pages
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

                        {/* 🟢 Public Routes */}
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* 🟣 ADMIN SECTION */}
                        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                          <Route path="/admin" element={<Admin />}>
                            <Route index element={<Dashboard />} />
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="users" element={<UsersPage />} />
                            <Route path="roles" element={<RolesPage />} />
                            <Route path="permissions" element={<PermissionsPage />} />
                            <Route path="vehicles" element={<VehiclesList />} />
                            <Route path="vehicles/create" element={<VehicleCreate />} />
                            <Route path="vehicles/edit/:id" element={<VehicleEdit />} />
                            <Route path="vehicles/show/:id" element={<VehicleShow />} />
                          </Route>
                        </Route>

                        {/* 💼 ACCOUNTING SECTION */}
                        <Route
                          path="/accounting"
                          element={
                            <RoleRoute allowedRoles={["accounting", "admin"]}>
                              <Accounting />
                            </RoleRoute>
                          }
                        >
                          <Route path="featuresoverview" element={<FeaturesOverview />} />
                          <Route index element={<FeaturesOverview />} />
                          <Route path="transactions" element={<Transactions />} />
                          <Route path="income" element={<Income />} />
                          <Route path="expenses" element={<Expenses />} />
                          <Route path="reports" element={<Reports />} />
                          <Route path="accounts" element={<Accounts />} />
                          <Route path="employees" element={<Employees />} />
                          <Route path="settings" element={<Settings />} />

                          {/* 🚗 ACCOUNTANT VEHICLE PAGES */}
                          <Route path="vehicles" element={<VehicleList />} />
                          <Route path="vehicles/create" element={<VehicleCreatePage />} />
                          <Route path="vehicles/edit/:id" element={<VehicleEditPage />} />
                          <Route path="vehicles/show/:id" element={<VehicleShowPage />} />
                        </Route>

                        {/* 💵 CLERK SECTION */}
                        <Route
                          path="/cashier"
                          element={
                            <RoleRoute allowedRoles={["clerk", "cashier", "admin"]}>
                              <Cashier />
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

                        {/* 🚫 Fallback */}
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