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

let dbSqlite = null;
let pgClient = null;
const DATABASE_URL = process.env.DATABASE_URL || null;

if (DATABASE_URL) {
  pgClient = new Client({ connectionString: DATABASE_URL, ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false });
  pgClient.connect().then(()=>console.log("Connected to Postgres")).catch(err=>{ console.error("Postgres connection error:", err); });
} else {
  const dbPath = path.join(__dirname, "data.sqlite");
  dbSqlite = new Database(dbPath);
  dbSqlite.exec(`
    CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, title TEXT, content TEXT, created_at TEXT);
    CREATE TABLE IF NOT EXISTS tools (id TEXT PRIMARY KEY, name TEXT, description TEXT, route TEXT);
  `);
  console.log("Using SQLite at", dbPath);
}

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
    results.sort((a,b)=> (a.title>b.title?1:-1));
    res.json({ query: q, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "search_failed", details: String(err) });
  }
});

app.get("/api/articles", async (req, res) => {
  try {
    const r = await runQuery("SELECT id,title,created_at FROM articles ORDER BY created_at DESC LIMIT 50");
    res.json({ articles: r.rows });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/articles/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const r = await runQuery("SELECT id,title,content,created_at FROM articles WHERE id = ?", [id]);
    res.json({ article: r.rows[0] || null });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.get("/api/tools", async (req, res) => {
  try {
    const r = await runQuery("SELECT id,name,description,route FROM tools ORDER BY name");
    res.json({ tools: r.rows });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const staticPath = path.join(__dirname, "dist");
if (fs.existsSync(staticPath)) {
  app.use(express.static(staticPath));
  app.get("*", (req,res)=>{
    res.sendFile(path.join(staticPath,"index.html"));
  });
} else {
  app.get("/", (req,res)=>res.send("E-earth server is running. No frontend build found."));
}

const PORT = process.env.PORT || 8787;
app.listen(PORT, ()=>console.log("Server listening on", PORT));
