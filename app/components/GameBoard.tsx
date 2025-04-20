'use client';

import { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { checkWinner, getBestMove } from '../utils/minimax';
import DifficultySelector from './DifficultySelector';
import { motion } from 'framer-motion';

type Player = 'X' | 'O' | null;

export default function GameBoard() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [gameMode, setGameMode] = useState<'ai' | 'player'>('player');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Update window size
    const updateWindowSize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    
    updateWindowSize();
    window.addEventListener('resize', updateWindowSize);
    
    return () => window.removeEventListener('resize', updateWindowSize);
  }, []);

  // AI move effect
  useEffect(() => {
    // Only make AI move if:
    // 1. It's O's turn (AI is O)
    // 2. Game mode is AI
    // 3. Game is not over
    // 4. Difficulty is selected
    if (!isXNext && 
        gameMode === 'ai' && 
        difficulty && 
        !calculateWinner(board) && 
        !board.every(square => square !== null)) {
      const aiMove = getBestMove([...board], difficulty); // Pass a copy of the board
      if (aiMove !== -1) {
        const timeout = setTimeout(() => {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [isXNext, board, gameMode, difficulty]);

  const handleClick = (index: number) => {
    // Prevent moves if:
    // 1. Square is occupied
    // 2. Game is over
    // 3. It's AI's turn in AI mode
    if (board[index] || calculateWinner(board) || (!isXNext && gameMode === 'ai')) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const calculateWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : board.every(square => square)
    ? 'Draw!'
    : `Next player: ${isXNext ? 'X' : 'O'}`;

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const handleDifficultySelect = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setGameMode('ai');
    setShowDifficultySelector(false);
    resetGame();
  };

  if (showDifficultySelector) {
    return (
      <div className="flex-1 max-w-lg mx-auto">
        <DifficultySelector onSelect={handleDifficultySelect} />
      </div>
    );
  }

  return (
    <div className="flex-1 max-w-lg mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold gradient-text animate-float">
          Tic Tac Toe
        </h1>
        <div className="flex justify-center gap-2 mt-2">
          <span className="text-3xl animate-bounce delay-100">×</span>
          <span className="text-3xl animate-bounce delay-200">○</span>
          <span className="text-3xl animate-bounce delay-300">×</span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setShowDifficultySelector(true)}
          className={`px-6 py-2 ${
            gameMode === 'ai' ? 'bg-green-500' : 'bg-primary'
          } text-white rounded-full hover:opacity-90 transition-opacity`}
        >
          {gameMode === 'ai' ? `AI Mode (${difficulty})` : 'Play vs AI'}
        </button>
        <button
          onClick={() => {
            setGameMode('player');
            setDifficulty(null);
            resetGame();
          }}
          className={`px-6 py-2 ${
            gameMode === 'player' ? 'bg-green-500' : 'bg-primary'
          } text-white rounded-full hover:opacity-90 transition-opacity`}
        >
          Multiplayer
        </button>
        <button
          onClick={() => setShowTutorial(true)}
          className="px-6 py-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
        >
          Tutorial
        </button>
      </div>

      {/* Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl font-bold"
              onClick={() => setShowTutorial(false)}
              aria-label="Close tutorial"
            >
              ×
            </button>
            <h2 className="text-3xl font-bold mb-4 text-primary">How to Play Tic Tac Toe</h2>
            <ul className="list-disc list-inside text-lg text-gray-700 dark:text-gray-200 space-y-2 mb-2">
              <li>The game is played on a 3x3 grid.</li>
              <li>Players take turns placing their symbol (X or O) in empty squares.</li>
              <li>The first player to get three of their symbols in a row (horizontally, vertically, or diagonally) wins.</li>
              <li>If all 9 squares are filled and no player has three in a row, the game ends in a draw.</li>
              <li>Use "Play vs AI" to play against the computer, or "Multiplayer" to play with a friend on the same device.</li>
            </ul>
            <div className="text-center mt-4">
              <button
                onClick={() => setShowTutorial(false)}
                className="px-4 py-2 bg-primary text-white rounded hover:opacity-90 transition-opacity"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}


      {winner && (
        <>
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            recycle={false}
            numberOfPieces={500}
          />
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg text-center">
              <h2 className="text-4xl font-bold mb-4 text-primary">
                🎉 Congratulations! 🎉
              </h2>
              <p className="text-2xl mb-6">Player {winner} Wins!</p>
              <button
                onClick={resetGame}
                className="px-6 py-2 bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
              >
                Play Again
              </button>
            </div>
          </div>
        </>
      )}

      <div className="text-xl text-center mb-4">{status}</div>
      <div className="game-board">
        {board.map((value, index) => (
          <button
            key={index}
            className="game-cell"
            onClick={() => handleClick(index)}
            disabled={Boolean(!isXNext && gameMode === 'ai')}
          >
            {value}
          </button>
        ))}
      </div>

      {!winner && board.every(square => square) && (
        <div className="text-center mt-6">
          <p className="text-xl mb-4">It's a Draw!</p>
          <button
            onClick={resetGame}
            className="px-6 py-2 bg-primary text-white rounded-full hover:opacity-90 transition-opacity"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
} 