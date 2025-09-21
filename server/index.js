import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import Database from "better-sqlite3";
import { Client } from "pg";
import fs from "fs";
import path from "path";
import url from "url";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Database helper: use Postgres if DATABASE_URL is provided, otherwise use SQLite for local/dev.
let dbSqlite = null;
let pgClient = null;
const DATABASE_URL = process.env.DATABASE_URL || null;

if (DATABASE_URL) {
  // Postgres
  pgClient = new Client({ connectionString: DATABASE_URL, ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false });
  pgClient.connect().then(()=>console.log("Connected to Postgres")).catch(err=>{ console.error("Postgres connection error:", err); });
} else {
  // SQLite
  const dbPath = path.join(__dirname, "data.sqlite");
  dbSqlite = new Database(dbPath);
  // ensure tables exist
  dbSqlite.exec(`
    CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, title TEXT, content TEXT, created_at TEXT);
    CREATE TABLE IF NOT EXISTS tools (id TEXT PRIMARY KEY, name TEXT, description TEXT, route TEXT);
  `);
  console.log("Using SQLite at", dbPath);
}

// Utility to run queries
async function runQuery(query, params=[]) {
  if (pgClient) {
    const res = await pgClient.query(query, params);
    return res;
  } else {
    const stmt = dbSqlite.prepare(query);
    if (query.trim().toLowerCase().startsWith("select")) {
      return { rows: stmt.all(...params) };
    } else {
      const info = stmt.run(...params);
      return { info };
    }
  }
}

// --- API: Search (Wikipedia) ---
app.get("/api/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ query: q, results: [] });

    // Wikipedia opensearch or search API
    // We'll use the "search" action with snippets and pageimages for thumbnails
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

    // sort by index if present
    results.sort((a,b)=> (a.title>b.title?1:-1));
    res.json({ query: q, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "search_failed", details: String(err) });
  }
});

// --- API: Articles (from DB) ---
app.get("/api/articles", async (req, res) => {
  try {
    if (pgClient) {
      const r = await runQuery("SELECT id,title,created_at FROM articles ORDER BY created_at DESC LIMIT 50");
      res.json({ articles: r.rows });
    } else {
      const r = await runQuery("SELECT id,title,created_at FROM articles ORDER BY created_at DESC LIMIT 50");
      res.json({ articles: r.rows });
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/articles/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (pgClient) {
      const r = await runQuery("SELECT id,title,content,created_at FROM articles WHERE id=$1", [id]);
      res.json({ article: r.rows[0] || null });
    } else {
      const r = await runQuery("SELECT id,title,content,created_at FROM articles WHERE id = ?", [id]);
      res.json({ article: r.rows[0] || null });
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// --- API: Tools ---
app.get("/api/tools", async (req, res) => {
  try {
    if (pgClient) {
      const r = await runQuery("SELECT id,name,description,route FROM tools ORDER BY name");
      res.json({ tools: r.rows });
    } else {
      const r = await runQuery("SELECT id,name,description,route FROM tools ORDER BY name");
      res.json({ tools: r.rows });
    }
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// Serve static files for production frontend if built
app.use(express.static(path.join(__dirname, "../client/dist")));
app.get("*", (req,res)=>{
  res.sendFile(path.join(__dirname,"../client/dist/index.html"));
});

const PORT = process.env.PORT || 8787;
app.listen(PORT, ()=>console.log("Server listening on", PORT));
