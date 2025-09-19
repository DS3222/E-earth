const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));

// Example API route
app.get('/api/search', (req, res) => {
  const query = req.query.q || "Nothing";
  res.json({ result: `You searched for: ${query}` });
});

// Fallback for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`E-earth backend running on port ${PORT}`);
});
