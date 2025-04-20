'use client';

import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import Navbar from './components/Navbar';

function removeUserCookie() {
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
}
import Sidebar from './components/Sidebar';

import { useRouter } from 'next/navigation';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();
  // Check authentication on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      if (!user) {
        router.push('/login');
      } else {
        try {
          const parsed = JSON.parse(user);
          setUsername(parsed.username || null);
        } catch {
          setUsername(null);
        }
      }
    }
  }, [router]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    removeUserCookie();
    router.push('/login');
  };

  return (
    <main className="min-h-screen p-4">
      <Navbar username={username || ''} onLogout={handleLogout} />
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