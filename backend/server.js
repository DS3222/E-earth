const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Serve static files from backend/frontend/dist
app.use(express.static(path.join(__dirname, 'frontend/dist')));

// Example API
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from E-earth backend' });
});

// SPA fallback — serve index.html for any non-API route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
