"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

export interface PawTrailHandle {
  /**
   * Deposits a subtle paw print at coordinates (x, y) with a given rotation angle.
   * If isRunning is true, also emits a soft running dust puff.
   */
  depositPaw: (x: number, y: number, angleDeg: number, isRunning: boolean) => void;
  /** Clears all active paw prints and particles */
  clear: () => void;
}

export interface PawTrailProps {
  /** Maximum number of concurrent paw prints in pool (default: 8) */
  maxPaws?: number;
  /** Maximum number of running dust particles (default: 5) */
  maxDust?: number;
}

/**
 * PawTrail
 * 
 * High-performance, zero-garbage object pool for paw prints and running dust particles.
 * Pre-allocates a fixed pool of DOM elements and updates them directly via CSS transforms,
 * avoiding React re-renders and memory allocations during rapid cursor motion.
 */
export const PawTrail = forwardRef<PawTrailHandle, PawTrailProps>(function PawTrail(
  { maxPaws = 8, maxDust = 5 },
  ref
) {
  const pawRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dustRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pawIndex = useRef(0);
  const dustIndex = useRef(0);
  const isLeftPaw = useRef(false);

  useImperativeHandle(
    ref,
    () => ({
      depositPaw(x, y, angleDeg, isRunning) {
        if (typeof window === "undefined") return;

        // 1. Alternate foot offset perpendicular to travel angle for natural trotting tracks
        isLeftPaw.current = !isLeftPaw.current;
        const sideOffset = isLeftPaw.current ? -4.5 : 4.5;
        const rad = (angleDeg * Math.PI) / 180;
        // Perpendicular vector (-sin, cos)
        const footX = x + -Math.sin(rad) * sideOffset;
        const footY = y + Math.cos(rad) * sideOffset;

        // 2. Cycle next paw from the fixed pool
        const pIndex = pawIndex.current % maxPaws;
        pawIndex.current++;
        const pawEl = pawRefs.current[pIndex];

        if (pawEl) {
          pawEl.style.left = `${footX.toFixed(1)}px`;
          pawEl.style.top = `${footY.toFixed(1)}px`;
          pawEl.style.transform = `translate(-50%, -50%) rotate(${angleDeg.toFixed(1)}deg)`;

          // Re-trigger CSS fade animation cleanly
          pawEl.classList.remove("paw-print-active");
          void pawEl.offsetWidth; // Force reflow to restart animation
          pawEl.classList.add("paw-print-active");
        }

        // 3. Emit running dust puff if sprinting fast
        if (isRunning) {
          const dIndex = dustIndex.current % maxDust;
          dustIndex.current++;
          const dustEl = dustRefs.current[dIndex];

          if (dustEl) {
            dustEl.style.left = `${(x - Math.cos(rad) * 8).toFixed(1)}px`;
            dustEl.style.top = `${(y - Math.sin(rad) * 4).toFixed(1)}px`;

            dustEl.classList.remove("dust-puff-active");
            void dustEl.offsetWidth;
            dustEl.classList.add("dust-puff-active");
          }
        }
      },

      clear() {
        pawRefs.current.forEach((el) => el?.classList.remove("paw-print-active"));
        dustRefs.current.forEach((el) => el?.classList.remove("dust-puff-active"));
      },
    }),
    [maxPaws, maxDust]
  );

  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-[9997] overflow-hidden hidden sm:block"
      aria-hidden="true"
    >
      <style>{`
        .paw-print-slot {
          position: absolute;
          opacity: 0;
          will-change: transform, opacity;
          pointer-events: none;
        }
        .paw-print-active {
          animation: dog-paw-fade 1.35s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        @keyframes dog-paw-fade {
          0% {
            opacity: 0.38;
            transform: translate(-50%, -50%) scale(0.95);
          }
          30% {
            opacity: 0.32;
            transform: translate(-50%, -50%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.8);
          }
        }

        .dust-puff-slot {
          position: absolute;
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          opacity: 0;
          pointer-events: none;
          background: rgba(245, 158, 11, 0.35);
        }
        .dark .dust-puff-slot {
          background: rgba(253, 230, 138, 0.28);
        }
        .dust-puff-active {
          animation: dog-dust-expand 0.42s ease-out forwards;
        }
        @keyframes dog-dust-expand {
          0% {
            opacity: 0.55;
            transform: translate(-50%, -50%) scale(0.6);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.4) translateY(-3px);
          }
        }
      `}</style>

      {/* Pre-rendered Paw Prints Pool */}
      {Array.from({ length: maxPaws }).map((_, i) => (
        <div
          key={`paw-${i}`}
          ref={(el) => {
            pawRefs.current[i] = el;
          }}
          className="paw-print-slot w-3.5 h-3.5 text-amber-800/40 dark:text-amber-300/35"
        >
          {/* Subtle Corgi Paw Pad Vector (1 Main Pad + 4 Oval Toes) */}
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-full h-full">
            {/* Main Central Metacarpal Pad */}
            <path d="M 4.5 10 C 4.5 7.5 11.5 7.5 11.5 10 C 11.5 13.5 4.5 13.5 4.5 10 Z" />
            {/* 4 Little Toe Pads */}
            <ellipse cx="4.2" cy="5.8" rx="1.4" ry="1.9" transform="rotate(-18 4.2 5.8)" />
            <ellipse cx="6.8" cy="4.2" rx="1.4" ry="2" transform="rotate(-6 6.8 4.2)" />
            <ellipse cx="9.6" cy="4.2" rx="1.4" ry="2" transform="rotate(6 9.6 4.2)" />
            <ellipse cx="12.2" cy="5.8" rx="1.4" ry="1.9" transform="rotate(18 12.2 5.8)" />
          </svg>
        </div>
      ))}

      {/* Pre-rendered Sprint Dust Puffs Pool */}
      {Array.from({ length: maxDust }).map((_, i) => (
        <div
          key={`dust-${i}`}
          ref={(el) => {
            dustRefs.current[i] = el;
          }}
          className="dust-puff-slot"
        />
      ))}
    </div>
  );
});
