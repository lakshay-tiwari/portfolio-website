"use client";

import { useRef, useState, useCallback } from "react";
import {
  DEFAULT_DOG_CONFIG,
  DogAnimationState,
  DogDirection,
  DogIdleGesture,
  DogMotionConfig,
} from "./dogMotionConfig";
import { useCursorTracking } from "./useCursorTracking";
import { useDogMotion } from "./useDogMotion";
import { DogCharacter } from "./DogCharacter";
import { PawTrail, PawTrailHandle } from "./PawTrail";
import { useDogPersonality } from "./useDogPersonality";

export interface DogCursorCompanionProps {
  /** Optional custom motion & physics configuration */
  config?: Partial<DogMotionConfig>;
  /**
   * Optional custom character renderer.
   * Allows swapping the dog asset (e.g. Shiba Inu, custom sprites, Lottie, etc.)
   * while completely preserving the core movement engine and personality triggers.
   */
  renderCharacter?: (props: {
    state: DogAnimationState;
    isTurning: boolean;
    gesture?: DogIdleGesture;
    isExcited?: boolean;
    size: number;
  }) => React.ReactNode;
}

/**
 * DogCursorCompanion
 * 
 * Phase 3: Personality, Expressive Micro-Interactions & Ambient Companion Engine.
 * 
 * Features:
 * - Damped spring physics movement engine (Phase 1)
 * - Vector Corgi skeletal character with trot/gallop locomotion cycles (Phase 2)
 * - Ambient subtle breathing during idle & sitting poses
 * - Randomized eye blinking with natural intervals and occasional double-blinks
 * - Responsive ear dynamics: aerodynamic flutter while sprinting, tuck on turn, perk on excitement
 * - Intelligent randomized idle behavior controller (curious head tilt, look around, sniffing, happy panting)
 * - Post-chase sprint excitement upon reaching cursor
 * - Global click interaction (joyful hop & rapid tail wag) that never blocks page links/buttons
 * - Subtle, fading paw-print trail with running dust particles (zero-garbage pre-allocated DOM pool)
 * - Occasional, non-intrusive floating speech dialogue ("Woof! 🐾", "Hey there! ✨", "Follow me! 🚀")
 * - Welcoming greeting on first user interaction
 * - Strict animation priority system: Locomotion > Turning > Excitement/Click > Idle Gestures > Breathing/Blinking
 */
export function DogCursorCompanion({
  config: userConfig,
  renderCharacter,
}: DogCursorCompanionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pawTrailRef = useRef<PawTrailHandle>(null);

  const [animState, setAnimState] = useState<DogAnimationState>("idle");
  const [isTurning, setIsTurning] = useState(false);
  const [direction, setDirection] = useState<DogDirection>("down");

  // Merge custom config with defaults
  const config = useRef<DogMotionConfig>({
    ...DEFAULT_DOG_CONFIG,
    ...userConfig,
    size: { ...DEFAULT_DOG_CONFIG.size, ...userConfig?.size },
    initialPosition: { ...DEFAULT_DOG_CONFIG.initialPosition, ...userConfig?.initialPosition },
    cursorOffset: { ...DEFAULT_DOG_CONFIG.cursorOffset, ...userConfig?.cursorOffset },
    boundaryPadding: { ...DEFAULT_DOG_CONFIG.boundaryPadding, ...userConfig?.boundaryPadding },
    physics: { ...DEFAULT_DOG_CONFIG.physics, ...userConfig?.physics },
    direction: { ...DEFAULT_DOG_CONFIG.direction, ...userConfig?.direction },
    orientation: { ...DEFAULT_DOG_CONFIG.orientation, ...userConfig?.orientation },
    animation: { ...DEFAULT_DOG_CONFIG.animation, ...userConfig?.animation },
    personality: { ...DEFAULT_DOG_CONFIG.personality, ...userConfig?.personality },
  }).current;

  // Track cursor position and compute intelligent boundary targets
  const trackingRef = useCursorTracking(config);

  // Paw-print trail deposit callback (invoked from personality step)
  const handleDepositPaw = useCallback(
    (x: number, y: number, angleDeg: number, isRunning: boolean) => {
      pawTrailRef.current?.depositPaw(x, y, angleDeg, isRunning);
    },
    []
  );

  // Personality & micro-interaction controller
  const { onMotionStep } = useDogPersonality(
    containerRef,
    config,
    handleDepositPaw
  );

  // Callback triggered on discrete locomotion state changes
  const handleStateChange = useCallback(
    (nextState: DogAnimationState, turning: boolean, nextDirection?: DogDirection) => {
      setAnimState(nextState);
      setIsTurning(turning);
      if (nextDirection) setDirection(nextDirection);
    },
    []
  );

  // Run the physics engine on RAF, applying direct transforms and feeding motion steps
  useDogMotion(
    containerRef,
    trackingRef,
    config,
    handleStateChange,
    onMotionStep
  );

  return (
    <>
      {/* Subtle Paw-Print & Dust Particle Trail Overlay */}
      {config.personality.enablePawTrail && (
        <PawTrail
          ref={pawTrailRef}
          maxPaws={config.personality.maxPawPrints}
          maxDust={config.personality.enableDustParticles ? 5 : 0}
        />
      )}

      {/* Main Dog Companion Container (Hardware-Accelerated Translation) */}
      <div
        ref={containerRef}
        className="fixed top-0 left-0 pointer-events-none select-none z-[9999] will-change-transform hidden sm:block"
        style={{
          width: config.size.width,
          height: config.size.height,
        }}
        data-state={animState}
        data-direction={direction}
        data-turning={isTurning ? "true" : "false"}
        data-gesture="none"
        data-excited="false"
        data-click-react="false"
        aria-hidden="true"
      >
        {/* Character Visuals */}
        {renderCharacter ? (
          renderCharacter({
            state: animState,
            isTurning,
            size: config.size.width,
          })
        ) : (
          <DogCharacter
            state={animState}
            direction={direction}
            isTurning={isTurning}
            width={config.size.width}
            height={config.size.height}
          />
        )}
      </div>
    </>
  );
}
