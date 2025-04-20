'use client';

import { useState, useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';


interface SidebarProps {
  position: 'left' | 'right';
  customizer?: React.ReactNode;
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
  xWins: number;
  oWins: number;
}

export default function Sidebar({ position, customizer }: SidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);
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
            setChatError('Failed to fetch messages');
            setMessages([]);
          } else {
            const messagesData = await messagesRes.json();
            if (Array.isArray(messagesData)) {
              setMessages(messagesData);
              setChatError(null);
            } else {
              setChatError('Invalid messages data format');
              setMessages([]);
            }
          }

          // Fetch leaderboard
          const leaderboardRes = await fetch('/api/leaderboard');
          if (!leaderboardRes.ok) {
            setLeaderboardError('Failed to fetch leaderboard');
            setLeaderboard([]);
          } else {
            const leaderboardData = await leaderboardRes.json();
            console.log('Leaderboard API response:', leaderboardData);
            if (Array.isArray(leaderboardData)) {
              setLeaderboard(leaderboardData);
              setLeaderboardError(null);
            } else {
              setLeaderboardError('Invalid leaderboard data format');
              setLeaderboard([]);
            }
          }
          setLeaderboardLoading(false);
        } catch (error) {
          console.error('Error fetching data:', error);
          setChatError('Failed to fetch messages');
          setLeaderboardError('Failed to fetch leaderboard');
          setLeaderboardLoading(false);
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
      setChatError(null);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatError(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  if (position === 'left') {
    return (
      <div className="w-[420px] p-8 bg-yellow-50/80 dark:bg-gray-800 rounded-2xl">
        {customizer && <div className="mb-6">{customizer}</div>}
        <h2 className="text-xl font-bold mb-4">Did You Know?</h2>
        <div className="space-y-4 text-xl">
          {facts.map((fact, index) => (
            <p key={index} className="text-gray-700 dark:text-gray-300 font-medium">
              {fact}
            </p>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-[420px] p-8 bg-yellow-50/80 dark:bg-gray-800 rounded-2xl">
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Leaderboard</h2>
          <div className="flex flex-col gap-6 text-lg">
            {leaderboardLoading ? (
              <div className="text-gray-500 text-sm">Loading leaderboard...</div>
            ) : leaderboardError ? (
              <div className="text-red-500 text-sm">{leaderboardError}</div>
            ) : leaderboard.length > 0 ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-extrabold text-2xl">X Wins</span>
                  <span className="text-4xl font-extrabold">{leaderboard[0].xWins}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-pink-600 font-extrabold text-2xl">O Wins</span>
                  <span className="text-4xl font-extrabold">{leaderboard[0].oWins}</span>
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm">No leaderboard data available.</div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-6">Live Chat</h2>
          <div ref={chatRef} className="h-64 bg-white/80 dark:bg-gray-700 rounded-2xl p-5 mb-5 overflow-y-auto text-lg">
            {chatError ? (
              <p className="text-red-500 text-sm">{chatError}</p>
            ) : messages && messages.length > 0 ? (
              messages.map((message) => (
                <div key={message.id} className="mb-2">
                  <span className="font-extrabold text-xl">Player: </span>
                  <span className="text-xl">{message.content}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No messages yet</p>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-4 w-full mt-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 min-w-0 p-4 rounded-xl border text-lg dark:bg-gray-700 dark:border-gray-600"
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={isLoading}
              className="px-7 py-3 bg-primary text-white rounded-2xl text-lg font-semibold hover:opacity-90 disabled:opacity-50"
            >
              Send
            </button>
          </form>
          {/* Emoji Picker Toggle and Picker BELOW input */}
          <div className="w-full mt-3">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-white/80 dark:bg-gray-700 text-xl font-sans font-semibold shadow-md mb-2 transition hover:bg-yellow-100 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
              onClick={() => setShowEmojiPicker((v) => !v)}
            >
              <span role="img" aria-label="emoji">😊</span>
              <span>{showEmojiPicker ? 'Close Emoji Picker' : 'Send an emoji?'}</span>
            </button>
            {showEmojiPicker && (
              <div className="w-full max-w-full mt-2">
                <EmojiPicker
                  onEmojiClick={(emojiData) => setNewMessage((msg) => msg + emojiData.emoji)}
                  height={350}
                  width="100%"
                  style={{ width: '100%' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
} 