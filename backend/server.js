const express = require("express");
const app = express();

app.get('/api', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/api/auth', (req, res) => {
  res.json({ message: 'Auth route' });
});

app.get('/api/uploads', (req, res) => {
  res.json({ message: 'Uploads route' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));