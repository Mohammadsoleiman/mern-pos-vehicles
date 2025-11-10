// 🌍 Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// 🚀 Log startup
console.log("🔥 Starting Express server from:", __dirname);

// 🧠 Core Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS for React frontend
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🧩 Connect to MongoDB
(async () => {
  try {
    await connectDB();
    // console.log("✅ MongoDB connected successfully.");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
})();

// 🖼️ Serve static uploads
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("🖼️ Serving static uploads from:", uploadsPath);

// 🧾 Log before loading routes
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
const expenseRoutes = require("./routes/expenses");
const purchaseRoutes = require("./routes/purchases");
const payrollRoutes = require("./routes/payroll");
const reportRoutes = require("./routes/reportRoutes");
const transactionRoutes = require("./routes/transactions");
const customerRoutes = require("./routes/customerRoutes");
const salesRoutes = require("./routes/sales"); // ✅ Clerk Sales route
const dashboardClerkRoutes = require("./routes/dashboardClerk");
const clerkReportRoutes = require("./routes/clerkReportRoutes"); // ✅ New Clerk Reports route
// const notificationRoutes = require("./routes/notifications");
// ✅ Register All Routes
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
app.use("/api/transactions", transactionRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/sales", salesRoutes); // ✅ New POS Sales API
app.use("/api/reports", reportRoutes);
app.use("/notifications", require("./routes/notifications"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));


// 🧩 Clerk-specific routes
app.use("/api/clerk/dashboard", dashboardClerkRoutes);
app.use("/api/clerk/reports", clerkReportRoutes);

console.log("✅ All API routes registered successfully.");

// 🧪 Health Check
app.get("/", (req, res) => {
  res.status(200).send("🚀 Server running successfully!");
});

// 🧭 List all routes for debugging
setTimeout(() => {
  if (app._router && app._router.stack) {
    console.log("\n📋 Registered route paths:");
    app._router.stack.forEach((layer) => {
      if (layer.name === "router" && layer.handle && layer.handle.stack) {
        layer.handle.stack.forEach((r) => {
          if (r.route && r.route.path)
            console.log("  •", r.route.path);
        });
      }
    });
  } else {
    // console.warn("⚠️ No routes found in app._router");
  }
}, 1500);

// 🏁 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on: http://localhost:${PORT}`);
});
