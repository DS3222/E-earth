import React, { useEffect, useState } from "react";
const API = import.meta.env.VITE_API_URL || "";

export default function Tools(){
  const [tools,setTools] = useState([]);
  useEffect(()=>{
    fetch((API || "") + "/api/tools").then(r=>r.json()).then(j=>setTools(j.tools || [])).catch(console.error);
  },[]);

  return (
    <div>
      <h2>Tools & Utilities</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:12,marginTop:12}}>
        {tools.map(t=>(
          <div key={t.id} style={{background:'#fff',padding:12,borderRadius:10}}>
            <h3 style={{margin:0}}>{t.name}</h3>
            <div style={{color:'#64748b'}}>{t.description}</div>
            <button style={{marginTop:8}} onClick={()=>alert('Open: '+t.name)}>Open</button>
          </div>
        ))}
      </div>
    </div>
  );
}
