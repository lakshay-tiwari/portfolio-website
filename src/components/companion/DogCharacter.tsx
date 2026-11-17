import React from "react";
import type { DogAnimationState, DogIdleGesture } from "./dogMotionConfig";
import {
  CAT_SIT,
  CAT_SIT_TAIL_UP,
  CAT_SIT_TAIL_LOW,
  CAT_SIT_BLINK,
  CAT_CROUCH_TURN,
  CAT_WALK1,
  CAT_WALK2,
  CAT_RUN1,
  CAT_RUN2,
  CAT_DOWN1,
  CAT_DOWN2,
  CAT_UP1,
  CAT_UP2,
} from "./pixelFrames";

export type CharacterHeading = "left" | "right" | "up" | "down";

export interface DogCharacterProps {
  /** Current animation state derived from movement physics */
  state?: DogAnimationState;
  /** 4-directional heading (up, down, left, right) */
  heading?: CharacterHeading;
  /** Whether the cat is currently in the middle of turning */
  isTurning?: boolean;
  /** Active idle personality gesture */
  gesture?: DogIdleGesture;
  /** Whether in excited mode (post-chase or happy wag) */
  isExcited?: boolean;
  /** Whether currently playing click reaction */
  isClickReacting?: boolean;
  /** Whether in a blink frame (retained for interface compatibility) */
  isBlinking?: boolean;
  /** Dimension width in pixels (default: 45) */
  width?: number;
  /** Dimension height in pixels (default: 36) */
  height?: number;
  /** Dimension size in pixels (default: 45; computes 5:4 aspect ratio height) */
  size?: number;
  /** Optional custom class name */
  className?: string;
}

// Pre-render static SVG rect arrays for zero garbage collection during animation
const SIT_RECTS = CAT_SIT.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const SIT_TAIL_UP_RECTS = CAT_SIT_TAIL_UP.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const SIT_TAIL_LOW_RECTS = CAT_SIT_TAIL_LOW.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const SIT_BLINK_RECTS = CAT_SIT_BLINK.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const CROUCH_TURN_RECTS = CAT_CROUCH_TURN.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const WALK1_RECTS = CAT_WALK1.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const WALK2_RECTS = CAT_WALK2.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const RUN1_RECTS = CAT_RUN1.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const RUN2_RECTS = CAT_RUN2.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const DOWN1_RECTS = CAT_DOWN1.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const DOWN2_RECTS = CAT_DOWN2.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const UP1_RECTS = CAT_UP1.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));
const UP2_RECTS = CAT_UP2.map(([x, y, w], i) => (
  <rect key={i} x={x} y={y} width={w} height={1} />
));

/**
 * PixelCatCharacter
 *
 * Authentic monochrome 8-bit pixel-art cat companion extracted directly from video reference:
 * - 40x32 canvas maintaining strict pixel alignment and crisp edges.
 * - Resting pose: upright seated cat with pointed ears, face, paws, and tail.
 * - Idle micro-animations: gentle tail swish, tail flick, and subtle eye blink.
 * - Proper pixel-art walking cycle: alternating leg strides, tail up/down movement.
 * - Separate pixel-art running cycle: full sprint gallop with body extension and compression.
 * - Authentic crouch pose during direction turn.
 * - Pure white silhouette on transparent background with crisp pixel edges.
 * - Zero text or speech bubbles.
 */
