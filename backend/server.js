const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 10000;
const DATA_FILE = path.join(__dirname, 'data_articles.json');
function loadArticles(){ return JSON.parse(fs.readFileSync(DATA_FILE)); }
app.use(express.json());
app.get('/api/search', (req,res)=>{ const q=(req.query.q||'').toLowerCase(); const arr=loadArticles(); if(!q) return res.json(arr); const results=arr.filter(a=> (a.title+' '+a.summary+' '+a.content).toLowerCase().includes(q)); res.json(results); });
app.get('/api/articles/:id',(req,res)=>{ const arr=loadArticles(); const a=arr.find(x=>x.id===req.params.id); if(!a) return res.status(404).json({message:'Not found'}); res.json(a); });
app.get('/api/tools/currency',(req,res)=>{ const from=(req.query.from||'USD').toUpperCase(); const to=(req.query.to||'USD').toUpperCase(); const amount=parseFloat(req.query.amount)||1; const rates={'USD':1,'EUR':0.92,'BDT':109.5}; const rate=(rates[to]||1)/(rates[from]||1); res.json({from,to,amount,result:+(amount*rate).toFixed(4),rate:+rate.toFixed(6)}); });
app.get('/api/tools/qrcode',(req,res)=>{ const text=req.query.text||'E-earth'; const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#fff"/><rect x="10" y="10" width="60" height="60" fill="#000"/><rect x="130" y="10" width="60" height="60" fill="#000"/><rect x="10" y="130" width="60" height="60" fill="#000"/><text x="100" y="110" font-size="10" text-anchor="middle" fill="#000">${text}</text></svg>`; const data='data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64'); res.json({data}); });
app.use(express.static(path.join(__dirname,'dist')));
app.get('*',(req,res)=>{ res.sendFile(path.join(__dirname,'dist','index.html')); });
app.listen(PORT,()=>console.log('E-earth backend running on port',PORT));
