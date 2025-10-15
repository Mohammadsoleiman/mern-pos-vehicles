// Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const permissionRoutes = require("./routes/permissions");
const roleRoutes = require("./routes/roles");
const productRoutes = require("./routes/products");

const app = express();

// 🔥 Debug: confirm correct file
console.log("🔥 Server starting from:", __dirname);

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Log before routes
console.log("⚙️ Loading routes...");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/products", productRoutes);

console.log("✅ Routes registered successfully.");

// Default route for testing
app.get("/", (req, res) => {
  res.send("🚀 Server running successfully!");
});


// Safe debug: show all registered routes
setTimeout(() => {
  if (!app._router) return console.log("⚠️ No routes found in app._router");

  console.log("📋 Loaded routes:");
  app._router.stack.forEach((layer) => {
    if (layer.name === "router" && layer.handle && layer.handle.stack) {
      layer.handle.stack.forEach((r) => {
        if (r.route && r.route.path) {
          console.log("  •", r.route.path);
        }
      });
    }
  });
}, 1500);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
