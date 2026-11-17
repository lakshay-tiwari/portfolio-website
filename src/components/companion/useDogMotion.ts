"use client";

import { useEffect, useRef } from "react";
import { DogAnimationState, DogMotionConfig } from "./dogMotionConfig";
import { CursorTrackingState } from "./useCursorTracking";

export interface DogMotionState {
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  facing: number; // +1 = right, -1 = left
  facingScale: number; // smoothly lerped between -1 and +1
  tilt: number; // banking tilt in degrees
  animationState: DogAnimationState;
  isTurning: boolean;
  speed: number;
}

/**
 * Runs a high-performance spring physics simulation loop on requestAnimationFrame,
 * applying position, smooth directional flip, and tilt directly to the DOM element
 * via transform: translate3d(...) with zero React state updates.
 * 
 * Also drives the animation state machine (idle, walking, running, sitting, turning)
 * with velocity hysteresis and stationary sitting timers.
 */
export function useDogMotion(
  elementRef: React.RefObject<HTMLDivElement | null>,
  trackingRef: React.MutableRefObject<CursorTrackingState>,
  config: DogMotionConfig,
  onStateChange?: (state: DogAnimationState, isTurning: boolean) => void,
  onMotionStep?: (motion: {
    currentX: number;
    currentY: number;
    vx: number;
    vy: number;
    speed: number;
    facing: number;
    state: DogAnimationState;
    isSettled: boolean;
  }) => void
) {
  const motionRef = useRef<DogMotionState>({
    currentX: config.initialPosition.x,
    currentY: config.initialPosition.y,
    vx: 0,
    vy: 0,
    facing: 1,
    facingScale: 1,
    tilt: 0,
    animationState: "idle",
    isTurning: false,
    speed: 0,
  });

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();
    let currentAnimState: DogAnimationState = "idle";
    let isCurrentlyTurning = false;
    let stationaryStartTime: number | null = performance.now();

    const {
      physics: { stiffness, damping, maxSpeed, mass, settleThreshold },
      orientation: {
        flipVelocityThreshold,
        flipLerpSpeed,
        maxTiltDeg,
        tiltFactor,
        tiltSettleSpeed,
      },
      animation: {
        walkSpeedThreshold,
        runSpeedThreshold,
        runExitThreshold,
        walkExitThreshold,
        sitDelayMs,
        turnFacingThreshold,
      },
    } = config;

    const tick = (now: number) => {
      // 1. Check tab visibility
      if (!trackingRef.current.isTabVisible) {
        lastTime = now;
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      // 2. Compute delta time (clamped between 1ms and 64ms for stability)
      const rawDt = (now - lastTime) / 1000;
      lastTime = now;
      const dt = Math.max(0.001, Math.min(rawDt, 0.064));

      const motion = motionRef.current;
      const target = trackingRef.current;

      const dx = target.targetX - motion.currentX;
      const dy = target.targetY - motion.currentY;
      const dist = Math.hypot(dx, dy);
      const speed = Math.hypot(motion.vx, motion.vy);

      // Check if settled at target
      const isSettled = dist < settleThreshold && speed < settleThreshold;

      if (isSettled) {
        // Snap cleanly to rest and zero velocities
        motion.currentX = target.targetX;
        motion.currentY = target.targetY;
        motion.vx = 0;
        motion.vy = 0;
        motion.tilt = 0;
      } else {
        // 3. Second-Order Damped Spring Physics (Semi-Implicit Euler)
        const fx = stiffness * dx - damping * motion.vx;
        const fy = stiffness * dy - damping * motion.vy;

        const ax = fx / mass;
        const ay = fy / mass;

        motion.vx += ax * dt;
        motion.vy += ay * dt;

        // Speed clamping
        const currentSpeed = Math.hypot(motion.vx, motion.vy);
        if (currentSpeed > maxSpeed) {
          const ratio = maxSpeed / currentSpeed;
          motion.vx *= ratio;
          motion.vy *= ratio;
        }

        // Position integration
        motion.currentX += motion.vx * dt;
        motion.currentY += motion.vy * dt;

        // 4. Direction & Facing Flip (with velocity deadband to avoid twitching)
        if (motion.vx > flipVelocityThreshold) {
          motion.facing = 1; // Facing right
        } else if (motion.vx < -flipVelocityThreshold) {
          motion.facing = -1; // Facing left
        }

        // Smoothly lerp facingScale for organic turns
        motion.facingScale +=
          (motion.facing - motion.facingScale) * Math.min(1, dt * flipLerpSpeed);

        // 5. Dynamic Banking Tilt (tilt in movement direction, clamp to maxTiltDeg)
        const targetTilt = Math.max(
          -maxTiltDeg,
          Math.min(maxTiltDeg, motion.vx * tiltFactor)
        );
        motion.tilt +=
          (targetTilt - motion.tilt) * Math.min(1, dt * tiltSettleSpeed);
      }

      // 6. Animation State Machine with Hysteresis
      const currentSpeed = isSettled ? 0 : speed;
      motion.speed = currentSpeed;

      const isTurning =
        Math.abs(motion.facingScale) < turnFacingThreshold &&
        currentSpeed > walkSpeedThreshold;
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
          stationaryStartTime = null;
        } else if (currentSpeed >= walkSpeedThreshold) {
          nextState = "walking";
          stationaryStartTime = null;
        } else {
          // Stationary counting towards sitting
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

      // If state or turning changed, update DOM attributes and trigger callback
      const stateChanged = nextState !== currentAnimState;
      const turningChanged = isTurning !== isCurrentlyTurning;

      if (stateChanged || turningChanged) {
        currentAnimState = nextState;
        isCurrentlyTurning = isTurning;
        motion.animationState = nextState;

        if (elementRef.current) {
          elementRef.current.dataset.state = nextState;
          elementRef.current.dataset.turning = isTurning ? "true" : "false";

          // Also set on inner character root if present
          const charRoot = elementRef.current.querySelector(
            ".dog-character-root"
          ) as HTMLElement | null;
          if (charRoot) {
            charRoot.dataset.state = nextState;
            charRoot.dataset.turning = isTurning ? "true" : "false";
          }
        }

        onStateChange?.(nextState, isTurning);
      }

      // 7. Direct Hardware-Accelerated DOM Transform Update
      if (elementRef.current) {
        const x = motion.currentX.toFixed(2);
        const y = motion.currentY.toFixed(2);
        const scaleX = motion.facingScale.toFixed(3);
        const rot = motion.tilt.toFixed(2);

        elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${scaleX}) rotate(${rot}deg)`;
      }

      // 8. Personality & Trail Step Callback
      onMotionStep?.({
        currentX: motion.currentX,
        currentY: motion.currentY,
        vx: motion.vx,
        vy: motion.vy,
        speed: motion.speed,
        facing: motion.facing,
        state: motion.animationState,
        isSettled,
      });

      animationFrameId = requestAnimationFrame(tick);
    };

    // Initialize immediate initial placement and default attributes
    if (elementRef.current) {
      const x = config.initialPosition.x;
      const y = config.initialPosition.y;
      elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(1) rotate(0deg)`;
      elementRef.current.dataset.state = "idle";
      elementRef.current.dataset.turning = "false";
    }

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [elementRef, trackingRef, config, onStateChange, onMotionStep]);

  return motionRef;
}
