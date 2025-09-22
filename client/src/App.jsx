import React from "react";
import SearchPage from "./pages/SearchPage";
export default function App(){
  return <div className='min-h-screen flex flex-col'>
    <header className='bg-white shadow-sm'>
      <div className='max-w-5xl mx-auto px-4 py-4 flex justify-between items-center'>
        <h1 className='text-2xl font-bold text-cyan-600'>E-earth</h1>
        <nav className='text-sm text-slate-600 gap-4 hidden sm:flex'>
          <a href='/tools'>Tools</a>
          <a href='/about'>About</a>
        </nav>
      </div>
    </header>
    <main className='flex-1'><SearchPage/></main>
    <footer className='border-t py-4 text-center text-sm text-slate-500'>© 2025 E-earth</footer>
  </div>;
}

