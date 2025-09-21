const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

// simple sample articles (search data)
const DATA_FILE = path.join(__dirname, 'data', 'articles.json');
function loadArticles(){ try{ return JSON.parse(fs.readFileSync(DATA_FILE)); }catch(e){ return []; } }

app.use(express.json());

// serve prebuilt frontend (copied into backend/dist)
app.use(express.static(path.join(__dirname, 'dist')));

// search API: /api/search?q=term
app.get('/api/search', (req,res)=>{
  const q = (req.query.q||'').toLowerCase();
  const arr = loadArticles();
  if(!q) return res.json(arr);
  const results = arr.filter(a=> (a.title + ' ' + a.summary + ' ' + a.content).toLowerCase().includes(q));
  res.json(results);
});

// article endpoint
app.get('/api/articles/:id',(req,res)=>{
  const arr = loadArticles();
  const a = arr.find(x=>x.id===req.params.id);
  if(!a) return res.status(404).json({message:'Not found'});
  res.json(a);
});

// fallback to index.html for SPA
app.get('*', (req,res)=>{
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, ()=>{ console.log('Server running on port', PORT); });
