"use client";

import { useMemo } from "react";

function seededUnit(seed: number) {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

export function StarFallback() {
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      size: seededUnit(i + 13) * 2 + 1,
      top: `${seededUnit(i + 29) * 100}%`,
      left: `${seededUnit(i + 43) * 100}%`,
      opacity: seededUnit(i + 59) * 0.5 + 0.3,
      duration: seededUnit(i + 71) * 3 + 2,
      delay: seededUnit(i + 89) * 5,
    }));
  }, []);

  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{
        background:
          "radial-gradient(circle at 50% 48%, rgba(220, 238, 255, 0.2) 0 1%, rgba(184, 137, 77, 0.14) 2%, rgba(255, 122, 69, 0.08) 6%, rgba(3, 4, 6, 0.94) 24%, #030406 68%)",
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#b8894d]/20"
        style={{
          transform: "translate(-50%, -50%) rotateX(66deg) rotateZ(-18deg)",
          boxShadow:
            "0 0 34px rgba(184, 137, 77, 0.08), inset 0 0 20px rgba(255, 122, 69, 0.06)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 h-[48rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c7d0d8]/10"
        style={{
          transform: "translate(-50%, -50%) rotateX(68deg) rotateZ(21deg)",
          boxShadow: "0 0 40px rgba(199, 208, 216, 0.06)",
        }}
      />
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white shadow-[0_0_5px_rgba(255,255,255,0.8)]"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            top: star.top,
            left: star.left,
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out infinite`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
