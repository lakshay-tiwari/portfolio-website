"use client";

import { useEffect, useRef } from "react";
import { DogMotionConfig } from "./dogMotionConfig";
import { CursorTrackingState } from "./useCursorTracking";

export interface DogMotionState {
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  facing: number; // +1 = right, -1 = left
  facingScale: number; // smoothly lerped between -1 and +1
  tilt: number; // banking tilt in degrees
}

/**
 * Runs a high-performance spring physics simulation loop on requestAnimationFrame,
 * applying position, smooth directional flip, and tilt directly to the DOM element
 * via transform: translate3d(...) with zero React state updates.
 */
export function useDogMotion(
  elementRef: React.RefObject<HTMLDivElement | null>,
  trackingRef: React.MutableRefObject<CursorTrackingState>,
  config: DogMotionConfig
) {
  const motionRef = useRef<DogMotionState>({
    currentX: config.initialPosition.x,
    currentY: config.initialPosition.y,
    vx: 0,
    vy: 0,
    facing: 1,
    facingScale: 1,
    tilt: 0,
  });

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const {
      physics: { stiffness, damping, maxSpeed, mass, settleThreshold },
      orientation: {
        flipVelocityThreshold,
        flipLerpSpeed,
        maxTiltDeg,
        tiltFactor,
        tiltSettleSpeed,
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
        // Spring forces: F = k * delta - c * velocity
        const fx = stiffness * dx - damping * motion.vx;
        const fy = stiffness * dy - damping * motion.vy;

        // Accelerations: a = F / m
        const ax = fx / mass;
        const ay = fy / mass;

        // Velocity integration
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

      // 6. Direct Hardware-Accelerated DOM Transform Update
      if (elementRef.current) {
        const x = motion.currentX.toFixed(2);
        const y = motion.currentY.toFixed(2);
        const scaleX = motion.facingScale.toFixed(3);
        const rot = motion.tilt.toFixed(2);

        elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(${scaleX}) rotate(${rot}deg)`;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    // Initialize immediate initial placement
    if (elementRef.current) {
      const x = config.initialPosition.x;
      const y = config.initialPosition.y;
      elementRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scaleX(1) rotate(0deg)`;
    }

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [elementRef, trackingRef, config]);

  return motionRef;
}

