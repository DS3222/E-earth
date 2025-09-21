const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// ✅ serve static dist folder
app.use(express.static(path.join(__dirname, "dist")));

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from E-earth backend" });
});

// ✅ fallback for SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
