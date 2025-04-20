'use client';

import { useState, useEffect } from 'react';
import { checkWinner, getBestMove } from '../utils/minimax';
import DifficultySelector from './DifficultySelector';

export default function Game() {
  // Use a strict Board type allowing 'X', 'O', or null
  type Board = ('X' | 'O' | null)[];
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'draw'>('playing');

  useEffect(() => {
    if (!isXNext && difficulty && gameStatus === 'playing') {
      // AI's turn
      const aiMove = getBestMove(board, difficulty);
      const timeout = setTimeout(() => {
        handleClick(aiMove);
      }, 500); // Add a small delay to make it feel more natural

      return () => clearTimeout(timeout);
    }
  }, [isXNext, board, difficulty, gameStatus]);

  const handleClick = (i: number) => {
    if (gameStatus !== 'playing' || board[i] || (!isXNext && difficulty)) {
      return;
    }

    const newBoard = [...board];
    newBoard[i] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameStatus('won');
      return;
    }

    if (newBoard.every(square => square !== null)) {
      setGameStatus('draw');
      return;
    }

    setIsXNext(!isXNext);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('playing');
  };

  const handleDifficultySelect = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    handleReset();
  };

  const renderSquare = (i: number) => (
    <button
      className="w-20 h-20 border border-gray-400 dark:border-gray-600 flex items-center justify-center text-4xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      onClick={() => handleClick(i)}
      disabled={Boolean(gameStatus !== 'playing' || (!isXNext && difficulty))}
    >
      {board[i]}
    </button>
  );

  const getStatusMessage = () => {
    if (gameStatus === 'won') {
      const winner = isXNext ? 'O' : 'X';
      return `Winner: ${winner}`;
    }
    if (gameStatus === 'draw') {
      return "Game is a draw!";
    }
    return `Next player: ${isXNext ? 'X' : 'O'}`;
  };

  if (!difficulty) {
    return <DifficultySelector onSelect={handleDifficultySelect} />;
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold mb-4">Tic Tac Toe vs AI ({difficulty})</h1>
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-3 gap-1">
          {Array(9).fill(null).map((_, i) => (
            <div key={i}>{renderSquare(i)}</div>
          ))}
        </div>
      </div>

      <div className="text-xl font-bold">{getStatusMessage()}</div>

      <div className="flex gap-4">
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Reset Game
        </button>
        <button
          onClick={() => {
            setDifficulty(null);
            handleReset();
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
        >
          Change Difficulty
        </button>
      </div>
    </div>
  );
} 