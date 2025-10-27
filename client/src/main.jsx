import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { TransactionProvider } from "./context/ACCOUNTANT/TransactionContext";
import { ExpenseProvider } from "./context/ACCOUNTANT/ExpenseContext";
import { VehicleProvider } from "./context/ACCOUNTANT/VehicleContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TransactionProvider>
      <ExpenseProvider>
        <VehicleProvider>
          <App />
        </VehicleProvider>
      </ExpenseProvider>
    </TransactionProvider>
  </StrictMode>
);
