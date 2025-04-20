type Player = 'X' | 'O' | null;
type Board = Player[];

interface MinimaxResult {
  score: number;
  move: number;
}

// Check if there's a winner
export function checkWinner(board: Board): Player {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

// Check if the board is full
function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

// Get available moves
export function getAvailableMoves(board: Board): number[] {
  return board.reduce<number[]>((moves, cell, index) => {
    if (cell === null) moves.push(index);
    return moves;
  }, []);
}

// Minimax algorithm implementation
function minimax(
  board: Board,
  depth: number,
  maxDepth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity
): MinimaxResult {
  const winner = checkWinner(board);
  
  // Terminal states
  if (winner === 'O') return { score: 10 - depth, move: -1 };
  if (winner === 'X') return { score: depth - 10, move: -1 };
  if (isBoardFull(board)) return { score: 0, move: -1 };
  if (depth >= maxDepth) return { score: 0, move: -1 };

  const availableMoves = getAvailableMoves(board);
  let bestMove = availableMoves[0]; // Initialize with first available move

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const move of availableMoves) {
      board[move] = 'O';
      const score = minimax(board, depth + 1, maxDepth, false, alpha, beta).score;
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break;
    }
    return { score: bestScore, move: bestMove };
  } else {
    let bestScore = Infinity;
    for (const move of availableMoves) {
      board[move] = 'X';
      const score = minimax(board, depth + 1, maxDepth, true, alpha, beta).score;
      board[move] = null;

      if (score < bestScore) {
        bestScore = score;
        bestMove = move;
      }
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break;
    }
    return { score: bestScore, move: bestMove };
  }
}

// Returns [{move, prob}] for each possible move for the given player
export function getMoveWinProbs(board: Board, player: Player): { move: number; prob: number }[] {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return [];

  // For each move, simulate and run minimax
  const maxDepth = 8;
  const scores = availableMoves.map(move => {
    const newBoard = [...board];
    newBoard[move] = player;
    // If player is 'O', maximizing; if 'X', minimizing
    const result = minimax(
      newBoard,
      0,
      maxDepth,
      player === 'O' ? false : true // next turn is for the other player
    );
    return { move, score: result.score };
  });

  // Normalize scores to probabilities
  let minScore = Math.min(...scores.map(s => s.score));
  let maxScore = Math.max(...scores.map(s => s.score));
  // Avoid division by zero
  if (maxScore === minScore) maxScore = minScore + 1;
  return scores.map(({ move, score }) => ({
    move,
    prob: player === 'O'
      ? Math.round(((score - minScore) / (maxScore - minScore)) * 100)
      : Math.round(((maxScore - score) / (maxScore - minScore)) * 100)
  }));
}

export function getBestMove(board: Board, difficulty: 'easy' | 'medium' | 'hard'): number {
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) {
    return -1;
  }
  
  // For easy difficulty, randomly choose a move 70% of the time
  if (difficulty === 'easy' && Math.random() < 0.7) {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // For medium difficulty, use limited depth
  const maxDepth = difficulty === 'medium' ? 2 : 8;
  
  // Use minimax algorithm with alpha-beta pruning
  const result = minimax(board, 0, maxDepth, true);
  return result.move;
} 