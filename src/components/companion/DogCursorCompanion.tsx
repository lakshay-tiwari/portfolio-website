"use client";

import { useRef } from "react";
import { DEFAULT_DOG_CONFIG, DogMotionConfig } from "./dogMotionConfig";
import { useCursorTracking } from "./useCursorTracking";
import { useDogMotion } from "./useDogMotion";
import { DogPlaceholder } from "./DogPlaceholder";

interface DogCursorCompanionProps {
  config?: Partial<DogMotionConfig>;
}

/**
 * DogCursorCompanion
 * 
 * Phase 1: Core Physics-Based Cursor-Following Movement Engine.
 * 
 * Renders a small (60px) companion that:
 * - Starts at rest in the top-left corner.
 * - Smoothly follows the cursor with natural spring acceleration, damping, and deceleration.
 * - Settles just to the right of the cursor with configurable gap.
 * - Intelligently flips to the left near the right viewport boundary (with hysteresis).
 * - Smoothly flips facing direction and banks into turns.
 * - Gracefully returns to its top-left resting spot when the mouse leaves the browser.
 * - Never teleports, jitters, or oscillates.
 * - Executes in requestAnimationFrame via React refs with 0 React re-renders.
 */
export function DogCursorCompanion({ config: userConfig }: DogCursorCompanionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Merge custom config with defaults
  const config = useRef<DogMotionConfig>({
    ...DEFAULT_DOG_CONFIG,
    ...userConfig,
    size: { ...DEFAULT_DOG_CONFIG.size, ...userConfig?.size },
    initialPosition: { ...DEFAULT_DOG_CONFIG.initialPosition, ...userConfig?.initialPosition },
    cursorOffset: { ...DEFAULT_DOG_CONFIG.cursorOffset, ...userConfig?.cursorOffset },
    boundaryPadding: { ...DEFAULT_DOG_CONFIG.boundaryPadding, ...userConfig?.boundaryPadding },
    physics: { ...DEFAULT_DOG_CONFIG.physics, ...userConfig?.physics },
    orientation: { ...DEFAULT_DOG_CONFIG.orientation, ...userConfig?.orientation },
  }).current;

  // Track cursor position and compute intelligent boundary targets (no re-renders)
  const trackingRef = useCursorTracking(config);

  // Run the physics engine on RAF and apply direct transform updates
  useDogMotion(containerRef, trackingRef, config);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 pointer-events-none select-none z-[9999] will-change-transform hidden sm:block"
      style={{
        width: config.size.width,
        height: config.size.height,
        transformOrigin: "center center",
      }}
      aria-hidden="true"
    >
      <DogPlaceholder size={config.size.width} />
    </div>
  );
}

