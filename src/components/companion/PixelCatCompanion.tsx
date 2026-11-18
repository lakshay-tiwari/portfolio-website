"use client";

import React, { useEffect, useRef } from "react";

/**
 * Pixel-Art Cat Companion ("oneko")
 *
 * Implements the authentic 10 ticks/second (100ms fixed timestep)
 * discrete pixel-art cat cursor follower matching classic oneko feel.
 */

export interface PixelCatProps {
  /** Movement speed in pixels per 100ms tick (default: 12) */
  speed?: number;
  /** Distance in pixels within which cat stops and idles (default: 36) */
  idleRadius?: number;
  /** Fixed timestep interval in milliseconds (default: 100ms = 10 ticks/sec) */
  tickRateMs?: number;
  /** Integer scale factor (1 = 32x32, 2 = 64x64). Must be integer for crisp pixels (default: 1) */
  scale?: 1 | 2 | 3;
  /** Path to sprite sheet (default: "/oneko.png") */
  spriteUrl?: string;
  /** Additional custom class */
  className?: string;
  /** Debug overlay toggle */
  debug?: boolean;
}

export type CatDirection = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export const SPEED = 12; // px per tick
export const IDLE_RADIUS = 36; // px (32-48px tune)
export const TICK_RATE_MS = 100; // ms (10 ticks/s)

/**
 * Standard 32x32 oneko sprite coordinates (col, row offsets from top-left)
 */
export const SPRITE_SETS: Record<string, [number, number][]> = {
  idle: [[-3, -3]],
  alert: [[-7, -3]],
  scratchSelf: [
    [-5, 0],
    [-6, 0],
    [-7, 0],
  ],
  scratchWallN: [
    [0, 0],
    [0, -1],
  ],
  scratchWallS: [
    [-7, -1],
    [-6, -2],
  ],
  scratchWallE: [
    [-2, -2],
    [-2, -3],
  ],
  scratchWallW: [
    [-4, 0],
    [-4, -1],
  ],
  tired: [[-3, -2]],
  sleeping: [
    [-2, 0],
    [-2, -1],
  ],
  N: [
    [-1, -2],
    [-1, -3],
  ],
  NE: [
    [0, -2],
    [0, -3],
  ],
  E: [
    [-3, 0],
    [-3, -1],
  ],
  SE: [
    [-5, -1],
    [-5, -2],
  ],
  S: [
    [-6, -3],
    [-7, -2],
  ],
  SW: [
    [-5, -3],
    [-6, -1],
  ],
  W: [
    [-4, -2],
    [-4, -3],
  ],
  NW: [
    [-1, 0],
    [-1, -1],
  ],
};

