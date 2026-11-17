"use client";

import { useEffect, useRef } from "react";
import { DogAnimationState, DogMotionConfig } from "./dogMotionConfig";
import { CursorTrackingState } from "./useCursorTracking";

export type DogHeading = "left" | "right" | "up" | "down";

export interface DogMotionState {
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  facing: number; // +1 = right, -1 = left
  facingScale: number; // smoothly lerped between -1 and +1
  heading: DogHeading; // 4-directional heading
  tilt: number; // banking tilt in degrees
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
  state: DogAnimationState;
  isSettled: boolean;
}

/**
 * useDogMotion
 * 
 * Phase 4 Production-Optimized Movement Engine:
 * - Second-Order Damped Spring Physics via Semi-Implicit Euler integration
 * - Runs on requestAnimationFrame with zero per-frame React state updates
 * - Direct Hardware-Accelerated DOM transforms (translate3d, scaleX, rotate)
 * - Sleep gating: completely sleeps when tab is hidden or when screen is on mobile (<640px)
 * - Accessibility: adapts to prefers-reduced-motion with soft, zero-tilt, critically-damped glide
 * - Velocity hysteresis state machine preventing locomotion animation flickering
 * - Redundant style-write elimination when settled
 */
export function useDogMotion(
  elementRef: React.RefObject<HTMLDivElement | null>,
  trackingRef: React.MutableRefObject<CursorTrackingState>,
  config: DogMotionConfig,
  onStateChange?: (state: DogAnimationState, isTurning: boolean, heading?: DogHeading) => void,
  onMotionStep?: (motion: DogMotionStepCallbackParams) => void
) {
  const motionRef = useRef<DogMotionState>({
    currentX: config.initialPosition.x,
    currentY: config.initialPosition.y,
    vx: 0,
    vy: 0,
    facing: 1,
    facingScale: 1,
    heading: "down",
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
    let currentHeading: DogHeading = "down";
    let stationaryStartTime: number | null = performance.now();
    let wasSettled = false;

    let lastTargetX = trackingRef.current.targetX;
    let lastTargetY = trackingRef.current.targetY;
    let smoothTargetVx = 0;
    let smoothTargetVy = 0;
    let dynamicOffsetX = 0;
    let dynamicOffsetY = 0;

    const {
      physics: { stiffness, damping, maxSpeed, maxAcceleration = 420, mass, settleThreshold },
      orientation: {
        flipVelocityThreshold,
        flipLerpSpeed,
        maxTiltDeg,
        tiltFactor,
        tiltSettleSpeed,
        maxVerticalPitchDeg = 14,
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
      const tracking = trackingRef.current;

      // 1. Sleep check: inactive tab or unsupported device (e.g. mobile <640px)
      if (!tracking.isTabVisible || !tracking.isDeviceSupported) {
        lastTime = now;
        animationFrameId = requestAnimationFrame(tick);
        return;
      }

      // 2. Delta Time (dt in seconds, clamped between 1ms and 64ms to prevent physics explosion on lag spikes)
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
      // When moving DOWN (smoothTargetVy > 25): shift target above cursor so dog trails behind
      // When moving UP (smoothTargetVy < -25): shift target below cursor so dog trails behind
      let desiredOffsetY = 0;
      let desiredOffsetX = 0;

      if (!tracking.isReducedMotion && tracking.isMouseInside) {
        if (smoothTargetVy > 25) {
          const downLag = Math.min(42, (smoothTargetVy - 25) * 0.10);
          desiredOffsetY = -downLag;
        } else if (smoothTargetVy < -25) {
          const upLag = Math.min(22, (-smoothTargetVy - 25) * 0.08);
          desiredOffsetY = upLag;
        }

        if (smoothTargetVx > 35) {
          desiredOffsetX = -Math.min(32, (smoothTargetVx - 35) * 0.07);
        } else if (smoothTargetVx < -35) {
          desiredOffsetX = Math.min(32, (-smoothTargetVx - 35) * 0.07);
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

      const effectiveTargetX = Math.max(minX, Math.min(maxX, tracking.targetX + dynamicOffsetX));
      const effectiveTargetY = Math.max(minY, Math.min(maxY, tracking.targetY + dynamicOffsetY));

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
        // Snap cleanly to rest and zero velocities
        motion.currentX = tracking.targetX;
        motion.currentY = tracking.targetY;
        motion.vx = 0;
        motion.vy = 0;
        motion.tilt = 0;
        motion.heading = "down";
        dynamicOffsetX = 0;
        dynamicOffsetY = 0;
      } else {
        // 3. Second-Order Damped Spring Physics with Acceleration Clamping
        // Force calculation: Hooke's Law F = -k*x with velocity damping F_damp = -c*v
        // In reduced-motion mode: use softer critically damped spring with zero tilt
        const effectiveStiffness = tracking.isReducedMotion ? 18 : stiffness;
        const effectiveDamping = tracking.isReducedMotion
          ? 2 * Math.sqrt(18 * mass) // Exact critical damping (zero overshoot)
          : damping;

        const fx = effectiveStiffness * dx - effectiveDamping * motion.vx;
        const fy = effectiveStiffness * dy - effectiveDamping * motion.vy;

        // Semi-implicit Euler integration: v_{t+1} = v_t + a*dt
        let ax = fx / mass;
        let ay = fy / mass;

        // Acceleration Clamping: prevents violent launches so the dog ramps up slowly and gently
        const currentAccel = Math.hypot(ax, ay);
        const effectiveMaxAccel = tracking.isReducedMotion ? maxAcceleration * 0.6 : maxAcceleration;
        if (currentAccel > effectiveMaxAccel) {
          const accelRatio = effectiveMaxAccel / currentAccel;
          ax *= accelRatio;
          ay *= accelRatio;
        }

        motion.vx += ax * dt;
        motion.vy += ay * dt;

        // Velocity Clamping to enforce max speed ceiling (slow, steady pace)
        const currentSpeed = Math.hypot(motion.vx, motion.vy);
        const effectiveMaxSpeed = tracking.isReducedMotion ? maxSpeed * 0.7 : maxSpeed;
        if (currentSpeed > effectiveMaxSpeed) {
          const ratio = effectiveMaxSpeed / currentSpeed;
          motion.vx *= ratio;
          motion.vy *= ratio;
        }

        // Position integration: x_{t+1} = x_t + v_{t+1}*dt
        motion.currentX += motion.vx * dt;
        motion.currentY += motion.vy * dt;

        // 4. 4-Directional Heading & Facing Determination
        const absX = Math.abs(motion.vx);
        const absY = Math.abs(motion.vy);

        if (currentSpeed > walkExitThreshold) {
          // Vertical vs Horizontal heading with hysteresis:
          if (absY > absX * 0.95) {
            // Dominant vertical motion: face up or down directly
            motion.heading = motion.vy < 0 ? "up" : "down";
          } else if (absX > absY * 0.95) {
            // Dominant horizontal motion: side profile facing left or right
            if (motion.vx > flipVelocityThreshold) {
              motion.heading = "right";
              motion.facing = 1;
            } else if (motion.vx < -flipVelocityThreshold) {
              motion.heading = "left";
              motion.facing = -1;
            }
          }
        }

        // When moving left, facing scale flips to -1; otherwise stays +1
        let targetFacingScale = 1;
        if (motion.heading === "left") {
          targetFacingScale = -1;
        } else {
          targetFacingScale = 1;
        }

        motion.facingScale +=
          (targetFacingScale - motion.facingScale) * Math.min(1, dt * flipLerpSpeed);

        // 5. Subtle Banking Tilt (Slight sway for up/down, banking for left/right)
        if (tracking.isReducedMotion) {
          motion.tilt = 0;
        } else {
          let targetTilt = 0;
          if (motion.heading === "left" || motion.heading === "right") {
            targetTilt = Math.max(-maxTiltDeg, Math.min(maxTiltDeg, motion.vx * tiltFactor));
          } else {
            // Subtle steering sway for up/down (clamped to +/- 3 deg)
            targetTilt = Math.max(-3, Math.min(3, motion.vx * 0.03));
          }

          motion.tilt +=
            (targetTilt - motion.tilt) * Math.min(1, dt * tiltSettleSpeed);
        }
      }

      // 6. Animation State Machine with Hysteresis (prevents rapid oscillation near speed thresholds)
      const currentSpeed = isSettled ? 0 : speed;
      motion.speed = currentSpeed;

      const isTurning =
        Math.abs(motion.facingScale) < turnFacingThreshold &&
        currentSpeed > walkSpeedThreshold &&
        !tracking.isReducedMotion;
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

      // If state, turning, or heading changed, update DOM data attributes
      const stateChanged = nextState !== currentAnimState;
      const turningChanged = isTurning !== isCurrentlyTurning;
      const headingChanged = motion.heading !== currentHeading;

      if (stateChanged || turningChanged || headingChanged) {
        currentAnimState = nextState;
        isCurrentlyTurning = isTurning;
        currentHeading = motion.heading;
        motion.animationState = nextState;

        if (elementRef.current) {
          elementRef.current.dataset.state = nextState;
          elementRef.current.dataset.turning = isTurning ? "true" : "false";
          elementRef.current.dataset.heading = motion.heading;

          const charRoot = elementRef.current.querySelector(
            ".cat-character-root, .dog-character-root"
          ) as HTMLElement | null;
          if (charRoot) {
            charRoot.dataset.state = nextState;
            charRoot.dataset.turning = isTurning ? "true" : "false";
            charRoot.dataset.heading = motion.heading;
          }
        }

        onStateChange?.(nextState, isTurning, motion.heading);
      }

      // 7. Hardware-Accelerated DOM Transform Update
      // Only write transform if moving or entering settled state (avoids redundant DOM writes)
      if (elementRef.current && (!isSettled || !wasSettled)) {
        const x = motion.currentX.toFixed(2);
        const y = motion.currentY.toFixed(2);
        const scaleX = motion.facingScale.toFixed(3);
        const rot = motion.tilt.toFixed(2);

        elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${scaleX}) rotate(${rot}deg)`;
      }

      wasSettled = isSettled;

      // 8. Motion Step Callback (Personality, Paw Trail, Chase Tracking)
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

    // Initialize immediate initial placement
    if (elementRef.current) {
      const x = config.initialPosition.x;
      const y = config.initialPosition.y;
      elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(1) rotate(0deg)`;
      elementRef.current.dataset.state = "idle";
      elementRef.current.dataset.heading = "down";
      elementRef.current.dataset.turning = "false";
    }

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [elementRef, trackingRef, config, onStateChange, onMotionStep]);

  return motionRef;
}
