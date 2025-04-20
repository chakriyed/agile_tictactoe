'use client';

import { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard';
import ColorCustomizer from './components/ColorCustomizer';
import Navbar from './components/Navbar';

// Add type for Navbar
interface NavbarProps {
  username: string;
  onLogout: () => void;
  hintsEnabled: boolean;
  setHintsEnabled: (enabled: boolean) => void;
}

function removeUserCookie() {
  document.cookie = 'user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
}
import Sidebar from './components/Sidebar';
import BackgroundPattern from './components/BackgroundPattern';

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
  const [hintsEnabled, setHintsEnabled] = useState(false);
  const [xColor, setXColor] = useState('#222222');
  const [oColor, setOColor] = useState('#222222');

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
    <main className="min-h-screen p-0" style={{ position: 'relative', overflow: 'hidden' }}>
      <BackgroundPattern />
      <Navbar
        username={username || ''}
        onLogout={handleLogout}
        hintsEnabled={hintsEnabled}
        setHintsEnabled={setHintsEnabled}
      />
      <button
        onClick={toggleDarkMode}
        className="block mx-auto mb-8 px-6 py-2 bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
      >
        Toggle Dark Mode
      </button>
      <div className="absolute top-1 left-0 z-10 w-[420px]">
        <div className="w-full p-4 bg-yellow-50/80 rounded-2xl shadow">
          <ColorCustomizer xColor={xColor} oColor={oColor} setXColor={setXColor} setOColor={setOColor} />
        </div>
      </div>
      <div className="flex gap-8 mt-0">
        <Sidebar position="left" />
        <div className="flex-1">
          <GameBoard hintsEnabled={hintsEnabled} xColor={xColor} oColor={oColor} />
        </div>
        <Sidebar position="right" />
      </div>
    </main>
  );
}