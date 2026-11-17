import React from "react";
import type { DogAnimationState, DogIdleGesture } from "./dogMotionConfig";
import {
  FRAME_RUN1,
  FRAME_RUN2,
  FRAME_WALK1,
  FRAME_WALK2,
  FRAME_IDLE1,
  FRAME_IDLE2,
  FRAME_SITTING,
} from "./pixelFrames";

export interface DogCharacterProps {
  /** Current animation state derived from movement physics */
  state?: DogAnimationState;
  /** Whether the dog is currently in the middle of turning */
  isTurning?: boolean;
  /** Active idle personality gesture */
  gesture?: DogIdleGesture;
  /** Whether in excited mode (post-chase or happy wag) */
  isExcited?: boolean;
  /** Whether currently playing click jump reaction */
  isClickReacting?: boolean;
  /** Whether in a blink frame (retained for interface compatibility) */
  isBlinking?: boolean;
  /** Dimension width in pixels (default: 56) */
  width?: number;
  /** Dimension height in pixels (default: 42) */
  height?: number;
  /** Dimension size in pixels (default: 56; computes 4:3 aspect height) */
  size?: number;
  /** Optional custom class name */
  className?: string;
}

// Pre-render static SVG rect arrays for zero garbage collection during animation
const RUN1_RECTS = FRAME_RUN1.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const RUN2_RECTS = FRAME_RUN2.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const WALK1_RECTS = FRAME_WALK1.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const WALK2_RECTS = FRAME_WALK2.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const IDLE1_RECTS = FRAME_IDLE1.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const IDLE2_RECTS = FRAME_IDLE2.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const SIT_RECTS = FRAME_SITTING.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));

/**
 * DogCharacter (Minimalist Pixel-Art 8-Bit Silhouette)
 *
 * Exact 36x27 pixel art silhouette matching the reference design:
 * - Pure white retro 8-bit character on a transparent background
 * - Stepped sprite-based animations (running, walking, idle, sitting)
 * - RUN1 matches the exact reference frame pixel-for-pixel
 * - Dual drop-shadow contour: crisp 1px perimeter for 100% clarity on pure white backgrounds
 *   plus soft elevation on dark themes (#0a0a0f)
 * - Pure movement and animation communication; absolutely zero text or speech bubbles
 */
