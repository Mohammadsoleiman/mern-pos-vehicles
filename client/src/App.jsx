// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 🔐 Contexts
import { AuthProvider } from "./context/AuthContext";
import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";
import { ClerkAuthProvider } from "./context/clerk/ClerkAuthContext";
import { ClerkVehicleProvider } from "./context/clerk/VehicleContext";
import { ClerkSalesProvider } from "./context/clerk/SalesContext";
import { ClerkCustomerProvider } from "./context/clerk/CustomerContext";

// 🔒 Role-based route
import RoleRoute from "./components/RoleRoute";

// 🧭 Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Accounting from "./pages/Accounting";
import Unauthorized from "./pages/Unauthorized";

// 📊 Accounting sub-pages
import FeaturesOverview from "./pages/accountingstuff/FeaturesOverview.jsx";
import Transactions from "./pages/accountingstuff/Transactions.jsx";
import Reports from "./pages/accountingstuff/Reports.jsx";
import Accounts from "./pages/accountingstuff/Accounts.jsx";
import Vehicles from "./pages/accountingstuff/Vehicles.jsx";
import Settings from "./pages/accountingstuff/Settings.jsx";
import Employees from "./pages/accountingstuff/Employees.jsx";

// 💵 Clerk pages
import Cashier from "./pages/Cashier.jsx";
import ClerkDashboard from "./pages/clerk/ClerkDashboard.jsx";
import ClerkSales from "./pages/clerk/ClerkSales.jsx";
import ClerkVehicles from "./pages/clerk/ClerkVehicles.jsx";
import ClerkCustomers from "./pages/clerk/ClerkCustomers.jsx";
import ClerkReports from "./pages/clerk/ClerkReports.jsx";
import ClerkSettings from "./pages/clerk/ClerkSettings.jsx";

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
                        {/* Public */}
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />

                        {/* Admin Dashboard */}
                        <Route
                          path="/dashboard"
                          element={
                            <RoleRoute allowedRoles={["admin"]}>
                              <Dashboard />
                            </RoleRoute>
                          }
                        />

                        {/* Accounting Section */}
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

                        {/* Clerk / Cashier Section */}
                        <Route
                          path="/cashier/*"
                          element={
                            <RoleRoute allowedRoles={["clerk", "cashier", "admin"]}>
                              <Cashier />
                            </RoleRoute>
                          }
                        />

                        {/* Clerk Routes (these are handled inside Cashier.jsx) */}
                        <Route
                          path="/clerk/*"
                          element={
                            <RoleRoute allowedRoles={["clerk", "cashier", "admin"]}>
                              <Cashier />
                            </RoleRoute>
                          }
                        />

                        {/* Unauthorized */}
                        <Route path="/unauthorized" element={<Unauthorized />} />

                        {/* Fallback */}
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