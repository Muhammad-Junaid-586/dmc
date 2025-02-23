const express = require("express");
const cors = require("cors");
const app = express();

// Enable CORS
app.use(cors({
  origin: "https://dmc-iz4d.vercel.app",
  credentials: true
}));

// Routes
app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login successful' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));