export function DogCharacter({
  state = "idle",
  isTurning = false,
  gesture = "none",
  isExcited = false,
  isClickReacting = false,
  width: customWidth,
  height: customHeight,
  size = 56,
  className = "",
}: DogCharacterProps) {
  // Compute dimensions preserving the exact 36x27 (4:3) retro aspect ratio
  const charWidth = customWidth ?? size;
  const charHeight = customHeight ?? Math.round((charWidth * 27) / 36);

  return (
    <div
      className={`dog-character-root relative select-none pointer-events-none ${className}`}
      style={{ width: charWidth, height: charHeight }}
      data-state={state}
      data-turning={isTurning ? "true" : "false"}
      data-gesture={gesture}
      data-excited={isExcited ? "true" : "false"}
      data-click-react={isClickReacting ? "true" : "false"}
      role="img"
      aria-label={`Pixel dog companion (${state})`}
    >
      <style>{`
        /* Pixel Dog SVG base rendering */
        .pixel-dog-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          shape-rendering: crispEdges;
          image-rendering: pixelated;
          /*
           * Dual-contour drop shadow:
           * 1. 1px crisp outline contour: ensures the pure white dog silhouette is distinctly
           *    visible and crisp against light & pure white (#FFFFFF) backgrounds.
           * 2. Soft 2px ambient shadow: provides depth and elevation against dark (#0a0a0f) backgrounds.
           */
          filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.95)) drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
          transition: transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* All pixel frames hidden by default */
        .pixel-frame {
          display: none;
          fill: #FFFFFF;
        }

        /* 1. Idle State: Calm resting pose with gentle 1px tail micro-wag */
        [data-state="idle"] .frame-idle1 {
          display: inline;
          animation: pixel-idle-a 2.2s steps(1) infinite;
        }
        [data-state="idle"] .frame-idle2 {
          display: none;
          animation: pixel-idle-b 2.2s steps(1) infinite;
        }

        @keyframes pixel-idle-a {
          0%, 82% { display: inline; }
          82.01%, 100% { display: none; }
        }
        @keyframes pixel-idle-b {
          0%, 82% { display: none; }
          82.01%, 100% { display: inline; }
        }

        /* 1b. Excited Idle / Click React in Idle: High-speed tail wag */
        [data-state="idle"][data-excited="true"] .frame-idle1,
        [data-state="idle"][data-click-react="true"] .frame-idle1 {
          animation: pixel-idle-fast-a 0.18s steps(1) infinite;
        }
        [data-state="idle"][data-excited="true"] .frame-idle2,
        [data-state="idle"][data-click-react="true"] .frame-idle2 {
          animation: pixel-idle-fast-b 0.18s steps(1) infinite;
        }

        @keyframes pixel-idle-fast-a {
          0%, 50% { display: inline; }
          50.01%, 100% { display: none; }
        }
        @keyframes pixel-idle-fast-b {
          0%, 50% { display: none; }
          50.01%, 100% { display: inline; }
        }

        /* 2. Walking State: Stepped 8-bit trot cycle */
        [data-state="walking"] .frame-walk1 {
          display: inline;
          animation: pixel-walk-a 0.30s steps(1) infinite;
        }
        [data-state="walking"] .frame-walk2 {
          display: none;
          animation: pixel-walk-b 0.30s steps(1) infinite;
        }

        @keyframes pixel-walk-a {
          0%, 50% { display: inline; }
          50.01%, 100% { display: none; }
        }
        @keyframes pixel-walk-b {
          0%, 50% { display: none; }
          50.01%, 100% { display: inline; }
        }

        /* 3. Running State: Stepped 8-bit gallop cycle */
        /* Frame 1 is the exact pixel silhouette from the user's reference image */
        [data-state="running"] .frame-run1 {
          display: inline;
          animation: pixel-run-a 0.16s steps(1) infinite;
        }
        [data-state="running"] .frame-run2 {
          display: none;
          animation: pixel-run-b 0.16s steps(1) infinite;
        }

        @keyframes pixel-run-a {
          0%, 50% { display: inline; }
          50.01%, 100% { display: none; }
        }
        @keyframes pixel-run-b {
          0%, 50% { display: none; }
          50.01%, 100% { display: inline; }
        }

        /* 4. Sitting State: Relaxed seated pixel silhouette */
        [data-state="sitting"] .frame-sit {
          display: inline;
        }

        /* 5. Micro-Interactions & Gestures */
        /* Click Reaction & Sprint Excitement Hop */
        [data-click-react="true"] .pixel-dog-svg,
        [data-state="idle"][data-excited="true"] .pixel-dog-svg {
          animation: pixel-hop 0.34s cubic-bezier(0.22, 1, 0.36, 1) infinite alternate;
        }
        @keyframes pixel-hop {
          0% { transform: translateY(0); }
          100% { transform: translateY(-4px); }
        }

        /* Inquisitive Head Tilt */
        [data-gesture="tilt"] .pixel-dog-svg {
          transform: rotate(7deg);
          transform-origin: 24px 18px;
        }

        /* Curious Sniff / Lift */
        [data-gesture="curious"] .pixel-dog-svg {
          transform: translateY(-2px) scale(1.03, 0.97);
          transform-origin: 24px 22px;
        }

        /* Look Around */
        [data-gesture="look-around"] .pixel-dog-svg {
          transform: scaleX(0.92);
          transform-origin: center center;
        }

        /* Turning shadow deepening */
        [data-turning="true"] .pixel-dog-svg {
          filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.95)) drop-shadow(0 2px 3px rgba(0, 0, 0, 0.45));
        }

        /* Accessibility: respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          .frame-idle1, .frame-walk1, .frame-run1, .frame-sit {
            animation: none !important;
          }
          .frame-idle2, .frame-walk2, .frame-run2 {
            display: none !important;
            animation: none !important;
          }
          .pixel-dog-svg {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 36 27"
        className="pixel-dog-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="pixel-frame frame-run1">{RUN1_RECTS}</g>
        <g className="pixel-frame frame-run2">{RUN2_RECTS}</g>
        <g className="pixel-frame frame-walk1">{WALK1_RECTS}</g>
        <g className="pixel-frame frame-walk2">{WALK2_RECTS}</g>
        <g className="pixel-frame frame-idle1">{IDLE1_RECTS}</g>
        <g className="pixel-frame frame-idle2">{IDLE2_RECTS}</g>
        <g className="pixel-frame frame-sit">{SIT_RECTS}</g>
      </svg>
    </div>
  );
}
