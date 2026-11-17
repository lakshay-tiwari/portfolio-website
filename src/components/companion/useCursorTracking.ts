"use client";

import { useEffect, useRef } from "react";
import { DogMotionConfig } from "./dogMotionConfig";

export interface CursorTrackingState {
  /** Target X coordinate for the dog companion in viewport space */
  targetX: number;
  /** Target Y coordinate for the dog companion in viewport space */
  targetY: number;
  /** Whether mouse is currently inside the active viewport */
  isMouseInside: boolean;
  /** Whether the dog is currently positioned to the left of the cursor due to right boundary */
  isFlippedToLeft: boolean;
  /** Whether browser tab is currently active and visible */
  isTabVisible: boolean;
  /** Whether user has requested prefers-reduced-motion in OS settings */
  isReducedMotion: boolean;
  /** Whether the current device viewport and input capabilities support companion */
  isDeviceSupported: boolean;
  /** Raw mouse coordinates */
  mouseX: number;
  mouseY: number;
}

/**
 * useCursorTracking
 * 
 * Phase 4 Production Optimization:
 * - High-frequency pointer tracking with zero React re-renders (stored in mutable ref)
 * - Intelligent boundary collision margins and right-edge hysteresis
 * - Responsive screen breakpoint detection (disables on mobile < 640px)
 * - Accessibility: prefers-reduced-motion listener
 * - Browser lifecycle: window blur/focus, tab visibilitychange, and scroll-stability
 * - Complete event listener teardown
 */
export function useCursorTracking(config: DogMotionConfig) {
  const trackingRef = useRef<CursorTrackingState>({
    targetX: config.initialPosition.x,
    targetY: config.initialPosition.y,
    isMouseInside: false,
    isFlippedToLeft: false,
    isTabVisible: true,
    isReducedMotion: false,
    isDeviceSupported: true,
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

    const checkReducedMotion = () =>
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const checkDeviceSupported = () => {
      // Companion is enabled on screens >= 640px (desktop, laptop, tablet with pointer)
      return window.innerWidth >= 640;
    };

    // Initialize environment flags
    trackingRef.current.isReducedMotion = checkReducedMotion();
    trackingRef.current.isDeviceSupported = checkDeviceSupported();

    // Media query listener for real-time accessibility preference changes
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      trackingRef.current.isReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener?.("change", handleReducedMotionChange);

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
        targetX = mx - cursorOffset.gapX - size.width;
      } else {
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

    // Update viewport dimensions cache on resize
    const updateViewport = () => {
      viewportRef.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const supported = checkDeviceSupported();
      trackingRef.current.isDeviceSupported = supported;

      // If mouse is outside or device unsupported, ensure resting position
      if (!trackingRef.current.isMouseInside || !supported) {
        trackingRef.current.targetX = config.initialPosition.x;
        trackingRef.current.targetY = config.initialPosition.y;
      } else {
        recomputeTarget(trackingRef.current.mouseX, trackingRef.current.mouseY);
      }
    };

    const handlePointerMove = (e: PointerEvent | MouseEvent) => {
      // Discard touch events if on mobile or if device is not supported
      if (!trackingRef.current.isDeviceSupported) return;

      trackingRef.current.mouseX = e.clientX;
      trackingRef.current.mouseY = e.clientY;
      trackingRef.current.isMouseInside = true;

      recomputeTarget(e.clientX, e.clientY);
    };

    const handlePointerLeave = (e: MouseEvent) => {
      // Check if mouse genuinely left the browser viewport (e.g. moved out to browser chrome or another app)
      if (
        !e.relatedTarget &&
        (e.clientY <= 0 ||
          e.clientX <= 0 ||
          e.clientX >= window.innerWidth ||
          e.clientY >= window.innerHeight)
      ) {
        trackingRef.current.isMouseInside = false;
        // Smoothly send dog back to initial resting position
        trackingRef.current.targetX = config.initialPosition.x;
        trackingRef.current.targetY = config.initialPosition.y;
      }
    };

    const handlePointerEnter = (e: MouseEvent) => {
      if (!trackingRef.current.isDeviceSupported) return;
      trackingRef.current.isMouseInside = true;
      trackingRef.current.mouseX = e.clientX;
      trackingRef.current.mouseY = e.clientY;
      recomputeTarget(e.clientX, e.clientY);
    };

    const handleVisibilityChange = () => {
      trackingRef.current.isTabVisible = !document.hidden;
    };

    const handleWindowBlur = () => {
      // When window loses focus (e.g. Alt-Tab or clicking another app), gracefully return to rest
      trackingRef.current.isMouseInside = false;
      trackingRef.current.targetX = config.initialPosition.x;
      trackingRef.current.targetY = config.initialPosition.y;
    };

    const handleWindowFocus = () => {
      trackingRef.current.isTabVisible = !document.hidden;
      trackingRef.current.isReducedMotion = checkReducedMotion();
    };

    const handleScroll = () => {
      // Passive scroll check: re-verify target clamping if mouse is inside
      if (trackingRef.current.isMouseInside && trackingRef.current.isDeviceSupported) {
        recomputeTarget(trackingRef.current.mouseX, trackingRef.current.mouseY);
      }
    };

    // Attach passive listeners
    window.addEventListener("resize", updateViewport, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", handleWindowBlur, { passive: true });
    window.addEventListener("focus", handleWindowFocus, { passive: true });
    document.documentElement.addEventListener("mouseleave", handlePointerLeave, { passive: true });
    document.documentElement.addEventListener("mouseenter", handlePointerEnter, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });

    // Initial calculation
    updateViewport();

    return () => {
      reducedMotionQuery.removeEventListener?.("change", handleReducedMotionChange);
      window.removeEventListener("resize", updateViewport);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      document.documentElement.removeEventListener("mouseleave", handlePointerLeave);
      document.documentElement.removeEventListener("mouseenter", handlePointerEnter);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [config]);

  return trackingRef;
}
