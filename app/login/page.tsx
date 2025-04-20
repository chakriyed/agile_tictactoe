'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await fetch('/api/auth/login2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 404) {
          setMessage('User not found. Please register.');
        } else {
          setMessage(data.error || 'Login failed');
        }
        setIsSuccess(false);
        return;
      }
      localStorage.setItem('user', JSON.stringify({ username, userId: data.userId }));
      // Set a cookie for server-side auth (expires in 7 days)
      document.cookie = `user=${data.userId}; path=/; max-age=${60 * 60 * 24 * 7}`;
      setIsSuccess(true);
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err) {
      setIsSuccess(false);
      setMessage(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-100">
      {/* Floating Background Xs and Os */}
      <FloatingXOBackground />

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Logo and Title */}
        <div className="mt-12 mb-8 flex flex-col items-center select-none">
          <h1
            className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 drop-shadow-lg mb-2"
            style={{ letterSpacing: '2px' }}
          >
            Tic Tac Toe
          </h1>
          <div className="flex items-center space-x-8 text-5xl md:text-6xl mt-2">
            <span className="text-black font-bold">×</span>
            <span className="inline-block rounded-full border-4 border-black w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-black" style={{ fontWeight: 700, fontSize: '1.5em' }}>○</span>
            <span className="text-black font-bold">×</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
          {message && (
            <div className={`p-4 rounded mb-6 text-center ${
              isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            >
              Login
            </button>
            <p className="text-center text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-500 hover:text-blue-600">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

// Floating background component
function FloatingXOBackground() {
  // More floating Xs and Os, varied positions, sizes, and delays
  const items = [
    { type: 'x', top: '10%', left: '15%', size: 60, delay: 0 },
    { type: 'o', top: '25%', left: '70%', size: 80, delay: 1 },
    { type: 'x', top: '70%', left: '20%', size: 50, delay: 2 },
    { type: 'o', top: '60%', left: '60%', size: 70, delay: 0.5 },
    { type: 'x', top: '40%', left: '80%', size: 65, delay: 1.5 },
    { type: 'o', top: '80%', left: '40%', size: 55, delay: 2.5 },
    { type: 'x', top: '15%', left: '50%', size: 75, delay: 1.2 },
    // Additional for more density
    { type: 'o', top: '5%', left: '40%', size: 45, delay: 0.3 },
    { type: 'x', top: '85%', left: '60%', size: 60, delay: 0.7 },
    { type: 'o', top: '50%', left: '10%', size: 50, delay: 1.7 },
    { type: 'x', top: '35%', left: '30%', size: 55, delay: 2.2 },
    { type: 'o', top: '55%', left: '85%', size: 65, delay: 1.1 },
    { type: 'x', top: '75%', left: '75%', size: 60, delay: 2.7 },
    { type: 'o', top: '20%', left: '85%', size: 60, delay: 0.8 },
    { type: 'x', top: '60%', left: '10%', size: 50, delay: 1.9 },
    { type: 'o', top: '90%', left: '25%', size: 55, delay: 2.3 },
    { type: 'x', top: '5%', left: '80%', size: 45, delay: 1.3 },
    { type: 'o', top: '35%', left: '60%', size: 50, delay: 2.8 },
    { type: 'x', top: '50%', left: '55%', size: 60, delay: 1.5 },
    { type: 'o', top: '70%', left: '85%', size: 60, delay: 0.4 },
  ];
  return (
    <div className="pointer-events-none absolute inset-0 w-full h-full z-0 overflow-hidden">
      {items.map((item, i) => (
        <span
          key={i}
          className={`absolute opacity-20 animate-floatXO select-none`}
          style={{
            top: item.top,
            left: item.left,
            fontSize: item.size,
            animationDelay: `${item.delay}s`,
            color: item.type === 'x' ? '#a78bfa' : '#f472b6',
            filter: 'blur(1px)'
          }}
        >
          {item.type === 'x' ? '×' : '○'}
        </span>
      ))}
      <style jsx global>{`
        @keyframes floatXO {
          0% { transform: translateY(0px) scale(1) rotate(0deg); }
          50% { transform: translateY(-30px) scale(1.08) rotate(8deg); }
          100% { transform: translateY(0px) scale(1) rotate(0deg); }
        }
        .animate-floatXO {
          animation: floatXO 5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}