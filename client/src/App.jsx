import React, { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    if (!query) return;
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>E-earth 🌍</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search anything..."
        style={{ padding: "10px", width: "300px" }}
      />
      <button onClick={search} style={{ padding: "10px", marginLeft: "10px" }}>
        Search
      </button>

      <div style={{ marginTop: "20px" }}>
        {results.map((r, i) => (
          <div key={i} style={{ marginBottom: "15px" }}>
            <h3>{r.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: r.snippet }} />
          </div>
        ))}
      </div>
    </div>
  );
}
