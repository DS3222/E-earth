import React, { useState } from "react";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "";

// Helper to call backend
async function apiSearch(q){
  const base = API || "";
  const url = base + "/api/search?q=" + encodeURIComponent(q);
  const r = await fetch(url);
  return r.json();
}

export default function Search(){
  const [q,setQ] = useState("");
  const [results,setResults] = useState([]);
  const [loading,setLoading] = useState(false);

  async function doSearch(e){
    e && e.preventDefault();
    if(!q.trim()) return;
    setLoading(true);
    try{
      const data = await apiSearch(q);
      setResults(data.results || []);
    } catch(err){ console.error(err); }
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={doSearch} style={{marginBottom:12}}>
        <div className="search-input">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search the knowledge of the web (Wikipedia)" />
          <button>Search</button>
        </div>
      </form>
      {loading && <div>Loading...</div>}
      <div className="results">
        {results.map(r=>(
          <div key={r.id} className="result">
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}><a href={r.link} target="_blank" rel="noreferrer">{r.title}</a></div>
              <div style={{color:'#64748b'}}>{r.snippet}</div>
            </div>
            {r.thumbnail && <div className="thumb"><img src={r.thumbnail} alt="" /></div>}
          </div>
        ))}
        {!loading && results.length===0 && <div style={{color:'#94a3b8'}}>No results yet — try searching for "motherboard".</div>}
      </div>
    </div>
  );
}
