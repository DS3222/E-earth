import React,{useState} from 'react';
export default function SearchPage(){
  const [q,setQ]=useState('');
  const [results,setResults]=useState([]);
  const [videos,setVideos]=useState([]);
  const [loading,setLoading]=useState(false);
  async function doSearch(e){e&&e.preventDefault();if(!q.trim())return;setLoading(true);
    try{
      const res=await fetch('/api/search?q='+encodeURIComponent(q));const j=await res.json();setResults(j.results||[]);
      const vres=await fetch('/api/videos?q='+encodeURIComponent(q));const vj=await vres.json();setVideos(vj.results||[]);
    }catch(err){console.error(err);setResults([]);setVideos([]);}
    setLoading(false);
  }
  return <div className='max-w-4xl mx-auto p-6'>
    <form onSubmit={doSearch} className='flex flex-col gap-4 items-center'>
      <input value={q} onChange={e=>setQ(e.target.value)} className='w-full rounded-full px-4 py-3 border shadow' placeholder='Search anything...'/>
      <button className='bg-cyan-600 text-white px-6 py-2 rounded-full'>Search</button>
    </form>
    {loading && <p className='text-center mt-6'>Searching...</p>}
    <div className='mt-8 space-y-6'>
      {results.map(r=>(<div key={r.id} className='bg-white p-4 rounded shadow'>
        <a href={r.link} target='_blank' rel='noreferrer' className='text-lg font-semibold text-cyan-700 hover:underline'>{r.title}</a>
        <p className='text-sm text-slate-600 mt-1'>{r.snippet}</p>
      </div>))}
    </div>
    <div className='mt-10'>
      {videos.map((v,i)=>(<div key={i} className='aspect-video mb-6'><iframe src={v} title='Video Results' className='w-full h-full rounded-lg shadow'></iframe></div>))}
    </div>
  </div>;
}

