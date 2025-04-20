import React from "react";

// Pastel colors for X and O
const pastelX = "#7a91d9"; // deeper pastel blue
const pastelO = "#e67fa3"; // deeper pastel pink

// Generate a denser grid of X and O SVGs
const symbols: JSX.Element[] = [];
const rows = 48;
const cols = 80;
const size = 14;

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const isX = (row + col) % 2 === 0;
    const left = `${col * (100 / cols)}%`;
    const top = `${row * (100 / rows)}%`;
    symbols.push(
      <span
        key={`${row}-${col}`}
        style={{
          position: "absolute",
          left,
          top,
          opacity: 0.08,
          fontSize: size,
          fontWeight: 700,
          color: isX ? pastelX : pastelO,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {isX ? "X" : "O"}
      </span>
    );
  }
} 

export default function BackgroundPattern() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: -1,
        pointerEvents: "none",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      {symbols}
    </div>
  );
}
