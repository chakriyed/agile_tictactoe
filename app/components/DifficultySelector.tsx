interface DifficultySelectorProps {
  onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
}

export default function DifficultySelector({ onSelect }: DifficultySelectorProps) {
  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-yellow-50 dark:bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Select AI Difficulty</h2>
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => onSelect('easy')}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          Easy
        </button>
        <button
          onClick={() => onSelect('medium')}
          className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Medium
        </button>
        <button
          onClick={() => onSelect('hard')}
          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Hard
        </button>
      </div>
    </div>
  );
} 