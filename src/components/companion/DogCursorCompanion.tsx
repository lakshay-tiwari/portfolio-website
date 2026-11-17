"use client";

import { useRef, useState, useCallback } from "react";
import { DEFAULT_DOG_CONFIG, DogAnimationState, DogMotionConfig } from "./dogMotionConfig";
import { useCursorTracking } from "./useCursorTracking";
import { useDogMotion } from "./useDogMotion";
import { DogCharacter } from "./DogCharacter";

export interface DogCursorCompanionProps {
  /** Optional custom motion & physics configuration */
  config?: Partial<DogMotionConfig>;
  /**
   * Optional custom character renderer.
   * Allows swapping the dog asset (e.g. Shiba Inu, custom sprites, Lottie, etc.)
   * while completely preserving the core movement engine.
   */
  renderCharacter?: (props: {
    state: DogAnimationState;
    isTurning: boolean;
    size: number;
  }) => React.ReactNode;
}

/**
 * DogCursorCompanion
 * 
 * Phase 2: Natural Dog Character & Locomotion Animation Engine.
 * 
 * Enhances Phase 1 movement with:
 * - Premium vector Corgi character with transparent background
 * - Idle state with natural breathing, tail sway, and periodic eye blinking
 * - Trot walking state with antiphase leg cycles and head bob
 * - Running state with rapid gallop strides, fast tail wag, and squash-and-stretch
 * - Seated state with front paws tall and rear legs tucked after resting
 * - Turning state with continuous banking lean and orientation flip
 * - Complete transform separation: outer physics transforms vs. inner character skeletal keyframes
 */
export function DogCursorCompanion({
  config: userConfig,
  renderCharacter,
}: DogCursorCompanionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [animState, setAnimState] = useState<DogAnimationState>("idle");
  const [isTurning, setIsTurning] = useState(false);

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
    animation: { ...DEFAULT_DOG_CONFIG.animation, ...userConfig?.animation },
  }).current;

  // Track cursor position and compute intelligent boundary targets
  const trackingRef = useCursorTracking(config);

  // Callback triggered only on discrete state transitions (idle, walking, running, sitting, turning)
  const handleStateChange = useCallback(
    (nextState: DogAnimationState, turning: boolean) => {
      setAnimState(nextState);
      setIsTurning(turning);
    },
    []
  );

  // Run the physics engine on RAF and apply direct transform updates
  useDogMotion(containerRef, trackingRef, config, handleStateChange);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-0 pointer-events-none select-none z-[9999] will-change-transform hidden sm:block"
      style={{
        width: config.size.width,
        height: config.size.height,
        transformOrigin: "center center",
      }}
      data-state={animState}
      data-turning={isTurning ? "true" : "false"}
      aria-hidden="true"
    >
      {renderCharacter ? (
        renderCharacter({ state: animState, isTurning, size: config.size.width })
      ) : (
        <DogCharacter
          state={animState}
          isTurning={isTurning}
          size={config.size.width}
        />
      )}
    </div>
  );
}
