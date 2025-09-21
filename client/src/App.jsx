import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function App(){
  return (
    <div className="page">
      <header className="site-header">
        <div className="brand">
          <div className="logo">🌍</div>
          <Link to="/" className="title">E-earth</Link>
        </div>
        <nav className="nav">
          <Link to="/tools">Tools</Link>
        </nav>
      </header>
      <main className="container"><Outlet /></main>
      <footer className="site-footer">© E-earth</footer>
    </div>
  );
}
