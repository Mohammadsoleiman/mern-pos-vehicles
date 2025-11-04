// 🌍 Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// 🚀 Confirm server start
console.log("🔥 Starting Express server from:", __dirname);

// 🧠 Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ Allow React frontend to connect (CORS)
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ React dev server URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🧩 Connect MongoDB
connectDB();

// ✅ Serve uploaded images statically
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("🖼️ Static uploads path:", uploadsPath);

// 🧾 Log before registering routes
console.log("⚙️ Loading API routes...");

// 🧩 Import Routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const permissionRoutes = require("./routes/permissions");
const roleRoutes = require("./routes/roles");
const productRoutes = require("./routes/products");
const vehicleRoutes = require("./routes/vehicles");
const employeeRoutes = require("./routes/employees");
const accountRoutes = require("./routes/accounts");
const incomeRoutes = require("./routes/incomes");

// 💼 Accounting-related Routes
const expenseRoutes = require("./routes/expenses");
const purchaseRoutes = require("./routes/purchases");
const payrollRoutes = require("./routes/payroll");

// 📊 Financial Summary Route
const transactionRoutes = require("./routes/transactions");

// ✅ Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/incomes", incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/transactions", transactionRoutes); // ✅ NEW financial summary route

console.log("✅ All API routes registered successfully.");

// 🧪 Health check route
app.get("/", (req, res) => {
  res.status(200).send("🚀 Server running successfully!");
});

// 🧩 Debug helper — list all loaded routes
setTimeout(() => {
  if (!app._router) return console.log("⚠️ No routes found in app._router");

  console.log("\n📋 Loaded route paths:");
  app._router.stack.forEach((layer) => {
    if (layer.name === "router" && layer.handle && layer.handle.stack) {
      layer.handle.stack.forEach((r) => {
        if (r.route && r.route.path) console.log("  •", r.route.path);
      });
    }
  });
}, 1500);

// 🏁 Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on: http://localhost:${PORT}`);
});
