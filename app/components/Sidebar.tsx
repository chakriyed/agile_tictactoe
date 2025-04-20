'use client';

import { useState, useEffect, useRef } from 'react';


interface SidebarProps {
  position: 'left' | 'right';
}

interface Message {
  id: number;
  content: string;
  createdAt: string;
  user: {
    email: string;
  };
}

interface LeaderboardEntry {
  email: string;
  wins: number;
  losses: number;
  draws: number;
}

export default function Sidebar({ position }: SidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  

  const facts = [
    "🧩 Easy but Deep: Despite its simplicity, Tic Tac Toe teaches critical thinking and strategy, especially to beginners.",
    "🔄 Draw is Inevitable: If both players play their best, the game will always end in a tie — a classic example of a solved game.",
    "🧮 Game Possibilities: There are 9! = 362,880 ways to place Xs and Os on the board, but only 26,830 unique games when accounting for symmetry and legality.",
    "🎲 First-Move Edge: The player who goes first has a statistical advantage, but only if the second player makes a mistake.",
    "💡 Teaches Algorithms: Often used to introduce the minimax algorithm in computer science and game theory courses."
  ];

  // Fetch chat messages and leaderboard data
  useEffect(() => {
    if (position === 'right') {
      const fetchData = async () => {
        try {
          // Fetch messages
          const messagesRes = await fetch('/api/chat');
          if (!messagesRes.ok) {
            throw new Error('Failed to fetch messages');
          }
          const messagesData = await messagesRes.json();
          if (Array.isArray(messagesData)) {
            setMessages(messagesData);
            setError(null);
          } else {
            throw new Error('Invalid messages data format');
          }

          // Fetch leaderboard
          const leaderboardRes = await fetch('/api/leaderboard');
          if (!leaderboardRes.ok) {
            throw new Error('Failed to fetch leaderboard');
          }
          const leaderboardData = await leaderboardRes.json();
          if (Array.isArray(leaderboardData)) {
            setLeaderboard(leaderboardData);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          setError(error instanceof Error ? error.message : 'An error occurred');
        }
      };

      fetchData();
      
      // Poll for updates every 5 seconds
      const interval = setInterval(fetchData, 5000);
      return () => clearInterval(interval);
    }
  }, [position]);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          
          content: newMessage.trim(),
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const message = await res.json();
      setMessages(prev => [...prev, message]);
      setNewMessage('');
      setError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  if (position === 'left') {
    return (
      <div className="w-64 p-4 bg-yellow-50 dark:bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Did You Know?</h2>
        <div className="space-y-4">
          {facts.map((fact, index) => (
            <p key={index} className="text-sm text-gray-700 dark:text-gray-300">
              {fact}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 p-4 bg-yellow-50 dark:bg-gray-800 rounded-lg">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Leaderboard</h2>
        <div className="space-y-2">
          {leaderboard.map((entry, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span>{entry.email.split('@')[0]}</span>
              <span>{entry.wins} Wins</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Live Chat</h2>
        <div ref={chatRef} className="h-48 bg-white dark:bg-gray-700 rounded p-2 mb-2 overflow-y-auto">
          {error ? (
            <p className="text-red-500 text-sm">{error}</p>
          ) : messages && messages.length > 0 ? (
            messages.map((message) => (
              <div key={message.id} className="mb-2">
                <span className="font-bold text-sm">Player: </span>
                <span className="text-sm">{message.content}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No messages yet</p>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 rounded border dark:bg-gray-700 dark:border-gray-600"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded hover:opacity-90 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
} 