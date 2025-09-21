import React,{useEffect,useState} from "react"; import { useParams } from "react-router-dom"; const API = import.meta.env.VITE_API_URL || "";
export default function Article(){ const {id}=useParams(); const [article,setArticle]=useState(null);
 useEffect(()=>{ if(!id) return; fetch((API||"")+"/api/articles/"+id).then(r=>r.json()).then(j=>setArticle(j.article)).catch(console.error); },[id]);
 if(!article) return <div>Loading...</div>; return <div style={{background:'#fff',padding:18,borderRadius:12}}><h1>{article.title}</h1><div dangerouslySetInnerHTML={{__html:article.content}}/></div>;
}
