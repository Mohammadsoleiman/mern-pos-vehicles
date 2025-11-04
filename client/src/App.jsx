import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔐 Contexts
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";
import { IncomeProvider } from "./context/ACCOUNTANT/IncomeContext";
import { SettingsProvider } from "./context/SettingsContext";
import ThemeSync from "./components/ThemeSync";

// 🧾 NEW — Live Summary Context
import { TransactionSummaryProvider } from "./context/ACCOUNTANT/TransactionSummaryContext";

// Clerk Contexts
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
import AdminSettings from "./pages/admin/Settings";

// 💼 Accounting Pages
import FeaturesOverview from "./pages/accountingstuff/FeaturesOverview";
import Transactions from "./pages/accountingstuff/Transactions";
import Income from "./pages/accountingstuff/Income";
import Expenses from "./pages/accountingstuff/Expenses";
import Reports from "./pages/accountingstuff/Reports";
import Settings from "./pages/accountingstuff/Settings";

// 👥 Employees
import EmployeeList from "./pages/accountingstuff/employees/EmployeeList";
import EmployeeCreate from "./pages/accountingstuff/employees/EmployeeCreate";
import EmployeeEdit from "./pages/accountingstuff/employees/EmployeeEdit";

// 🚗 Vehicles
import VehicleList from "./pages/accountingstuff/vehicles/VehicleList";
import VehicleCreatePage from "./pages/accountingstuff/vehicles/VehicleCreate";
import VehicleEditPage from "./pages/accountingstuff/vehicles/VehicleEdit";
import VehicleShowPage from "./pages/accountingstuff/vehicles/VehicleShow";

// 💳 Accounts
import AccountList from "./pages/accountingstuff/accounts/AccountList";
import AccountCreate from "./pages/accountingstuff/accounts/AccountCreate";
import AccountEdit from "./pages/accountingstuff/accounts/AccountEdit";
import AccountShow from "./pages/accountingstuff/accounts/AccountShow";

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
            <IncomeProvider>
              {/* ✅ Wrap inside Summary Provider (safe placement) */}
              <TransactionSummaryProvider>
                <ClerkAuthProvider>
                  <ClerkVehicleProvider>
                    <ClerkSalesProvider>
                      <ClerkCustomerProvider>
                        <SettingsProvider>
                          <ThemeSync>
                            <BrowserRouter>
                              <Routes>
                                {/* 🟢 Public */}
                                <Route path="/" element={<Login />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/unauthorized" element={<Unauthorized />} />

                                {/* 🟣 Admin */}
                                <Route element={<RoleRoute allowedRoles={["admin"]} />}>
                                  <Route path="/admin" element={<Admin />}>
                                    <Route index element={<Dashboard />} />
                                    <Route path="dashboard" element={<Dashboard />} />
                                    <Route path="users" element={<UsersPage />} />
                                    <Route path="roles" element={<RolesPage />} />
                                    <Route path="permissions" element={<PermissionsPage />} />
                                    <Route path="settings" element={<AdminSettings />} />
                                    <Route path="vehicles" element={<VehiclesList />} />
                                    <Route path="vehicles/create" element={<VehicleCreate />} />
                                    <Route path="vehicles/edit/:id" element={<VehicleEdit />} />
                                    <Route path="vehicles/show/:id" element={<VehicleShow />} />
                                  </Route>
                                </Route>

                                {/* 💼 Accounting */}
                                <Route
                                  path="/accounting"
                                  element={
                                    <RoleRoute allowedRoles={["accounting", "admin"]}>
                                      <Accounting />
                                    </RoleRoute>
                                  }
                                >
                                  <Route index element={<FeaturesOverview />} />
                                  <Route path="featuresoverview" element={<FeaturesOverview />} />
                                  <Route path="transactions" element={<Transactions />} />
                                  <Route path="income" element={<Income />} />
                                  <Route path="expenses" element={<Expenses />} />
                                  <Route path="reports" element={<Reports />} />
                                  <Route path="settings" element={<Settings />} />

                                  {/* 👥 Employees */}
                                  <Route path="employees" element={<EmployeeList />} />
                                  <Route path="employees/create" element={<EmployeeCreate />} />
                                  <Route path="employees/edit/:id" element={<EmployeeEdit />} />

                                  {/* 🚗 Vehicles */}
                                  <Route path="vehicles" element={<VehicleList />} />
                                  <Route path="vehicles/create" element={<VehicleCreatePage />} />
                                  <Route path="vehicles/edit/:id" element={<VehicleEditPage />} />
                                  <Route path="vehicles/show/:id" element={<VehicleShowPage />} />

                                  {/* 💳 Accounts */}
                                  <Route path="accounts" element={<AccountList />} />
                                  <Route path="accounts/create" element={<AccountCreate />} />
                                  <Route path="accounts/edit/:id" element={<AccountEdit />} />
                                  <Route path="accounts/show/:id" element={<AccountShow />} />
                                </Route>

                                {/* 💵 Clerk */}
                                <Route
                                  path="/cashier"
                                  element={
                                    <RoleRoute allowedRoles={["clerk", "cashier", "admin"]}>
                                      <Cashier />
                                    </RoleRoute>
                                  }
                                >
                                  <Route index element={<ClerkDashboard />} />
                                  <Route path="sales" element={<ClerkSales />} />
                                  <Route path="vehicles" element={<ClerkVehicles />} />
                                  <Route path="customers" element={<ClerkCustomers />} />
                                  <Route path="reports" element={<ClerkReports />} />
                                  <Route path="settings" element={<ClerkSettings />} />
                                </Route>

                                {/* 🚫 Catch-all */}
                                <Route path="*" element={<Navigate to="/unauthorized" replace />} />
                              </Routes>
                            </BrowserRouter>
                          </ThemeSync>
                        </SettingsProvider>
                      </ClerkCustomerProvider>
                    </ClerkSalesProvider>
                  </ClerkVehicleProvider>
                </ClerkAuthProvider>
              </TransactionSummaryProvider>
            </IncomeProvider>
          </VehicleProvider>
        </ExpenseProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}
