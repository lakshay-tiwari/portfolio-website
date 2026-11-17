import React from "react";
import type { DogAnimationState, DogIdleGesture, DogDirection } from "./dogMotionConfig";
import {
  CORGI_PALETTE,
  CORGI_8DIR_FRAMES,
  FramePathData,
} from "./corgiPixelFrames";

export type { DogDirection } from "./dogMotionConfig";

export interface DogCharacterProps {
  /** Current animation state derived from movement physics */
  state?: DogAnimationState;
  /** 8-directional heading (up, down, left, right, up-left, up-right, down-left, down-right) */
  direction?: DogDirection;
  /** Whether the dog is currently in the middle of turning */
  isTurning?: boolean;
  /** Active idle personality gesture */
  gesture?: DogIdleGesture;
  /** Whether in excited mode (post-chase or happy wag) */
  isExcited?: boolean;
  /** Whether currently playing click reaction */
  isClickReacting?: boolean;
  /** Dimension width in pixels (default: 50) */
  width?: number;
  /** Dimension height in pixels (default: 44) */
  height?: number;
  /** Dimension size in pixels (default: 50; computes 36:32 aspect ratio height) */
  size?: number;
  /** Optional custom class name */
  className?: string;
}

/**
 * Helper to render pre-computed multi-color SVG path layers for a frame
 */
function FrameLayer({
  frame,
  className,
}: {
  frame: FramePathData;
  className: string;
}) {
  return (
    <g className={`corgi-frame ${className}`}>
      {frame.darkShade && (
        <path d={frame.darkShade} fill={CORGI_PALETTE.darkShade} />
      )}
      {frame.tan && <path d={frame.tan} fill={CORGI_PALETTE.tan} />}
      {frame.white && <path d={frame.white} fill={CORGI_PALETTE.white} />}
      {frame.pink && <path d={frame.pink} fill={CORGI_PALETTE.pink} />}
      {frame.gold && <path d={frame.gold} fill={CORGI_PALETTE.gold} />}
      {frame.dark && <path d={frame.dark} fill={CORGI_PALETTE.dark} />}
    </g>
  );
}

/**
 * DogCharacter: 8-Directional Pixel-Art Corgi
 *
 * Professional 8-directional pixel-art Corgi character:
 * - 8 distinct directional perspectives:
 *   - UP: rear view (no face, back of ears, fluffy corgi rear/butt)
 *   - DOWN: front view (perky upright ears, eyes, nose, golden collar, front paws)
 *   - LEFT / RIGHT: classic low-rider side profiles
 *   - UP_LEFT / UP_RIGHT: genuine diagonal 3/4 rear perspectives
 *   - DOWN_LEFT / DOWN_RIGHT: genuine diagonal 3/4 front perspectives
 * - 36x32 authentic pixel art with compact body, short legs, upright ears, golden collar
 * - Coordinated walking trot cycles and running sprint gallops
 * - GPU hardware-accelerated SVG paths with zero garbage collection
 * - Absolutely zero speech bubbles, labels, or text
 */
