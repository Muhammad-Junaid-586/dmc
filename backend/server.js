const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');

dotenv.config();

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// app.use(cors(
//     {
//         origin: ["https://dmc-gray.vercel.app/"],
//         methods: ["POST", "GET"],
//         credentials: true
//     }
// ));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.get('/', (req , res)=>{
    res.json('Hello')
})
// ✅ API Routes
// app.use("/auth", authRoutes);
// app.use("/uploads", uploadRoutes);


// ✅ Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
