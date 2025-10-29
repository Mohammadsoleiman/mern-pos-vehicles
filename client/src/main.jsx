import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";
import { ClerkAuthProvider } from "./context/clerk/ClerkAuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TransactionProvider>
      <ExpenseProvider>
        <VehicleProvider>
          <ClerkAuthProvider>
            <App />
          </ClerkAuthProvider>
        </VehicleProvider>
      </ExpenseProvider>
    </TransactionProvider>
  </StrictMode>
);
