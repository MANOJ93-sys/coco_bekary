import React, { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
}

const COLORS = ['#FF8BA7', '#FFD166', '#06D6A0', '#118AB2', '#F72585', '#E9D8A6'];

export const SparkleCursor: React.FC = () => {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }
    // Disable on coarse touch-only devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    let nextId = 0;
    let throttleTimeout: NodeJS.Timeout | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      if (throttleTimeout) return;
      throttleTimeout = setTimeout(() => {
        throttleTimeout = null;
      }, 35); // Throttle to maintain 60fps without overwhelming DOM

      const newSparkle: Sparkle = {
        id: nextId++,
        x: e.clientX,
        y: e.clientY,
        size: Math.random() * 8 + 6,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      };

      setSparkles((prev) => [...prev.slice(-14), newSparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 650);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (throttleTimeout) clearTimeout(throttleTimeout);
    };
  }, []);

  if (sparkles.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
      {sparkles.map((sparkle) => (
        <span
          key={sparkle.id}
          className="absolute -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            color: sparkle.color,
          }}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full opacity-70">
            <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5L12 0Z" />
          </svg>
        </span>
      ))}
    </div>
  );
};
