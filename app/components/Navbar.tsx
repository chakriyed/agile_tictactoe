interface NavbarProps {
  username: string;
  onLogout: () => void;
  hintsEnabled: boolean;
  setHintsEnabled: (enabled: boolean) => void;
}

export default function Navbar({ username, onLogout, hintsEnabled, setHintsEnabled }: NavbarProps) {
  return (
    <>
      <nav className="flex justify-end p-4">
        <div className="flex items-center gap-4 bg-white/90 dark:bg-gray-800 shadow-lg rounded-2xl px-6 py-3 border border-gray-200 dark:border-gray-700">
          <span className="text-gray-700 dark:text-gray-200 text-lg">
            Hi, <span className="font-extrabold text-primary bg-gradient-to-r from-purple-400 via-pink-500 to-fuchsia-500 bg-clip-text text-transparent">{username}</span>!
          </span>
          <button
            onClick={onLogout}
            className="ml-4 px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-full shadow hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </nav>
      {/* Hints Toggle below the navbar box */}
      <div className="flex justify-end pr-8 mt-2">
        <label className="flex items-center gap-3 cursor-pointer select-none text-base">
          <span className="text-gray-700 dark:text-gray-200">Hints</span>
          <button
            type="button"
            className={`relative w-12 h-7 transition-colors duration-200 rounded-full ${hintsEnabled ? 'bg-blue-500' : 'bg-gray-300'}`}
            onClick={() => setHintsEnabled(!hintsEnabled)}
            aria-pressed={hintsEnabled}
          >
            <span
              className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 ${hintsEnabled ? 'translate-x-5' : ''}`}
            />
          </button>
        </label>
      </div>
    </>
  );
}