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
 * - Second-Order Damped Spring Physics via Semi-Implicit Euler integration
 * - Velocity-driven 8-directional classification with angular hysteresis
 * - Preserves last facing direction when stationary
 * - Turnaround transition detection for smooth directional changes
 * - Runs on requestAnimationFrame with zero per-frame React state updates
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

    let lastTargetX = trackingRef.current.targetX;
    let lastTargetY = trackingRef.current.targetY;
    let smoothTargetVx = 0;
    let smoothTargetVy = 0;
    let dynamicOffsetX = 0;
    let dynamicOffsetY = 0;

    const {
      physics: {
        stiffness,
        damping,
        maxSpeed,
        maxAcceleration = 420,
        mass,
        settleThreshold,
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

      // 2. Delta Time (dt in seconds, clamped between 1ms and 64ms)
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.max(0.001, Math.min(rawDt, 0.064));

      // Compute instantaneous movement velocity of cursor target
      const targetDx = tracking.targetX - lastTargetX;
      const targetDy = tracking.targetY - lastTargetY;
      lastTargetX = tracking.targetX;
      lastTargetY = tracking.targetY;

      const rawTargetVx = dt > 0 ? targetDx / dt : 0;
      const rawTargetVy = dt > 0 ? targetDy / dt : 0;

      // Smooth target velocity with exponential moving average to eliminate sensor jitter
      smoothTargetVx += (rawTargetVx - smoothTargetVx) * Math.min(1, dt * 10);
      smoothTargetVy += (rawTargetVy - smoothTargetVy) * Math.min(1, dt * 10);

      // Dynamic direction-aware trailing offset:
      let desiredOffsetY = 0;
      let desiredOffsetX = 0;

      if (!tracking.isReducedMotion && tracking.isMouseInside) {
        if (smoothTargetVy > 25) {
          const downLag = Math.min(36, (smoothTargetVy - 25) * 0.1);
          desiredOffsetY = -downLag;
        } else if (smoothTargetVy < -25) {
          const upLag = Math.min(20, (-smoothTargetVy - 25) * 0.08);
          desiredOffsetY = upLag;
        }

        if (smoothTargetVx > 35) {
          desiredOffsetX = -Math.min(28, (smoothTargetVx - 35) * 0.07);
        } else if (smoothTargetVx < -35) {
          desiredOffsetX = Math.min(28, (-smoothTargetVx - 35) * 0.07);
        }
      }

      // Smoothly interpolate active offsets towards desired
      dynamicOffsetY += (desiredOffsetY - dynamicOffsetY) * Math.min(1, dt * 7);
      dynamicOffsetX += (desiredOffsetX - dynamicOffsetX) * Math.min(1, dt * 7);

      // Viewport boundary clamping for effective target
      const vpWidth = window.innerWidth;
      const vpHeight = window.innerHeight;
      const minX = config.boundaryPadding.left;
      const maxX = vpWidth - config.size.width - config.boundaryPadding.right;
      const minY = config.boundaryPadding.top;
      const maxY = vpHeight - config.size.height - config.boundaryPadding.bottom;

      const effectiveTargetX = Math.max(
        minX,
        Math.min(maxX, tracking.targetX + dynamicOffsetX)
      );
      const effectiveTargetY = Math.max(
        minY,
        Math.min(maxY, tracking.targetY + dynamicOffsetY)
      );

      const motion = motionRef.current;
      const dx = effectiveTargetX - motion.currentX;
      const dy = effectiveTargetY - motion.currentY;
      const dist = Math.hypot(dx, dy);
      const speed = Math.hypot(motion.vx, motion.vy);

      // Settle check: within 0.25px and speed under 0.25px/s with offsets settled
      const isSettled =
        dist < settleThreshold &&
        speed < settleThreshold &&
        Math.abs(dynamicOffsetY) < 0.5 &&
        Math.abs(dynamicOffsetX) < 0.5;

      if (isSettled) {
        // Snap cleanly to rest and zero velocities (preserving last direction!)
        motion.currentX = tracking.targetX;
        motion.currentY = tracking.targetY;
        motion.vx = 0;
        motion.vy = 0;
        dynamicOffsetX = 0;
        dynamicOffsetY = 0;
      } else {
        // 3. Second-Order Damped Spring Physics with Acceleration Clamping
        const effectiveStiffness = tracking.isReducedMotion ? 18 : stiffness;
        const effectiveDamping = tracking.isReducedMotion
          ? 2 * Math.sqrt(18 * mass)
          : damping;

        const fx = effectiveStiffness * dx - effectiveDamping * motion.vx;
        const fy = effectiveStiffness * dy - effectiveDamping * motion.vy;

        // Semi-implicit Euler integration: v_{t+1} = v_t + a*dt
        let ax = fx / mass;
        let ay = fy / mass;

        // Acceleration Clamping: prevents violent launches so the dog ramps up gently
        const currentAccel = Math.hypot(ax, ay);
        const effectiveMaxAccel = tracking.isReducedMotion
          ? maxAcceleration * 0.6
          : maxAcceleration;
        if (currentAccel > effectiveMaxAccel) {
          const accelRatio = effectiveMaxAccel / currentAccel;
          ax *= accelRatio;
          ay *= accelRatio;
        }

        motion.vx += ax * dt;
        motion.vy += ay * dt;

        // Velocity Clamping to enforce max speed ceiling
        const stepSpeed = Math.hypot(motion.vx, motion.vy);
        const effectiveMaxSpeed = tracking.isReducedMotion
          ? maxSpeed * 0.7
          : maxSpeed;
        if (stepSpeed > effectiveMaxSpeed) {
          const ratio = effectiveMaxSpeed / stepSpeed;
          motion.vx *= ratio;
          motion.vy *= ratio;
        }

        // Position integration: x_{t+1} = x_t + v_{t+1}*dt
        motion.currentX += motion.vx * dt;
        motion.currentY += motion.vy * dt;

        // 4. 8-Directional Movement Classification with Hysteresis
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
              // Trigger turnaround animation for sharp turns (>= 90 degrees)
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

      // 5. Animation State Machine with Hysteresis
      const currentSpeed = isSettled ? 0 : speed;
      motion.speed = currentSpeed;

      const isTurning =
        turnStartTime !== null &&
        now - turnStartTime < 240 &&
        !tracking.isReducedMotion;

      if (turnStartTime !== null && now - turnStartTime >= 240) {
        turnStartTime = null;
      }
      motion.isTurning = isTurning;

      let nextState = currentAnimState;

      if (currentAnimState === "running") {
        if (currentSpeed < runExitThreshold) {
          nextState = "walking";
        }
      } else if (currentAnimState === "walking") {
        if (currentSpeed >= runSpeedThreshold) {
          nextState = "running";
        } else if (currentSpeed < walkExitThreshold) {
          nextState = "idle";
          stationaryStartTime = now;
        }
      } else if (currentAnimState === "idle") {
        if (currentSpeed >= runSpeedThreshold) {
          nextState = "running";
        } else if (currentSpeed >= walkSpeedThreshold) {
          nextState = "walking";
        } else {
          // Stationary counting towards sitting pose
          if (stationaryStartTime === null) {
            stationaryStartTime = now;
          } else if (now - stationaryStartTime >= sitDelayMs) {
            nextState = "sitting";
          }
        }
      } else if (currentAnimState === "sitting") {
        if (currentSpeed >= runSpeedThreshold) {
          nextState = "running";
          stationaryStartTime = null;
        } else if (currentSpeed >= walkSpeedThreshold) {
          nextState = "walking";
          stationaryStartTime = null;
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

      // 6. Hardware-Accelerated DOM Translation Update (Pure 3D translate, no artificial tilt)
      if (elementRef.current && (!isSettled || !wasSettled)) {
        const x = motion.currentX.toFixed(2);
        const y = motion.currentY.toFixed(2);
        elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }

      wasSettled = isSettled;

      // 7. Motion Step Callback (Personality, Paw Trail, Chase Tracking)
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
