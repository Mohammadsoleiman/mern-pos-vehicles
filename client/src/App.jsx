// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { SettingsProvider } from "./context/SettingsContext";
import ThemeSync from "./components/ThemeSync";

import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";
import { IncomeProvider } from "./context/ACCOUNTANT/IncomeContext";
import { TransactionSummaryProvider } from "./context/ACCOUNTANT/TransactionSummaryContext";

import { ClerkAuthProvider } from "./context/clerk/ClerkAuthContext";
import { ClerkVehicleProvider } from "./context/clerk/VehicleContext";
import { ClerkSalesProvider } from "./context/clerk/SalesContext";
import { ClerkCustomerProvider } from "./context/clerk/CustomerContext";
import { LowStockProvider } from "./context/clerk/LowStockContext";

import RoleRoute from "./components/RoleRoute";

import Admin from "./components/admin/Admin";
import Accounting from "./pages/Accounting";
import Cashier from "./pages/Cashier";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";

import Dashboard from "./pages/Dashboard";
import UsersPage from "./pages/users";
import RolesPage from "./pages/roles";
import PermissionsPage from "./pages/permissions/PermissionsPage";
import VehiclesList from "./pages/Vehicles/VehiclesList";
import VehicleCreate from "./pages/Vehicles/VehicleCreate";
import VehicleEdit from "./pages/Vehicles/VehicleEdit";
import VehicleShow from "./pages/Vehicles/VehicleShow";
import GlobalSettings from "./pages/settings/GlobalSettings";

import FeaturesOverview from "./pages/accountingstuff/FeaturesOverview";
import Transactions from "./pages/accountingstuff/Transactions";
import Income from "./pages/accountingstuff/Income";
import Expenses from "./pages/accountingstuff/Expenses";
import Reports from "./pages/accountingstuff/Reports";

import EmployeeList from "./pages/accountingstuff/employees/EmployeeList";
import EmployeeCreate from "./pages/accountingstuff/employees/EmployeeCreate";
import EmployeeEdit from "./pages/accountingstuff/employees/EmployeeEdit";

import VehicleList from "./pages/accountingstuff/vehicles/VehicleList";
import VehicleCreatePage from "./pages/accountingstuff/vehicles/VehicleCreate";
import VehicleEditPage from "./pages/accountingstuff/vehicles/VehicleEdit";
import VehicleShowPage from "./pages/accountingstuff/vehicles/VehicleShow";

import AccountList from "./pages/accountingstuff/accounts/AccountList";
import AccountCreate from "./pages/accountingstuff/accounts/AccountCreate";
import AccountEdit from "./pages/accountingstuff/accounts/AccountEdit";
import AccountShow from "./pages/accountingstuff/accounts/AccountShow";

import ClerkDashboard from "./pages/clerk/ClerkDashboard";
import ClerkSales from "./pages/clerk/ClerkSales";
import ClerkVehicles from "./pages/clerk/vehicles/VehicleList";
import ClerkVehicleShow from "./pages/clerk/vehicles/VehicleShow";
import ClerkCustomers from "./pages/clerk/customers/ClerkCustomers";
import ClerkReports from "./pages/clerk/ClerkReports";
import Accessories from "./pages/clerk/inventory/Accessories";
import Parts from "./pages/clerk/inventory/Parts";
import Services from "./pages/clerk/inventory/Services";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ThemeSync>
          <TransactionProvider>
            <ExpenseProvider>
              <VehicleProvider>
                <IncomeProvider>
                  <TransactionSummaryProvider>
                    <ClerkAuthProvider>
                      <ClerkVehicleProvider>
                        <ClerkSalesProvider>
                          <ClerkCustomerProvider>
                            <LowStockProvider>

                              <BrowserRouter>
                                <Routes>

                                  {/* Public */}
                                  <Route path="/" element={<Login />} />
                                  <Route path="/login" element={<Login />} />
                                  <Route path="/unauthorized" element={<Unauthorized />} />

                                  {/* Admin */}
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
                                      <Route path="settings" element={<GlobalSettings />} />
                                    </Route>
                                  </Route>

                                  {/* Accounting */}
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
                                    <Route path="settings" element={<GlobalSettings />} />

                                    {/* Employees */}
                                    <Route path="employees" element={<EmployeeList />} />
                                    <Route path="employees/create" element={<EmployeeCreate />} />
                                    <Route path="employees/edit/:id" element={<EmployeeEdit />} />

                                    {/* Vehicles */}
                                    <Route path="vehicles" element={<VehicleList />} />
                                    <Route path="vehicles/create" element={<VehicleCreatePage />} />
                                    <Route path="vehicles/edit/:id" element={<VehicleEditPage />} />
                                    <Route path="vehicles/show/:id" element={<VehicleShowPage />} />

                                    {/* Accounts */}
                                    <Route path="accounts" element={<AccountList />} />
                                    <Route path="accounts/create" element={<AccountCreate />} />
                                    <Route path="accounts/edit/:id" element={<AccountEdit />} />
                                    <Route path="accounts/show/:id" element={<AccountShow />} />
                                  </Route>

                                  {/* Clerk */}
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
                                    <Route path="vehicles/:id" element={<ClerkVehicleShow />} />
                                    <Route path="inventory/accessories" element={<Accessories />} />
                                    <Route path="inventory/parts" element={<Parts />} />
                                    <Route path="inventory/services" element={<Services />} />
                                    <Route path="customers" element={<ClerkCustomers />} />
                                    <Route path="reports" element={<ClerkReports />} />
                                    <Route path="settings" element={<GlobalSettings />} />
                                  </Route>

                                  <Route path="*" element={<Navigate to="/unauthorized" replace />} />

                                </Routes>
                              </BrowserRouter>

                            </LowStockProvider>
                          </ClerkCustomerProvider>
                        </ClerkSalesProvider>
                      </ClerkVehicleProvider>
                    </ClerkAuthProvider>
                  </TransactionSummaryProvider>
                </IncomeProvider>
              </VehicleProvider>
            </ExpenseProvider>
          </TransactionProvider>
        </ThemeSync>
      </SettingsProvider>
    </AuthProvider>
  );
}
