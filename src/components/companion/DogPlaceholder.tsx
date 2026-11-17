import React from "react";

interface DogPlaceholderProps {
  size?: number;
}

/**
 * Clean, lightweight 60px vector dog companion placeholder for Phase 1.
 * Drawn facing right so that scaleX(1) faces right and scaleX(-1) faces left.
 */
export function DogPlaceholder({ size = 60 }: DogPlaceholderProps) {
  return (
    <div
      style={{ width: size, height: size }}
      className="relative select-none pointer-events-none drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] dark:drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)]"
      role="img"
      aria-label="Dog cursor companion placeholder"
    >
      <svg
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Soft ground shadow */}
        <ellipse cx="30" cy="54" rx="18" ry="4" fill="rgba(0,0,0,0.15)" />

        {/* Back Ear (facing right, so left ear is in background) */}
        <ellipse
          cx="20"
          cy="20"
          rx="6"
          ry="11"
          transform="rotate(-20 20 20)"
          fill="#D97706" // Warm amber/golden
        />

        {/* Dog Head Base */}
        <circle cx="30" cy="28" r="18" fill="#FBBF24" />

        {/* Cute Forehead Patch / Highlights */}
        <ellipse cx="28" cy="22" rx="9" ry="6" fill="#FDE68A" />

        {/* Snout / Muzzle */}
        <ellipse cx="38" cy="32" rx="9" ry="7" fill="#FEF3C7" />

        {/* Nose */}
        <ellipse cx="43" cy="30" rx="3.5" ry="2.5" fill="#1F2937" />
        {/* Nose highlight */}
        <circle cx="42" cy="29" r="1" fill="#FFFFFF" opacity="0.8" />

        {/* Mouth */}
        <path
          d="M 40 34 Q 42 36 44 34"
          stroke="#92400E"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Eye (Front) */}
        <circle cx="34" cy="24" r="3" fill="#1F2937" />
        {/* Eye gleam */}
        <circle cx="33" cy="23" r="1" fill="#FFFFFF" />

        {/* Front Floppy Ear */}
        <ellipse
          cx="18"
          cy="24"
          rx="6"
          ry="12"
          transform="rotate(18 18 24)"
          fill="#B45309"
        />
        <ellipse
          cx="18"
          cy="24"
          rx="3.5"
          ry="8"
          transform="rotate(18 18 24)"
          fill="#D97706"
        />

        {/* Cheerful Collar */}
        <path
          d="M 20 40 Q 30 46 40 40"
          stroke="#EF4444"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Collar Gold Tag */}
        <circle cx="30" cy="45" r="2.5" fill="#F59E0B" />
        <circle cx="30" cy="45" r="1.2" fill="#FEF08A" />
      </svg>
    </div>
  );
}

