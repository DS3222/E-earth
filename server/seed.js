import Database from "better-sqlite3";
import path from "path";
const dbPath = path.join(process.cwd(), "server", "data.sqlite");
const db = new Database(dbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS articles (id TEXT PRIMARY KEY, title TEXT, content TEXT, created_at TEXT);
  CREATE TABLE IF NOT EXISTS tools (id TEXT PRIMARY KEY, name TEXT, description TEXT, route TEXT);
`);
const now = new Date().toISOString();
db.prepare("INSERT OR REPLACE INTO articles (id,title,content,created_at) VALUES (?,?,?,?)").run("a1","How to Fix a Dead Motherboard","<p>Step by step guide...</p>", now);
db.prepare("INSERT OR REPLACE INTO tools (id,name,description,route) VALUES (?,?,?,?)").run("bot1","Chat Bot","A simple chat placeholder","/tools/chat");
console.log('Seed complete. SQLite DB at', dbPath);
