// 🌍 Load environment variables
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

// 🧩 Import routes
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const permissionRoutes = require("./routes/permissions");
const roleRoutes = require("./routes/roles");
const productRoutes = require("./routes/products");
const vehicleRoutes = require("./routes/vehicles"); // ✅ Vehicles routes

const app = express();

// 🚀 Confirm server start
console.log("🔥 Server starting from:", __dirname);

// 🧠 Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ✅ CORS: السماح للواجهة الأمامية بالاتصال
app.use(
  cors({
    origin: "http://localhost:5173", // React frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🧩 Connect MongoDB
connectDB();

// ✅ Serve uploaded images statically (حتى الصور تظهر من المتصفح)
const uploadsPath = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsPath));
console.log("🖼️ Static image path:", uploadsPath);

// 🧾 Log before registering routes
console.log("⚙️ Loading routes...");

// ✅ Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vehicles", vehicleRoutes); // ✅ Vehicles API route

console.log("✅ Routes registered successfully.");

// 🧪 Default route for testing
app.get("/", (req, res) => {
  res.send("🚀 Server running successfully!");
});

// 🧩 Debug helper: list all loaded routes
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

// 🟢 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
