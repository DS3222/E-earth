import React,{useState} from "react";
const API = import.meta.env.VITE_API_URL || "";
async function apiSearch(q){ const base = API || ""; const url = base + "/api/search?q=" + encodeURIComponent(q); const r = await fetch(url); return r.json(); }
export default function Search(){ const [q,setQ]=useState(""); const [res,setRes]=useState([]); const [loading,setLoading]=useState(false);
  async function doSearch(e){ e&&e.preventDefault(); if(!q.trim()) return; setLoading(true); try{ const data = await apiSearch(q); setRes(data.results||[]); }catch(err){console.error(err)} setLoading(false); }
  return (<div><form onSubmit={doSearch}><div className="search-input"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search Wikipedia"/><button>Search</button></div></form>{loading&&<div>Loading...</div>}<div>{res.map(r=>(<div key={r.id}><a href={r.link} target="_blank" rel="noreferrer">{r.title}</a><div>{r.snippet}</div></div>))}</div></div>); }
