"use client";

import { useEffect, useRef } from "react";
import {
  DogAnimationState,
  DogDirection,
  DogMotionConfig,
} from "./dogMotionConfig";
import { CursorTrackingState } from "./useCursorTracking";

export type { DogDirection } from "./dogMotionConfig";

export interface DogMotionState {
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  direction: DogDirection;
  facing: number; // +1 = right, -1 = left
  animationState: DogAnimationState;
  isTurning: boolean;
  speed: number;
}

export interface DogMotionStepCallbackParams {
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  speed: number;
  facing: number;
  direction?: DogDirection;
  state: DogAnimationState;
  isSettled: boolean;
}

/**
 * 8-Directional Angular Sectors centered at 45-degree intervals.
 * Browser coordinates: +X points Right, +Y points Down.
 */
export const DIRECTION_SECTORS: { dir: DogDirection; centerDeg: number }[] = [
  { dir: "right", centerDeg: 0 },
  { dir: "down-right", centerDeg: 45 },
  { dir: "down", centerDeg: 90 },
  { dir: "down-left", centerDeg: 135 },
  { dir: "left", centerDeg: 180 },
  { dir: "up-left", centerDeg: 225 },
  { dir: "up", centerDeg: 270 },
  { dir: "up-right", centerDeg: 315 },
];

/**
 * Computes shortest angular difference between two angles in [0, 360).
 */
export function getAngleDiff(a: number, b: number): number {
  const diff = ((a - b + 180) % 360) - 180;
  return Math.abs(diff < -180 ? diff + 360 : diff);
}

/**
 * Classifies velocity (vx, vy) into one of eight directional sectors with boundary hysteresis.
 */
export function classifyDirection(
  vx: number,
  vy: number,
  currentDir: DogDirection,
  hysteresisDeg = 3
): DogDirection {
  let angleDeg = (Math.atan2(vy, vx) * 180) / Math.PI;
  if (angleDeg < 0) angleDeg += 360;

  // 1. Maintain current sector if still within tolerance (22.5deg + hysteresis)
  const currentSector = DIRECTION_SECTORS.find((s) => s.dir === currentDir);
  if (currentSector) {
    const diff = getAngleDiff(angleDeg, currentSector.centerDeg);
    if (diff <= 22.5 + hysteresisDeg) {
      return currentDir;
    }
  }

  // 2. Otherwise snap to the closest sector
  let closestDir = currentDir;
  let minDiff = 999;
  for (const sector of DIRECTION_SECTORS) {
    const diff = getAngleDiff(angleDeg, sector.centerDeg);
    if (diff < minDiff) {
      minDiff = diff;
      closestDir = sector.dir;
    }
  }

  return closestDir;
}

/**
 * useDogMotion
 * 
 * Production Movement Engine:
 * - True Vector-Normalized Kinematic Movement with Smooth Arrival Deceleration
 * - Zero axis locking: X and Y displacements scale simultaneously and symmetrically
 * - Velocity-driven 8-directional classification with angular hysteresis
 * - Preserves last facing direction when stationary (no flickering or defaulting)
 * - Delta-time frame-rate independence (60Hz, 120Hz, 144Hz)
 * - Direct Hardware-Accelerated DOM translation without artificial CSS rotation
 */
