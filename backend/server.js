const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: "https://dmc-iz4d.vercel.app", credentials: true })); // Allow requests from frontend
app.use(express.json()); // Parse JSON request bodies
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files

// API Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/uploads", uploadRoutes); // File upload routes

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the DMC backend!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));