export function DogCharacter({
  state = "idle",
  direction = "down",
  isTurning = false,
  gesture = "none",
  isExcited = false,
  isClickReacting = false,
  width: customWidth,
  height: customHeight,
  size = 50,
  className = "",
}: DogCharacterProps) {
  // Compute dimensions preserving the exact 36x32 (9:8) retro pixel aspect ratio
  const charWidth = customWidth ?? size;
  const charHeight = customHeight ?? Math.round((charWidth * 32) / 36);

  // Retrieve pre-rendered frame paths for the active 8-directional perspective
  const frameSet = CORGI_8DIR_FRAMES[direction] || CORGI_8DIR_FRAMES["down"];

  return (
    <div
      className={`corgi-character-root relative select-none pointer-events-none ${className}`}
      style={{ width: charWidth, height: charHeight }}
      data-state={state}
      data-direction={direction}
      data-turning={isTurning ? "true" : "false"}
      data-gesture={gesture}
      data-excited={isExcited ? "true" : "false"}
      data-click-react={isClickReacting ? "true" : "false"}
      role="img"
      aria-label={`Pixel corgi companion (${direction}, ${state})`}
    >
      <style>{`
        /* ───────────── Pixel Corgi SVG base rendering ───────────── */
        .pixel-corgi-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          shape-rendering: crispEdges;
          image-rendering: pixelated;
        }

        /* Dark mode: crisp pixel art with zero glow */
        .dark .pixel-corgi-svg {
          filter: none;
        }

        /* Light mode: subtle crisp outline for clarity against bright backgrounds */
        :root:not(.dark) .pixel-corgi-svg {
          filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.45));
        }

        /*
         * ─── FRAME VISIBILITY ──────────────────────────────────────────
         * Frame swapping uses opacity (0/1) with steps(1) to eliminate all
         * layout recalculations and prevent intermediate frame flickering.
         */
        .corgi-frame {
          opacity: 0;
          pointer-events: none;
          transition: transform 0.12s ease-out;
        }

        /* ─── 1. RESTING & SITTING ─────────────────────────────────── */
        [data-state="sitting"] .frame-sit,
        [data-state="idle"]:not([data-turning="true"]) .frame-sit {
          opacity: 1;
        }

        /* ─── 2. WALKING: 2-frame coordinated trot cycle ─────────────── */
        [data-state="walking"]:not([data-turning="true"]) .frame-walk1 {
          opacity: 1;
          animation: corgi-walk-cycle-a 0.32s steps(1) infinite;
        }
        [data-state="walking"]:not([data-turning="true"]) .frame-walk2 {
          opacity: 0;
          animation: corgi-walk-cycle-b 0.32s steps(1) infinite;
        }

        /* ─── 3. RUNNING: 2-frame energetic gallop cycle ─────────────── */
        [data-state="running"]:not([data-turning="true"]) .frame-run1 {
          opacity: 1;
          animation: corgi-run-cycle-a 0.20s steps(1) infinite;
        }
        [data-state="running"]:not([data-turning="true"]) .frame-run2 {
          opacity: 0;
          animation: corgi-run-cycle-b 0.20s steps(1) infinite;
        }

        @keyframes corgi-walk-cycle-a {
          0%, 50%      { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        @keyframes corgi-walk-cycle-b {
          0%, 50%      { opacity: 0; }
          50.01%, 100% { opacity: 1; }
        }
        @keyframes corgi-run-cycle-a {
          0%, 50%      { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        @keyframes corgi-run-cycle-b {
          0%, 50%      { opacity: 0; }
          50.01%, 100% { opacity: 1; }
        }

        /* ─── 4. TURNING: slight crouch compression transition ───────── */
        [data-turning="true"] .corgi-frame {
          transform: scale(0.96, 0.94);
          transform-origin: 18px 24px;
        }
        [data-turning="true"] .frame-walk1 {
          opacity: 1 !important;
        }

        /* ─── 5. MICRO-INTERACTION (CLICK REACTION) ───────────────── */
        [data-click-react="true"] .pixel-corgi-svg {
          animation: corgi-hop 0.28s cubic-bezier(0.22, 1, 0.36, 1) infinite alternate;
        }
        @keyframes corgi-hop {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-3px); }
        }

        /* ─── ACCESSIBILITY (prefers-reduced-motion) ────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .corgi-frame {
            animation: none !important;
          }
          [data-state="sitting"] .frame-sit,
          [data-state="idle"] .frame-sit,
          [data-state="walking"] .frame-walk1,
          [data-state="running"] .frame-run1 {
            opacity: 1 !important;
          }
          .pixel-corgi-svg {
            animation: none !important;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 36 32"
        className="pixel-corgi-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <FrameLayer frame={frameSet.sit} className="frame-sit" />
        <FrameLayer frame={frameSet.walk1} className="frame-walk1" />
        <FrameLayer frame={frameSet.walk2} className="frame-walk2" />
        <FrameLayer frame={frameSet.run1} className="frame-run1" />
        <FrameLayer frame={frameSet.run2} className="frame-run2" />
      </svg>
    </div>
  );
}
