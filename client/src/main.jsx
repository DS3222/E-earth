import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Search from "./pages/Search";
import Article from "./pages/Article";
import Tools from "./pages/Tools";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Search />} />
        <Route path="article/:id" element={<Article />} />
        <Route path="tools" element={<Tools />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
