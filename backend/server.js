const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ serve dist directly (copied to /app/backend/dist in Dockerfile)
app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from E-earth backend" });
});

// Fallback — always return index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
