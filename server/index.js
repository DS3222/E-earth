import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, "dist")));

// Wikipedia search API
app.get("/api/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ query: q, results: [] });

    const api = new URL("https://en.wikipedia.org/w/api.php");
    api.searchParams.set("action", "query");
    api.searchParams.set("format", "json");
    api.searchParams.set("origin", "*");
    api.searchParams.set("prop", "pageimages|extracts");
    api.searchParams.set("exintro", "1");
    api.searchParams.set("exsentences", "2");
    api.searchParams.set("exlimit", "max");
    api.searchParams.set("piprop", "thumbnail");
    api.searchParams.set("pithumbsize", "320");
    api.searchParams.set("generator", "search");
    api.searchParams.set("gsrsearch", q);
    api.searchParams.set("gsrlimit", "10");

    const r = await fetch(api.toString());
    const j = await r.json();
    const pages = j.query && j.query.pages ? Object.values(j.query.pages) : [];
    const results = pages.map(p => ({
      id: p.pageid,
      title: p.title,
      snippet: p.extract ? p.extract.replace(/(<([^>]+)>)/gi, "") : "",
      thumbnail: p.thumbnail ? p.thumbnail.source : null,
      link: `https://en.wikipedia.org/?curid=${p.pageid}`
    }));

    res.json({ query: q, results });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "search_failed", details: String(err) });
  }
});

// YouTube embed search (no API key needed, uses results page embedding)
app.get("/api/videos", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ query: q, results: [] });
  try {
    const results = [
      `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(q)}`
    ];
    res.json({ query: q, results });
  } catch (e) {
    res.status(500).json({ error: "video_failed", details: String(e) });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => console.log("E-earth running on port", PORT));

