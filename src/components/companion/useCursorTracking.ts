"use client";

import { useEffect, useRef } from "react";
import { DogMotionConfig } from "./dogMotionConfig";

export interface CursorTrackingState {
  /** Target X coordinate for the dog companion */
  targetX: number;
  /** Target Y coordinate for the dog companion */
  targetY: number;
  /** Whether mouse is currently inside the active viewport */
  isMouseInside: boolean;
  /** Whether the dog is currently positioned to the left of the cursor due to right boundary */
  isFlippedToLeft: boolean;
  /** Whether tab is visible */
  isTabVisible: boolean;
  /** Raw mouse coordinates */
  mouseX: number;
  mouseY: number;
}

/**
 * Tracks mouse position and intelligently calculates the target position for the dog companion,
 * incorporating boundary margins, right-edge side switching with hysteresis, and viewport leave/enter.
 * 
 * Uses refs to store values so that high-frequency mouse movements do NOT trigger React re-renders.
 */
export function useCursorTracking(config: DogMotionConfig) {
  const trackingRef = useRef<CursorTrackingState>({
    targetX: config.initialPosition.x,
    targetY: config.initialPosition.y,
    isMouseInside: false,
    isFlippedToLeft: false,
    isTabVisible: true,
    mouseX: config.initialPosition.x,
    mouseY: config.initialPosition.y,
  });

  // Cached viewport dimensions
  const viewportRef = useRef({
    width: typeof window !== "undefined" ? window.innerWidth : 1200,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Update viewport dimensions cache
    const updateViewport = () => {
      viewportRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // If mouse is outside, ensure initial position respects boundaries
      if (!trackingRef.current.isMouseInside) {
        trackingRef.current.targetX = config.initialPosition.x;
        trackingRef.current.targetY = config.initialPosition.y;
      } else {
        // Re-calculate target position based on last known mouse coordinates
        recomputeTarget(trackingRef.current.mouseX, trackingRef.current.mouseY);
      }
    };

    /**
     * Intelligently computes the target position (X, Y) for the dog relative to mouse (mx, my),
     * respecting viewport boundaries and side-flipping hysteresis.
     */
    const recomputeTarget = (mx: number, my: number) => {
      const vp = viewportRef.current;
      const { size, cursorOffset, boundaryPadding, boundaryHysteresis } = config;

      // 1. Determine horizontal side (right vs left of cursor)
      const rightThreshold = vp.width - (cursorOffset.gapX + size.width + boundaryPadding.right);
      const isCurrentlyLeft = trackingRef.current.isFlippedToLeft;

      let flipToLeft = isCurrentlyLeft;

      if (!isCurrentlyLeft) {
        // Currently on right side: switch to left only if cursor crosses rightThreshold
        if (mx > rightThreshold) {
          flipToLeft = true;
        }
      } else {
        // Currently on left side: switch back to right only if cursor moves away with hysteresis buffer
        if (mx < rightThreshold - boundaryHysteresis) {
          flipToLeft = false;
        }
      }

      trackingRef.current.isFlippedToLeft = flipToLeft;

      // 2. Compute candidate target X
      let targetX: number;
      if (flipToLeft) {
        // Place dog to the left of the cursor
        targetX = mx - cursorOffset.gapX - size.width;
      } else {
        // Normal placement: to the right of the cursor
        targetX = mx + cursorOffset.gapX;
      }

      // Clamp X strictly within viewport boundaries
      const minX = boundaryPadding.left;
      const maxX = vp.width - size.width - boundaryPadding.right;
      targetX = Math.max(minX, Math.min(maxX, targetX));

      // 3. Compute candidate target Y (vertically centered/offset with cursor)
      let targetY = my + cursorOffset.offsetY;

      // Clamp Y strictly within viewport boundaries
      const minY = boundaryPadding.top;
      const maxY = vp.height - size.height - boundaryPadding.bottom;
      targetY = Math.max(minY, Math.min(maxY, targetY));

      trackingRef.current.targetX = targetX;
      trackingRef.current.targetY = targetY;
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      trackingRef.current.mouseX = e.clientX;
      trackingRef.current.mouseY = e.clientY;
      trackingRef.current.isMouseInside = true;

      recomputeTarget(e.clientX, e.clientY);
    };

    const handlePointerLeave = (e: MouseEvent) => {
      // Check if mouse genuinely left the browser viewport
      if (!e.relatedTarget && (e.clientY <= 0 || e.clientX <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight)) {
        trackingRef.current.isMouseInside = false;
        // Smoothly send dog back to initial top-left rest position
        trackingRef.current.targetX = config.initialPosition.x;
        trackingRef.current.targetY = config.initialPosition.y;
      }
    };

    const handlePointerEnter = (e: MouseEvent) => {
      trackingRef.current.isMouseInside = true;
      trackingRef.current.mouseX = e.clientX;
      trackingRef.current.mouseY = e.clientY;
      recomputeTarget(e.clientX, e.clientY);
    };

    const handleVisibilityChange = () => {
      trackingRef.current.isTabVisible = !document.hidden;
    };

    // Attach listeners
    window.addEventListener("resize", updateViewport, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    document.documentElement.addEventListener("mouseenter", handlePointerEnter, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });

    // Initial calculation
    updateViewport();

    return () => {
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      document.documentElement.removeEventListener("mouseenter", handlePointerEnter);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [config]);

  return trackingRef;
}