export function useDogMotion(
  elementRef: React.RefObject<HTMLDivElement | null>,
  trackingRef: React.MutableRefObject<CursorTrackingState>,
  config: DogMotionConfig,
  onStateChange?: (
    state: DogAnimationState,
    isTurning: boolean,
    direction?: DogDirection
  ) => void,
  onMotionStep?: (motion: DogMotionStepCallbackParams) => void
) {
  const motionRef = useRef<DogMotionState>({
    currentX: config.initialPosition.x,
    currentY: config.initialPosition.y,
    vx: 0,
    vy: 0,
    direction: "down",
    facing: 1,
    animationState: "idle",
    isTurning: false,
    speed: 0,
  });

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentAnimState: DogAnimationState = "idle";
    let isCurrentlyTurning = false;
    let currentDirection: DogDirection = "down";
    let stationaryStartTime: number | null = performance.now();
    let turnStartTime: number | null = null;
    let wasSettled = false;

    const {
      physics: {
        maxSpeed = 280,
        maxAcceleration = 750,
        maxDeceleration = 950,
        decelRadius = 75,
        settleThreshold = 0.8,
      },
      animation: {
        walkSpeedThreshold,
        runSpeedThreshold,
        runExitThreshold,
        walkExitThreshold,
        sitDelayMs,
      },
      direction: { hysteresisDeg = 3 },
    } = config;

    const tick = (now: number) => {
      const tracking = trackingRef.current;

      // 1. Sleep check: inactive tab or unsupported device (e.g. mobile <640px)
      if (!tracking.isTabVisible || !tracking.isDeviceSupported) {
        lastTime = now;
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      // 2. Delta Time (dt in seconds, clamped between 1ms and 64ms for frame-rate independence)
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.max(0.001, Math.min(rawDt, 0.064));

      // 3. Viewport Boundaries
      const vpWidth = window.innerWidth;
      const vpHeight = window.innerHeight;
      const minX = config.boundaryPadding.left;
      const maxX = Math.max(minX, vpWidth - config.size.width - config.boundaryPadding.right);
      const minY = config.boundaryPadding.top;
      const maxY = Math.max(minY, vpHeight - config.size.height - config.boundaryPadding.bottom);

      const motion = motionRef.current;

      // 4. Destination Target Calculation
      let targetX: number;
      let targetY: number;

      if (!tracking.isMouseInside) {
        targetX = config.initialPosition.x;
        targetY = config.initialPosition.y;
      } else {
        // Dynamic horizontal spacing:
        // When cursor is predominantly above/below companion, reduce horizontal offset
        // so the companion travels straight along the vertical axis without an artificial horizontal jog.
        const dogCenterX = motion.currentX + config.size.width / 2;
        const dogCenterY = motion.currentY + config.size.height / 2;
        const relDx = Math.abs(tracking.mouseX - dogCenterX);
        const relDy = Math.abs(tracking.mouseY - dogCenterY);

        let horizontalWeight = 1.0;
        if (relDy > 35) {
          horizontalWeight = Math.min(1.0, Math.max(0.0, (relDx - 8) / 24));
        }

        if (tracking.isFlippedToLeft) {
          const leftOffset = config.cursorOffset.gapX * horizontalWeight + config.size.width;
          targetX = tracking.mouseX - leftOffset;
        } else {
          const rightOffset = config.cursorOffset.gapX * horizontalWeight;
          targetX = tracking.mouseX + rightOffset;
        }

        targetY = tracking.mouseY + config.cursorOffset.offsetY;
      }

      // Clamp target strictly within valid viewport bounds
      const effectiveTargetX = Math.max(minX, Math.min(maxX, targetX));
      const effectiveTargetY = Math.max(minY, Math.min(maxY, targetY));

      // Mirror effective target to tracking ref for external consumers
      tracking.targetX = effectiveTargetX;
      tracking.targetY = effectiveTargetY;

      // 5. True Vector-Normalized Kinematic Physics
      const dx = effectiveTargetX - motion.currentX;
      const dy = effectiveTargetY - motion.currentY;
      const distance = Math.hypot(dx, dy);
      const currentSpeed = Math.hypot(motion.vx, motion.vy);

      // Settle check: within settle threshold and velocity near zero
      const isSettled = distance <= settleThreshold && currentSpeed <= 1.0;

      if (isSettled) {
        motion.currentX = effectiveTargetX;
        motion.currentY = effectiveTargetY;
        motion.vx = 0;
        motion.vy = 0;
        // Direction is preserved!
      } else {
        // Normalized displacement vector
        const dirX = distance > 0 ? dx / distance : 0;
        const dirY = distance > 0 ? dy / distance : 0;

        // Kinematic Arrival Deceleration Curve
        const effectiveMaxSpeed = tracking.isReducedMotion ? maxSpeed * 0.55 : maxSpeed;
        const effectiveMaxAccel = tracking.isReducedMotion ? maxAcceleration * 0.5 : maxAcceleration;
        const effectiveMaxDecel = tracking.isReducedMotion
          ? maxDeceleration * 0.6
          : maxDeceleration;

        let desiredSpeed: number;
        if (distance >= decelRadius) {
          desiredSpeed = effectiveMaxSpeed;
        } else {
          // Smooth ease-out quadratic deceleration curve: v = v_max * sqrt(d / d_decel)
          const ratio = Math.max(0, distance / decelRadius);
          desiredSpeed = effectiveMaxSpeed * Math.sqrt(ratio);
        }

        // Target velocity vector aligned with normalized direction
        const targetVx = dirX * desiredSpeed;
        const targetVy = dirY * desiredSpeed;

        // Smooth velocity steering towards target velocity
        const diffVx = targetVx - motion.vx;
        const diffVy = targetVy - motion.vy;
        const diffSpeed = Math.hypot(diffVx, diffVy);

        const isBraking = desiredSpeed < currentSpeed;
        const maxDeltaV = (isBraking ? effectiveMaxDecel : effectiveMaxAccel) * dt;

        if (diffSpeed <= maxDeltaV) {
          motion.vx = targetVx;
          motion.vy = targetVy;
        } else {
          const steerScale = maxDeltaV / diffSpeed;
          motion.vx += diffVx * steerScale;
          motion.vy += diffVy * steerScale;
        }

        // Frame-rate independent Euler position update
        motion.currentX += motion.vx * dt;
        motion.currentY += motion.vy * dt;

        // Boundary collision clamping
        motion.currentX = Math.max(minX, Math.min(maxX, motion.currentX));
        motion.currentY = Math.max(minY, Math.min(maxY, motion.currentY));

        // 6. 8-Directional Movement Classification
        const stepSpeed = Math.hypot(motion.vx, motion.vy);
        if (stepSpeed > walkExitThreshold) {
          const nextDir = classifyDirection(
            motion.vx,
            motion.vy,
            motion.direction,
            hysteresisDeg
          );

          if (nextDir !== motion.direction) {
            const oldSector = DIRECTION_SECTORS.find(
              (s) => s.dir === motion.direction
            );
            const newSector = DIRECTION_SECTORS.find((s) => s.dir === nextDir);
            if (oldSector && newSector) {
              const turnAngle = getAngleDiff(
                oldSector.centerDeg,
                newSector.centerDeg
              );
              // Trigger turnaround dynamic crouch for sharp turns (>= 90 degrees)
              if (turnAngle >= 90) {
                turnStartTime = now;
              }
            }
            motion.direction = nextDir;
          }

          if (
            nextDir === "right" ||
            nextDir === "up-right" ||
            nextDir === "down-right"
          ) {
            motion.facing = 1;
          } else if (
            nextDir === "left" ||
            nextDir === "up-left" ||
            nextDir === "down-left"
          ) {
            motion.facing = -1;
          }
        }
      }

      // 7. Animation State Machine with Hysteresis
      const updatedSpeed = Math.hypot(motion.vx, motion.vy);
      const effectiveSpeed = isSettled ? 0 : updatedSpeed;
      motion.speed = effectiveSpeed;

      const isTurning =
        turnStartTime !== null &&
        now - turnStartTime < 120 &&
        !tracking.isReducedMotion;

      if (turnStartTime !== null && now - turnStartTime >= 120) {
        turnStartTime = null;
      }
      motion.isTurning = isTurning;

      let nextState = currentAnimState;

      if (isSettled) {
        // Stationary state machine
        if (currentAnimState === "sitting") {
          // Stay sitting while settled
          nextState = "sitting";
        } else if (currentAnimState !== "idle") {
          // Immediately enter idle upon settling and mark stationary start
          nextState = "idle";
          stationaryStartTime = now;
        } else {
          // In idle: transition to sitting once sitDelayMs expires
          if (stationaryStartTime === null) {
            stationaryStartTime = now;
          } else if (now - stationaryStartTime >= sitDelayMs) {
            nextState = "sitting";
          }
        }
      } else {
        // Active movement state machine with hysteresis
        stationaryStartTime = null;

        if (currentAnimState === "running") {
          if (effectiveSpeed < runExitThreshold) {
            nextState = "walking";
          }
        } else if (currentAnimState === "walking") {
          if (effectiveSpeed >= runSpeedThreshold) {
            nextState = "running";
          } else if (effectiveSpeed < walkExitThreshold) {
            nextState = "idle";
            stationaryStartTime = now;
          }
        } else {
          // Starting motion from idle or sitting
          if (effectiveSpeed >= runSpeedThreshold) {
            nextState = "running";
          } else if (effectiveSpeed >= walkSpeedThreshold) {
            nextState = "walking";
          }
        }
      }

      // If state, turning, or direction changed, update DOM data attributes
      const stateChanged = nextState !== currentAnimState;
      const turningChanged = isTurning !== isCurrentlyTurning;
      const dirChanged = motion.direction !== currentDirection;

      if (stateChanged || turningChanged || dirChanged) {
        currentAnimState = nextState;
        isCurrentlyTurning = isTurning;
        currentDirection = motion.direction;
        motion.animationState = nextState;

        if (elementRef.current) {
          elementRef.current.dataset.state = nextState;
          elementRef.current.dataset.turning = isTurning ? "true" : "false";
          elementRef.current.dataset.direction = motion.direction;

          const charRoot = elementRef.current.querySelector(
            ".corgi-character-root, .cat-character-root, .dog-character-root"
          ) as HTMLElement | null;
          if (charRoot) {
            charRoot.dataset.state = nextState;
            charRoot.dataset.turning = isTurning ? "true" : "false";
            charRoot.dataset.direction = motion.direction;
          }
        }

        onStateChange?.(nextState, isTurning, motion.direction);
      }

      // 8. Hardware-Accelerated DOM Translation Update (Pure 3D translate)
      if (elementRef.current && (!isSettled || !wasSettled)) {
        const x = motion.currentX.toFixed(2);
        const y = motion.currentY.toFixed(2);
        elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      wasSettled = isSettled;

      // 9. Motion Step Callback (Personality, Paw Trail, Chase Tracking)
      onMotionStep?.({
        currentX: motion.currentX,
        currentY: motion.currentY,
        vx: motion.vx,
        vy: motion.vy,
        speed: motion.speed,
        facing: motion.facing,
        direction: motion.direction,
        state: motion.animationState,
        isSettled,
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    // Initialize immediate initial placement
    if (elementRef.current) {
      const x = config.initialPosition.x;
      const y = config.initialPosition.y;
      elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      elementRef.current.dataset.state = "idle";
      elementRef.current.dataset.direction = "down";
      elementRef.current.dataset.turning = "false";
    }

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [elementRef, trackingRef, config, onStateChange, onMotionStep]);

  return motionRef;
}
