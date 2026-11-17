/**
 * Pixel Dog Frames (Refined)
 * 
 * Exact 36x27 pixel art matrix extracted directly from the user's reference image.
 * Pure white silhouette, 8-bit retro aesthetic, seamless animation states.
 * 
 * Walk/Run frames redesigned to have clearly distinct leg positions for visible stride.
 * RUN1 exactly matches the user's reference image.
 */

export interface PixelRect {
  x: number;
  y: number;
  w: number;
}

// ─────────────────────────── SHARED BODY ───────────────────────────
// Rows 0–20 (head, ears, body) are identical across all walk/idle frames.
// Only the leg rows (21–26) differ between frames.
const BODY_BASE: [number, number, number][] = [
  [1, 0, 2],
  [1, 1, 2],
  [2, 2, 2],
  [30, 2, 1],
  [2, 3, 3],
  [28, 3, 3],
  [3, 4, 3],
  [27, 4, 4],
  [4, 5, 3],
  [26, 5, 5],
  [4, 6, 3],
  [26, 6, 5],
  [5, 7, 3],
  [23, 7, 10],
  [5, 8, 6],
  [23, 8, 8],
  [32, 8, 3],
  [5, 9, 10],
  [22, 9, 9],
  [32, 9, 3],
  [4, 10, 13],
  [21, 10, 10],
  [32, 10, 3],
  [4, 11, 13],
  [21, 11, 10],
  [32, 11, 3],
  [4, 12, 14],
  [21, 12, 15],
  [4, 13, 22],
  [31, 13, 5],
  [4, 14, 32],
  [4, 15, 31],
  [4, 16, 31],
  [4, 17, 26],
  [4, 18, 23],
  [4, 19, 23],
  [5, 20, 23],
];

// ─────────────────────────── RUN FRAMES ───────────────────────────
// RUN1 exactly matches the user reference image (extracted pixel-perfect).
export const FRAME_RUN1: [number, number, number][] = [
  [0, 0, 2],
  [0, 1, 2],
  [0, 2, 2],
  [30, 2, 1],
  [1, 3, 4],
  [28, 3, 3],
  [2, 4, 4],
  [27, 4, 4],
  [3, 5, 4],
  [26, 5, 5],
  [3, 6, 4],
  [26, 6, 5],
  [5, 7, 3],
  [23, 7, 10],
  [5, 8, 6],
  [23, 8, 8],
  [32, 8, 3],
  [5, 9, 10],
  [22, 9, 9],
  [32, 9, 3],
  [3, 10, 14],
  [21, 10, 10],
  [32, 10, 3],
  [3, 11, 14],
  [21, 11, 10],
  [32, 11, 3],
  [3, 12, 15],
  [21, 12, 15],
  [3, 13, 23],
  [31, 13, 5],
  [3, 14, 33],
  [3, 15, 32],
  [3, 16, 32],
  [2, 17, 28],
  [2, 18, 11],
  [15, 18, 12],
  [1, 19, 10],
  [13, 19, 14],
  [0, 20, 7],
  [11, 20, 17],
  [0, 21, 7],
  [11, 21, 17],
  [0, 22, 2],
  [7, 22, 3],
  [13, 22, 9],
  [25, 22, 5],
  [0, 23, 1],
  [3, 23, 2],
  [23, 23, 2],
  [26, 23, 6],
  [2, 24, 1],
  [25, 24, 1],
  [28, 24, 5],
  [26, 25, 2],
  [31, 25, 4],
  [26, 26, 2],
  [31, 26, 4],
];

export const FRAME_RUN2: [number, number, number][] = [
  [2, 0, 2],
  [1, 1, 3],
  [2, 2, 3],
  [30, 2, 1],
  [3, 3, 3],
  [28, 3, 3],
  [3, 4, 4],
  [27, 4, 4],
  [4, 5, 4],
  [26, 5, 5],
  [5, 6, 3],
  [26, 6, 5],
  [5, 7, 5],
  [23, 7, 10],
  [5, 8, 7],
  [23, 8, 8],
  [32, 8, 3],
  [4, 9, 11],
  [22, 9, 9],
  [32, 9, 3],
  [3, 10, 14],
  [21, 10, 10],
  [32, 10, 3],
  [3, 11, 14],
  [21, 11, 10],
  [32, 11, 3],
  [3, 12, 15],
  [21, 12, 15],
  [3, 13, 23],
  [31, 13, 5],
  [3, 14, 33],
  [3, 15, 32],
  [3, 16, 32],
  [2, 17, 28],
  [2, 18, 25],
  [3, 19, 24],
  [4, 20, 24],
  [4, 21, 6],
  [12, 21, 12],
  [5, 22, 4],
  [13, 22, 10],
  [6, 23, 2],
  [14, 23, 4],
  [20, 23, 4],
  [6, 24, 2],
  [15, 24, 2],
  [21, 24, 4],
  [7, 25, 2],
  [22, 25, 4],
];

