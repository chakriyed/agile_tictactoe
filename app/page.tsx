'use client';

import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

export default function Home() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <main className="min-h-screen p-4">
      <button
        onClick={toggleDarkMode}
        className="block mx-auto mb-8 px-6 py-2 bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
      >
        Toggle Dark Mode
      </button>

      <div className="flex gap-8">
        <Sidebar position="left" />
        <GameBoard />
        <Sidebar position="right" />
      </div>
    </main>
  );
}