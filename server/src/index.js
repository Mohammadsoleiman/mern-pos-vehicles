const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB, then start the server
const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected successfully (Local)");

    app.get("/", (req, res) => {
      res.send("🚀 Server is running and MongoDB is connected!");
    });

    app.listen(PORT, () => {
      console.log(`🌐 Server running at: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