// ─────────────────────────── WALK FRAMES ───────────────────────────
// Walk frames use the shared body base. Legs are positioned to show a clear,
// visible stride: front legs and back legs alternate far apart (~8px difference).
//
// WALK1 — Front-right + Back-left legs extended (open stride A)
//   Leg cluster positions at row 21: x=2 (backmost), x=14 (mid), x=24 (front)
// WALK2 — Front-left + Back-right legs extended (open stride B)  
//   Leg cluster positions at row 21: x=4 (back), x=14 (mid), x=20 (front shifted inward)

// WALK1: Stride A — back left leg far behind, front right leg far ahead
const WALK1_LEGS: [number, number, number][] = [
  // Three visible leg columns with strong stride separation
  // Back leg: x=2 (far left = behind)
  [2, 21, 4],
  [1, 22, 4],
  [0, 23, 4],
  [0, 24, 3],
  [0, 25, 3],
  [0, 26, 3],
  // Mid leg: x=14 (center)
  [13, 21, 4],
  [14, 22, 3],
  [14, 23, 3],
  [14, 24, 3],
  [14, 25, 3],
  // Front leg: x=24 (far right = ahead)
  [23, 21, 4],
  [24, 22, 4],
  [25, 23, 4],
  [26, 24, 4],
  [27, 25, 3],
  [28, 26, 3],
];

// WALK2: Stride B — back leg swings forward, front leg swings back
const WALK2_LEGS: [number, number, number][] = [
  // Back leg: x=6 (shifted forward, mid-swing)
  [6, 21, 4],
  [7, 22, 4],
  [8, 23, 4],
  [8, 24, 3],
  [8, 25, 3],
  [8, 26, 3],
  // Mid leg: x=14 (center, stable)
  [13, 21, 4],
  [14, 22, 3],
  [14, 23, 3],
  [14, 24, 3],
  [14, 25, 3],
  // Front leg: x=19 (pulled back, mid-swing)
  [18, 21, 4],
  [18, 22, 4],
  [18, 23, 4],
  [19, 24, 4],
  [20, 25, 3],
  [21, 26, 3],
];

export const FRAME_WALK1: [number, number, number][] = [
  ...BODY_BASE,
  ...WALK1_LEGS,
];

export const FRAME_WALK2: [number, number, number][] = [
  ...BODY_BASE,
  ...WALK2_LEGS,
];

// ─────────────────────────── IDLE FRAMES ───────────────────────────
// Idle uses same body. Legs are symmetric and planted.
// IDLE2 has tail tip moved 2px right to show micro-wag.

const IDLE_LEGS: [number, number, number][] = [
  // Symmetric standing legs
  [4, 21, 4],
  [14, 21, 4],
  [23, 21, 4],
  [4, 22, 4],
  [15, 22, 3],
  [24, 22, 4],
  [4, 23, 4],
  [24, 23, 4],
  [4, 24, 4],
  [24, 24, 4],
  [4, 25, 4],
  [24, 25, 4],
  [4, 26, 4],
  [24, 26, 4],
];

export const FRAME_IDLE1: [number, number, number][] = [
  ...BODY_BASE,
  ...IDLE_LEGS,
];

// IDLE2: tail tip shifts 2px right (ear pixel also moves)
export const FRAME_IDLE2: [number, number, number][] = [
  [1, 0, 2],
  [1, 1, 2],
  [2, 2, 2],
  [32, 2, 1],  // tail tip 2px right
  [2, 3, 3],
  [28, 3, 3],
  [3, 4, 3],
  [27, 4, 4],
  [4, 5, 3],
  [26, 5, 5],
  [4, 6, 3],
  [26, 6, 5],
  [5, 7, 3],
  [23, 7, 10],
  [5, 8, 6],
  [23, 8, 8],
  [32, 8, 3],
  [5, 9, 10],
  [22, 9, 9],
  [32, 9, 3],
  [4, 10, 13],
  [21, 10, 10],
  [32, 10, 3],
  [4, 11, 13],
  [21, 11, 10],
  [32, 11, 3],
  [4, 12, 14],
  [21, 12, 15],
  [4, 13, 22],
  [31, 13, 5],
  [4, 14, 32],
  [4, 15, 31],
  [4, 16, 31],
  [4, 17, 26],
  [4, 18, 23],
  [4, 19, 23],
  [5, 20, 23],
  ...IDLE_LEGS,
];

// ─────────────────────────── SITTING FRAME ───────────────────────────
export const FRAME_SITTING: [number, number, number][] = [
  ...BODY_BASE,
  // Sitting: front legs tucked under body, haunches folded out
  [4, 21, 16],
  [24, 21, 4],
  [3, 22, 16],
  [25, 22, 3],
  [2, 23, 17],
  [25, 23, 4],
  [1, 24, 18],
  [25, 24, 4],
  [0, 25, 20],
  [25, 25, 4],
  [0, 26, 20],
  [25, 26, 4],
];
