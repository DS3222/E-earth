
import React, { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const tools = [
    { name: "Password Generator", desc: "Generate strong passwords instantly." },
    { name: "Unit Converter", desc: "Convert between units easily." },
    { name: "Math Solver", desc: "Solve math problems quickly." },
    { name: "Weather Lookup", desc: "Get the latest weather updates." }
  ];

  const handleSearch = (e) => {
    setQuery(e.target.value);
    setResults(
      tools.filter((tool) =>
        tool.name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px" }}>
      <h1>WeLove - Find Solutions & Tools</h1>
      <input
        type="text"
        placeholder="Search your problem or tool..."
        value={query}
        onChange={handleSearch}
        style={{ width: "300px", padding: "8px", marginBottom: "20px" }}
      />
      <ul>
        {results.map((r, i) => (
          <li key={i}>
            <strong>{r.name}</strong>: {r.desc}
          </li>
        ))}
      </ul>
    </div>
  );
}
