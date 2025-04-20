import React from "react";

interface ColorCustomizerProps {
  xColor: string;
  oColor: string;
  setXColor: (color: string) => void;
  setOColor: (color: string) => void;
}

export default function ColorCustomizer({ xColor, oColor, setXColor, setOColor }: ColorCustomizerProps) {
  return (
    <div className="bg-white/80 rounded-2xl p-4 shadow-lg border border-yellow-100 flex flex-col w-full gap-3 mb-4">
      <h3 className="text-base font-semibold mb-3 flex items-center gap-2">
        <span className="bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent">Customize X and O Color</span>
        <span role="img" aria-label="palette" className="text-xl">🎨</span>
      </h3>
      <div className="flex flex-col gap-2 w-full">
        <div className="flex flex-row items-center justify-between w-full gap-4 min-h-[2.5rem]">
          <span className="text-lg font-bold" style={{ color: xColor }}>X</span>
          <input
            type="color"
            value={xColor}
            onChange={e => setXColor(e.target.value)}
            className="w-20 h-8 ml-2 p-0 border-none bg-transparent cursor-pointer align-middle transition-transform hover:scale-110 hover:ring-2 hover:ring-yellow-300"
          />
        </div>
        <div className="flex flex-row items-center justify-between w-full gap-4 min-h-[2.5rem]">
          <span className="text-lg font-bold" style={{ color: oColor }}>O</span>
          <input
            type="color"
            value={oColor}
            onChange={e => setOColor(e.target.value)}
            className="w-20 h-8 ml-2 p-0 border-none bg-transparent cursor-pointer align-middle transition-transform hover:scale-110 hover:ring-2 hover:ring-yellow-300"
          />
        </div>
      </div>
    </div>
  );
}