export function PixelCatCompanion({
  speed = SPEED,
  idleRadius = IDLE_RADIUS,
  tickRateMs = TICK_RATE_MS,
  scale = 1,
  spriteUrl = "/oneko.png",
  className = "",
  debug = false,
}: PixelCatProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const debugRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Accessibility: check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Cat state variables
    let nekoPosX = 64;
    let nekoPosY = 64;
    let mousePosX = nekoPosX;
    let mousePosY = nekoPosY;
    let hasInteracted = false;

    let frameCount = 0;
    let idleTime = 0;
    let idleAnimation: string | null = null;
    let idleAnimationFrame = 0;
    let currentDirection: string = "S";
    let isMoving = false;
    let lastDisplacement = 0;

    // Preload sprite sheet
    const imgPreload = new Image();
    imgPreload.src = spriteUrl;

    const el = containerRef.current;
    if (!el) return;

    // Configure element dimensions and sprite sheet background
    el.style.width = `${32 * scale}px`;
    el.style.height = `${32 * scale}px`;
    el.style.backgroundImage = `url("${spriteUrl}")`;
    el.style.backgroundSize = `${256 * scale}px ${128 * scale}px`;

    function setSprite(name: string, frame: number) {
      if (!el) return;
      const set = SPRITE_SETS[name] || SPRITE_SETS["idle"];
      const sprite = set[Math.abs(frame) % set.length];
      const bgX = sprite[0] * 32 * scale;
      const bgY = sprite[1] * 32 * scale;
      el.style.backgroundPosition = `${bgX}px ${bgY}px`;
      el.dataset.sprite = name;
      el.dataset.frame = String(frame % set.length);
    }

    function renderPosition() {
      if (!el) return;
      // Round to whole integer pixels for crisp retro display
      const roundX = Math.round(nekoPosX - 16 * scale);
      const roundY = Math.round(nekoPosY - 16 * scale);
      el.style.transform = `translate3d(${roundX}px, ${roundY}px, 0)`;
    }

    function resetIdleAnimation() {
      idleAnimation = null;
      idleAnimationFrame = 0;
    }

    function handleIdle() {
      isMoving = false;
      idleTime += 1;

      // Occasional fun idle animations when resting
      if (
        idleTime > 10 &&
        Math.floor(Math.random() * 200) === 0 &&
        idleAnimation === null
      ) {
        const available: string[] = ["sleeping", "scratchSelf"];
        if (nekoPosX < 32 * scale) available.push("scratchWallW");
        if (nekoPosY < 32 * scale) available.push("scratchWallN");
        if (nekoPosX > window.innerWidth - 32 * scale)
          available.push("scratchWallE");
        if (nekoPosY > window.innerHeight - 32 * scale)
          available.push("scratchWallS");
        idleAnimation = available[Math.floor(Math.random() * available.length)];
      }

      switch (idleAnimation) {
        case "sleeping":
          if (idleAnimationFrame < 8) {
            setSprite("tired", 0);
          } else {
            setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
          }
          if (idleAnimationFrame > 192) {
            resetIdleAnimation();
          }
          break;
        case "scratchWallN":
        case "scratchWallS":
        case "scratchWallE":
        case "scratchWallW":
        case "scratchSelf":
          setSprite(idleAnimation, idleAnimationFrame);
          if (idleAnimationFrame > 9) {
            resetIdleAnimation();
          }
          break;
        default:
          setSprite("idle", 0);
          return;
      }
      idleAnimationFrame += 1;
    }

    /**
     * Choose 8-direction using 0.5 threshold on normalized direction vector.
     * With 0.5 threshold:
     * - Pure directions (N, S, E, W) cover 60° wedges
     * - Diagonal directions (NE, NW, SE, SW) cover 30° wedges centered on 45°
     */
    function chooseDirection(nx: number, ny: number): string {
      const vertical = ny > 0.5 ? "S" : ny < -0.5 ? "N" : "";
      const horizontal = nx > 0.5 ? "E" : nx < -0.5 ? "W" : "";
      return vertical + horizontal || "S";
    }

    /**
     * Fixed-Timestep Tick (executed exactly 10x per second)
     */
    function tick() {
      // If prefers-reduced-motion, keep sitting and do not chase
      if (prefersReducedMotion) {
        setSprite("idle", 0);
        renderPosition();
        return;
      }

      // If user hasn't interacted yet, stay resting
      if (!hasInteracted) {
        setSprite("idle", 0);
        renderPosition();
        return;
      }

      frameCount += 1;

      const dx = mousePosX - nekoPosX;
      const dy = mousePosY - nekoPosY;
      const distance = Math.hypot(dx, dy);

      // Settle check within idle radius (32-48px)
      if (distance < idleRadius) {
        handleIdle();
        lastDisplacement = 0;
        renderPosition();
        updateDebug();
        return;
      }

      idleAnimation = null;
      idleAnimationFrame = 0;

      // Alert reaction countdown before beginning run
      if (idleTime > 1) {
        setSprite("alert", 0);
        idleTime = Math.min(idleTime, 7);
        idleTime -= 1;
        lastDisplacement = 0;
        renderPosition();
        updateDebug();
        return;
      }

      isMoving = true;

      // ── True Vector Normalization ──────────────────────────────────────────
      // Both axes share identical normalized component scaling:
      // nx = dx / distance, ny = dy / distance.
      // Diagonal speed strictly equals axis speed (no speed penalty/boost).
      const nx = distance > 0 ? dx / distance : 0;
      const ny = distance > 0 ? dy / distance : 0;

      // 8-direction sprite selection
      currentDirection = chooseDirection(nx, ny);
      setSprite(currentDirection, frameCount);

      // Displacement with overshoot protection (if distance < speed, move only distance)
      const moveDist = Math.min(speed, distance);
      const stepX = nx * moveDist;
      const stepY = ny * moveDist;

      nekoPosX += stepX;
      nekoPosY += stepY;
      lastDisplacement = Math.hypot(stepX, stepY);

      // Viewport boundary clamping (sprite size aware)
      const minX = 16 * scale;
      const maxX = window.innerWidth - 16 * scale;
      const minY = 16 * scale;
      const maxY = window.innerHeight - 16 * scale;

      nekoPosX = Math.max(minX, Math.min(maxX, nekoPosX));
      nekoPosY = Math.max(minY, Math.min(maxY, nekoPosY));

      renderPosition();
      updateDebug();
    }

    function updateDebug() {
      if (debug && debugRef.current) {
        debugRef.current.innerText = `Pos: (${Math.round(nekoPosX)}, ${Math.round(
          nekoPosY
        )}) | Dir: ${currentDirection} | Step: ${lastDisplacement.toFixed(
          2
        )}px | Frame: ${frameCount % 2}`;
      }
    }

    // ── Input Listeners ──────────────────────────────────────────────────────
    const handleMouseMove = (e: MouseEvent) => {
      mousePosX = e.clientX;
      mousePosY = e.clientY;
      hasInteracted = true;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePosX = e.touches[0].clientX;
        mousePosY = e.touches[0].clientY;
        hasInteracted = true;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchMove, { passive: true });

    // ── Core Loop: Fixed-Timestep Accumulator on RAF ──────────────────────────
    // Guarantees EXACTLY 10 ticks/second on 60Hz, 120Hz, and 144Hz monitors.
    let rafId: number;
    let lastTime = performance.now();
    let accumulator = 0;

    const loop = (now: number) => {
      // Pause completely when tab is hidden
      if (document.hidden) {
        lastTime = now;
        rafId = requestAnimationFrame(loop);
        return;
      }

      const elapsed = Math.min(now - lastTime, 1000); // cap to 1s to prevent spiral of death
      lastTime = now;
      accumulator += elapsed;

      while (accumulator >= tickRateMs) {
        tick();
        accumulator -= tickRateMs;
      }

      rafId = requestAnimationFrame(loop);
    };

    // Initial positioning & sprite
    setSprite("idle", 0);
    renderPosition();
    rafId = requestAnimationFrame(loop);

    // Global diagnostic / testing hook for browser automation
    (window as unknown as Record<string, unknown>).__oneko = {
      getState: () => ({
        x: Math.round(nekoPosX),
        y: Math.round(nekoPosY),
        subX: nekoPosX,
        subY: nekoPosY,
        direction: currentDirection,
        isMoving,
        lastDisplacement,
        frameCount,
        idleTime,
        idleAnimation,
      }),
      teleport: (x: number, y: number) => {
        nekoPosX = x;
        nekoPosY = y;
        idleTime = 0;
        idleAnimation = null;
        renderPosition();
      },
      setMouse: (x: number, y: number) => {
        mousePosX = x;
        mousePosY = y;
        hasInteracted = true;
      },
      tickOnce: () => {
        tick();
      },
      runTestDirection: (angleDeg: number, dist = 400) => {
        const rad = (angleDeg * Math.PI) / 180;
        mousePosX = nekoPosX + Math.cos(rad) * dist;
        mousePosY = nekoPosY + Math.sin(rad) * dist;
        hasInteracted = true;
        idleTime = 0;
        tick();
        return {
          stepDisplacement: lastDisplacement,
          direction: currentDirection,
        };
      },
    };

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchMove);
      delete (window as unknown as Record<string, unknown>).__oneko;
    };
  }, [speed, idleRadius, tickRateMs, scale, spriteUrl, debug]);

  return (
    <>
      <style>{`
        #oneko-cat {
          position: fixed;
          pointer-events: none;
          top: 0;
          left: 0;
          z-index: 9999;
          will-change: transform;
          background-repeat: no-repeat;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          image-rendering: pixelated;
        }
      `}</style>
      <div
        ref={containerRef}
        id="oneko-cat"
        className={`oneko-companion select-none pointer-events-none ${className}`}
        aria-hidden="true"
        data-testid="oneko-cat"
      />
      {debug && (
        <div
          ref={debugRef}
          className="fixed bottom-2 right-2 bg-black/80 text-white font-mono text-xs px-2 py-1 rounded z-[10000] pointer-events-none"
        >
          Loading oneko debug...
        </div>
      )}
    </>
  );
}