export function DogCharacter({
  state = "idle",
  heading = "down",
  isTurning = false,
  gesture = "none",
  isExcited = false,
  isClickReacting = false,
  width: customWidth,
  height: customHeight,
  size = 45,
  className = "",
}: DogCharacterProps) {
  // Compute dimensions preserving the exact 40x32 (5:4) retro pixel aspect ratio
  const charWidth = customWidth ?? size;
  const charHeight = customHeight ?? Math.round((charWidth * 32) / 40);

  return (
    <div
      className={`cat-character-root relative select-none pointer-events-none ${className}`}
      style={{ width: charWidth, height: charHeight }}
      data-state={state}
      data-heading={heading}
      data-turning={isTurning ? "true" : "false"}
      data-gesture={gesture}
      data-excited={isExcited ? "true" : "false"}
      data-click-react={isClickReacting ? "true" : "false"}
      role="img"
      aria-label={`Pixel cat companion (${state})`}
    >
      <style>{`
        /* ───────────── Pixel Cat SVG base rendering ───────────── */
        .pixel-cat-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
          shape-rendering: crispEdges;
          image-rendering: pixelated;
        }

        /* Dark mode: pure white with zero glow or shadow */
        .dark .pixel-cat-svg {
          filter: none;
        }

        /* Light mode: crisp 1px perimeter outline so pure white silhouette is clear */
        :root:not(.dark) .pixel-cat-svg {
          filter: drop-shadow(0 0 1px rgba(0, 0, 0, 0.95));
        }

        /*
         * ─── FRAME VISIBILITY ──────────────────────────────────────────
         * Frame swapping uses opacity (0/1) with steps(1) to eliminate all
         * layout recalculations and prevent intermediate frame flickering.
         */
        .cat-frame {
          fill: #FFFFFF;
          opacity: 0;
          pointer-events: none;
        }

        /* ─── 1. RESTING & SITTING ───────────────────────────────────
         * Default state: cat sits upright, calm and mostly stationary.
         * Periodic subtle idle loop (5.4s cycle):
         * - 0.0s to 3.8s: quiet resting pose (CAT_SIT)
         * - 3.8s to 4.2s: gentle tail flick (CAT_SIT_TAIL_UP)
         * - 4.2s to 4.5s: return to rest
         * - 4.5s to 4.9s: ground tail sweep (CAT_SIT_TAIL_LOW)
         * - 4.9s to 5.1s: subtle sleepy blink (CAT_SIT_BLINK)
         * - 5.1s to 5.4s: return to rest
         */
        [data-state="sitting"] .frame-sit,
        [data-state="idle"]:not([data-turning="true"]) .frame-sit {
          opacity: 1;
          animation: cat-sit-idle-main 5.4s steps(1) infinite;
        }

        [data-state="sitting"] .frame-sit-tail-up,
        [data-state="idle"]:not([data-turning="true"]) .frame-sit-tail-up {
          opacity: 0;
          animation: cat-sit-idle-tail-up 5.4s steps(1) infinite;
        }

        [data-state="sitting"] .frame-sit-tail-low,
        [data-state="idle"]:not([data-turning="true"]) .frame-sit-tail-low {
          opacity: 0;
          animation: cat-sit-idle-tail-low 5.4s steps(1) infinite;
        }

        [data-state="sitting"] .frame-sit-blink,
        [data-state="idle"]:not([data-turning="true"]) .frame-sit-blink {
          opacity: 0;
          animation: cat-sit-idle-blink 5.4s steps(1) infinite;
        }

        @keyframes cat-sit-idle-main {
          0%       { opacity: 1; }
          70%      { opacity: 1; }
          70.01%   { opacity: 0; }
          77.7%    { opacity: 0; }
          77.71%   { opacity: 1; }
          83.3%    { opacity: 1; }
          83.31%   { opacity: 0; }
          94.4%    { opacity: 0; }
          94.41%   { opacity: 1; }
          100%     { opacity: 1; }
        }

        @keyframes cat-sit-idle-tail-up {
          0%, 70%  { opacity: 0; }
          70.01%   { opacity: 1; }
          77.7%    { opacity: 1; }
          77.71%, 100% { opacity: 0; }
        }

        @keyframes cat-sit-idle-tail-low {
          0%, 83.3% { opacity: 0; }
          83.31%   { opacity: 1; }
          90.7%    { opacity: 1; }
          90.71%, 100% { opacity: 0; }
        }

        @keyframes cat-sit-idle-blink {
          0%, 90.7% { opacity: 0; }
          90.71%   { opacity: 1; }
          94.4%    { opacity: 1; }
          94.41%, 100% { opacity: 0; }
        }

        /* ─── 2. TURNING: Crouch turn pose ─────────────────────────── */
        [data-turning="true"] .cat-frame {
          opacity: 0 !important;
          animation: none !important;
        }
        [data-turning="true"] .frame-crouch-turn {
          opacity: 1 !important;
        }

        /* ─── 3. FACING DOWN: Moving downwards towards cursor ────────── */
        [data-heading="down"][data-state="walking"]:not([data-turning="true"]) .frame-down1,
        [data-heading="down"][data-state="running"]:not([data-turning="true"]) .frame-down1 {
          opacity: 1;
          animation: cat-walk-cycle-a 0.28s steps(1) infinite;
        }
        [data-heading="down"][data-state="walking"]:not([data-turning="true"]) .frame-down2,
        [data-heading="down"][data-state="running"]:not([data-turning="true"]) .frame-down2 {
          opacity: 0;
          animation: cat-walk-cycle-b 0.28s steps(1) infinite;
        }

        /* ─── 4. FACING UP: Moving upwards towards cursor ───────────── */
        [data-heading="up"][data-state="walking"]:not([data-turning="true"]) .frame-up1,
        [data-heading="up"][data-state="running"]:not([data-turning="true"]) .frame-up1 {
          opacity: 1;
          animation: cat-walk-cycle-a 0.28s steps(1) infinite;
        }
        [data-heading="up"][data-state="walking"]:not([data-turning="true"]) .frame-up2,
        [data-heading="up"][data-state="running"]:not([data-turning="true"]) .frame-up2 {
          opacity: 0;
          animation: cat-walk-cycle-b 0.28s steps(1) infinite;
        }

        /* ─── 5. HORIZONTAL WALKING (Left / Right): Side profile ────── */
        :not([data-heading="up"]):not([data-heading="down"])[data-state="walking"]:not([data-turning="true"]) .frame-walk1 {
          opacity: 1;
          animation: cat-walk-cycle-a 0.36s steps(1) infinite;
        }
        :not([data-heading="up"]):not([data-heading="down"])[data-state="walking"]:not([data-turning="true"]) .frame-walk2 {
          opacity: 0;
          animation: cat-walk-cycle-b 0.36s steps(1) infinite;
        }

        /* ─── 6. HORIZONTAL RUNNING (Left / Right): Side gallop ──────── */
        :not([data-heading="up"]):not([data-heading="down"])[data-state="running"]:not([data-turning="true"]) .frame-run1 {
          opacity: 1;
          animation: cat-run-cycle-a 0.20s steps(1) infinite;
        }
        :not([data-heading="up"]):not([data-heading="down"])[data-state="running"]:not([data-turning="true"]) .frame-run2 {
          opacity: 0;
          animation: cat-run-cycle-b 0.20s steps(1) infinite;
        }
        @keyframes cat-walk-cycle-a {
          0%, 50%      { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        @keyframes cat-walk-cycle-b {
          0%, 50%      { opacity: 0; }
          50.01%, 100% { opacity: 1; }
        }
        @keyframes cat-run-cycle-a {
          0%, 50%      { opacity: 1; }
          50.01%, 100% { opacity: 0; }
        }
        @keyframes cat-run-cycle-b {
          0%, 50%      { opacity: 0; }
          50.01%, 100% { opacity: 1; }
        }

        /* ─── 7. MICRO-INTERACTION (CLICK REACTION) ───────────────── */
        [data-click-react="true"] .pixel-cat-svg {
          animation: cat-hop 0.28s cubic-bezier(0.22, 1, 0.36, 1) infinite alternate;
        }
        @keyframes cat-hop {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-3px); }
        }

        /* ─── ACCESSIBILITY (prefers-reduced-motion) ────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .cat-frame {
            animation: none !important;
          }
          [data-state="sitting"] .frame-sit,
          [data-state="idle"] .frame-sit,
          [data-state="walking"] .frame-walk1,
          [data-state="running"] .frame-run1 {
            opacity: 1 !important;
          }
          .pixel-cat-svg {
            animation: none !important;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 40 32"
        className="pixel-cat-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g className="cat-frame frame-sit">{SIT_RECTS}</g>
        <g className="cat-frame frame-sit-tail-up">{SIT_TAIL_UP_RECTS}</g>
        <g className="cat-frame frame-sit-tail-low">{SIT_TAIL_LOW_RECTS}</g>
        <g className="cat-frame frame-sit-blink">{SIT_BLINK_RECTS}</g>
        <g className="cat-frame frame-crouch-turn">{CROUCH_TURN_RECTS}</g>
        <g className="cat-frame frame-walk1">{WALK1_RECTS}</g>
        <g className="cat-frame frame-walk2">{WALK2_RECTS}</g>
        <g className="cat-frame frame-run1">{RUN1_RECTS}</g>
        <g className="cat-frame frame-run2">{RUN2_RECTS}</g>
        <g className="cat-frame frame-down1">{DOWN1_RECTS}</g>
        <g className="cat-frame frame-down2">{DOWN2_RECTS}</g>
        <g className="cat-frame frame-up1">{UP1_RECTS}</g>
        <g className="cat-frame frame-up2">{UP2_RECTS}</g>
      </svg>
    </div>
  );
}
