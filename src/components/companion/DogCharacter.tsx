import React from "react";
import type { DogAnimationState, DogIdleGesture } from "./dogMotionConfig";

export interface DogCharacterProps {
  /** Current animation state derived from movement physics */
  state?: DogAnimationState;
  /** Whether the dog is currently in the middle of turning */
  isTurning?: boolean;
  /** Active idle personality gesture */
  gesture?: DogIdleGesture;
  /** Whether in excited mode (post-chase or happy wag) */
  isExcited?: boolean;
  /** Whether currently playing click jump reaction */
  isClickReacting?: boolean;
  /** Whether in a blink frame */
  isBlinking?: boolean;
  /** Dimension size in pixels (default: 60) */
  size?: number;
  /** Optional custom class name */
  className?: string;
}

/**
 * DogCharacter
 * 
 * High-quality vector Corgi character featuring modular skeletal animation layers:
 * - Trot/gallop leg cycles for walking & running (front & back antiphase)
 * - Anatomically seamless joints: limbs share the body motion frame and feature
 *   rotation-invariant rounded shoulder/hip bulbs that never detach or show gaps.
 * - Tail wagging with state-dependent velocity (gentle in idle, lively in walk, high-speed in run, super-speed in excited)
 * - Natural breathing during idle & sitting poses
 * - Dynamic ear expressions: aerodynamic flutter, turning tuck, excited perk
 * - Curious head tilting, looking around, and happy panting idle gestures
 * - Joyful spring hop on mouse click
 * - Periodic natural eye blinking with randomized cadence
 * - Squash & stretch body bounce during locomotion
 * - Smooth transition into a relaxed sitting pose when stationary
 * - Compatible with both light and dark backgrounds
 * 
 * Inner animation transforms are strictly isolated from the outer movement engine.
 */
export function DogCharacter({
  state = "idle",
  isTurning = false,
  gesture = "none",
  isExcited = false,
  isClickReacting = false,
  isBlinking = false,
  size = 60,
  className = "",
}: DogCharacterProps) {
  return (
    <div
      className={`dog-character-root relative select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      data-state={state}
      data-turning={isTurning ? "true" : "false"}
      data-gesture={gesture}
      data-excited={isExcited ? "true" : "false"}
      data-click-react={isClickReacting ? "true" : "false"}
      data-blinking={isBlinking ? "true" : "false"}
      role="img"
      aria-label={`Dog companion character (${state})`}
    >
      <style>{`
        /* Base isolation: transform-box fill-box for precise joint pivots */
        .dog-character-root svg * {
          transform-box: fill-box;
        }

        /* 1. Ground Shadow Breathing & Locomotion Scale */
        .dog-shadow {
          transform-origin: center center;
          transition: transform 0.3s ease, opacity 0.3s ease;
        }
        [data-state="idle"] .dog-shadow {
          animation: dog-shadow-idle 2.4s ease-in-out infinite;
        }
        [data-state="walking"] .dog-shadow {
          animation: dog-shadow-walk 0.36s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-shadow {
          animation: dog-shadow-run 0.2s ease-in-out infinite alternate;
        }
        [data-state="sitting"] .dog-shadow {
          transform: scale(1.15, 1.1) translateY(0.5px);
          opacity: 0.25;
        }

        @keyframes dog-shadow-idle {
          0%, 100% { transform: scale(1); opacity: 0.18; }
          50% { transform: scale(1.05); opacity: 0.22; }
        }
        @keyframes dog-shadow-walk {
          0% { transform: scale(0.96); opacity: 0.17; }
          100% { transform: scale(1.04); opacity: 0.22; }
        }
        @keyframes dog-shadow-run {
          0% { transform: scale(0.9); opacity: 0.15; }
          100% { transform: scale(1.1); opacity: 0.24; }
        }

        /* 2. Whole Body Squash, Stretch & Bounce */
        /* All 4 legs and the torso are anchored inside this group so they NEVER separate! */
        .dog-body-group {
          transform-origin: 28px 40px;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        [data-state="idle"] .dog-body-group {
          animation: dog-body-idle 2.4s ease-in-out infinite;
        }
        [data-state="walking"] .dog-body-group {
          animation: dog-body-walk 0.36s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-body-group {
          animation: dog-body-run 0.2s ease-in-out infinite alternate;
        }
        [data-state="sitting"] .dog-body-group {
          transform: translateY(2.8px) scale(1.02, 0.96);
        }

        @keyframes dog-body-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.2px); }
        }
        @keyframes dog-body-walk {
          0% { transform: translateY(0) rotate(-0.5deg); }
          100% { transform: translateY(-1.8px) rotate(0.5deg); }
        }
        @keyframes dog-body-run {
          0% { transform: translateY(0.8px) scale(1.03, 0.97) rotate(-1deg); }
          100% { transform: translateY(-2.8px) scale(0.97, 1.03) rotate(1deg); }
        }

        /* 2b. Subtle Breathing on Torso & Belly (Active when Idle or Sitting) */
        .dog-torso {
          transform-origin: 28px 35px;
          transition: transform 0.35s ease;
        }
        [data-state="idle"] .dog-torso,
        [data-state="sitting"] .dog-torso {
          animation: dog-torso-breathe 2.8s ease-in-out infinite;
        }
        @keyframes dog-torso-breathe {
          0%, 100% { transform: scale(1, 1); }
          50% { transform: scale(1.025, 1.04) translateY(-0.35px); }
        }

        /* 3. Tail Wagging Dynamics */
        .dog-tail {
          transform-origin: 13px 34px;
          transition: transform 0.25s ease-out;
        }
        [data-state="idle"] .dog-tail {
          animation: dog-tail-idle 1.6s ease-in-out infinite alternate;
        }
        [data-state="walking"] .dog-tail {
          animation: dog-tail-walk 0.36s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-tail {
          animation: dog-tail-run 0.18s ease-in-out infinite alternate;
        }
        [data-state="sitting"] .dog-tail {
          animation: dog-tail-sit 1.4s ease-in-out infinite alternate;
        }
        /* Super-Speed Wagging when Excited or Arriving from Chase */
        [data-excited="true"] .dog-tail,
        .dog-character-root[data-excited="true"] .dog-tail {
          animation: dog-tail-excited 0.12s ease-in-out infinite alternate !important;
        }

        @keyframes dog-tail-idle {
          0% { transform: rotate(-6deg); }
          100% { transform: rotate(12deg); }
        }
        @keyframes dog-tail-walk {
          0% { transform: rotate(-16deg); }
          100% { transform: rotate(20deg); }
        }
        @keyframes dog-tail-run {
          0% { transform: rotate(-28deg) scaleY(1.08); }
          100% { transform: rotate(30deg) scaleY(0.96); }
        }
        @keyframes dog-tail-sit {
          0% { transform: rotate(-4deg); }
          100% { transform: rotate(16deg); }
        }
        @keyframes dog-tail-excited {
          0% { transform: rotate(-30deg) scale(1.06); }
          100% { transform: rotate(34deg) scale(0.96); }
        }

        /* 4. Trot & Gallop Leg Cycles (Antiphase Pairs with Seamless Rotation Joints) */
        .leg-joint-front-near, .leg-joint-front-far,
        .leg-joint-back-near, .leg-joint-back-far {
          transition: transform 0.25s ease-out;
        }
        /* Joint origins match the center of the rounded shoulder and hip bulbs */
        .leg-joint-front-near { transform-origin: 38px 36px; }
        .leg-joint-front-far  { transform-origin: 41px 35px; }
        .leg-joint-back-near  { transform-origin: 19px 36px; }
        .leg-joint-back-far   { transform-origin: 22px 35px; }

        /* Walking trot cycle (compact, grounded Corgi steps) */
        [data-state="walking"] .leg-joint-front-near {
          animation: dog-leg-walk-a 0.36s ease-in-out infinite alternate;
        }
        [data-state="walking"] .leg-joint-back-far {
          animation: dog-leg-walk-a 0.36s ease-in-out infinite alternate;
        }
        [data-state="walking"] .leg-joint-front-far {
          animation: dog-leg-walk-b 0.36s ease-in-out infinite alternate;
        }
        [data-state="walking"] .leg-joint-back-near {
          animation: dog-leg-walk-b 0.36s ease-in-out infinite alternate;
        }

        /* Running gallop cycle */
        [data-state="running"] .leg-joint-front-near {
          animation: dog-leg-run-a 0.2s ease-in-out infinite alternate;
        }
        [data-state="running"] .leg-joint-back-far {
          animation: dog-leg-run-a 0.2s ease-in-out infinite alternate;
        }
        [data-state="running"] .leg-joint-front-far {
          animation: dog-leg-run-b 0.2s ease-in-out infinite alternate;
        }
        [data-state="running"] .leg-joint-back-near {
          animation: dog-leg-run-b 0.2s ease-in-out infinite alternate;
        }

        /* Sitting Pose: rear legs fold flat naturally, front legs upright and grounded */
        [data-state="sitting"] .leg-joint-front-near {
          transform: rotate(0deg) translateY(-0.5px);
        }
        [data-state="sitting"] .leg-joint-front-far {
          transform: rotate(0deg) translateY(-0.5px);
        }
        [data-state="sitting"] .leg-joint-back-near {
          transform: rotate(-50deg) translate(-1px, 1px) scale(0.95);
        }
        [data-state="sitting"] .leg-joint-back-far {
          transform: rotate(-50deg) translate(-1px, 1px) scale(0.95);
        }

        @keyframes dog-leg-walk-a {
          0% { transform: rotate(-15deg) translateY(-0.5px); }
          100% { transform: rotate(15deg) translateY(0.5px); }
        }
        @keyframes dog-leg-walk-b {
          0% { transform: rotate(15deg) translateY(0.5px); }
          100% { transform: rotate(-15deg) translateY(-0.5px); }
        }
        @keyframes dog-leg-run-a {
          0% { transform: rotate(-24deg) translateY(-1px); }
          100% { transform: rotate(24deg) translateY(0.8px); }
        }
        @keyframes dog-leg-run-b {
          0% { transform: rotate(24deg) translateY(0.8px); }
          100% { transform: rotate(-24deg) translateY(-1px); }
        }

        /* 5. Head Bobbing, Tilting & Expression Gestures */
        .dog-head-group {
          transform-origin: 36px 30px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        [data-state="idle"] .dog-head-group {
          animation: dog-head-idle 2.4s ease-in-out infinite;
        }
        [data-state="walking"] .dog-head-group {
          animation: dog-head-walk 0.36s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-head-group {
          animation: dog-head-run 0.2s ease-in-out infinite alternate;
        }
        [data-state="sitting"] .dog-head-group {
          transform: translateY(-0.8px) rotate(1deg);
        }

        /* Personality Idle Gestures (Priority 4) */
        [data-gesture="tilt"] .dog-head-group {
          transform: rotate(9.5deg) translateY(-1.2px) translateX(0.6px) !important;
        }
        [data-gesture="look-around"] .dog-head-group {
          transform: rotate(-7.5deg) translateY(-0.8px) translateX(-1px) !important;
        }
        [data-gesture="curious"] .dog-head-group {
          transform: translateY(-2.2px) rotate(3deg) scale(1.02) !important;
        }

        @keyframes dog-head-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-0.6px) rotate(-0.5deg); }
        }
        @keyframes dog-head-walk {
          0% { transform: translateY(0.4px) rotate(-1deg); }
          100% { transform: translateY(-0.8px) rotate(1deg); }
        }
        @keyframes dog-head-run {
          0% { transform: translateY(0.8px) rotate(-1.5deg); }
          100% { transform: translateY(-1.5px) rotate(1.5deg); }
        }

        /* 6. Natural & Controlled Eye Blinking */
        .dog-eye {
          transform-origin: center center;
          transition: transform 0.08s ease-out;
          animation: dog-blink 4.2s ease-in-out infinite;
        }
        /* Discrete blink frame applied by randomized scheduler */
        [data-blinking="true"] .dog-eye {
          transform: scaleY(0.08) !important;
          opacity: 0.88 !important;
          animation: none !important;
        }
        @keyframes dog-blink {
          0%, 94%, 98%, 100% { transform: scaleY(1); opacity: 1; }
          96% { transform: scaleY(0.08); opacity: 0.88; }
        }

        /* 7. Dynamic Ears: Aerodynamic Flutter, Turning Tuck & Excited Perk */
        .dog-ear-near, .dog-ear-far {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .dog-ear-near { transform-origin: 38px 17px; }
        .dog-ear-far  { transform-origin: 34px 17px; }

        [data-state="walking"] .dog-ear-near {
          animation: dog-ear-bounce 0.36s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-ear-near {
          animation: dog-ear-bounce 0.18s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-ear-far {
          animation: dog-ear-bounce 0.18s ease-in-out 0.04s infinite alternate;
        }
        @keyframes dog-ear-bounce {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(5deg); }
        }

        /* Ear reaction during turning: flatten back slightly */
        [data-turning="true"] .dog-ear-near {
          transform: rotate(-10deg) translateY(0.5px);
        }
        [data-turning="true"] .dog-ear-far {
          transform: rotate(-12deg) translateY(0.5px);
        }

        /* Ear perk when curious, tilted, or excited */
        [data-excited="true"] .dog-ear-near,
        [data-gesture="curious"] .dog-ear-near,
        [data-gesture="tilt"] .dog-ear-near {
          transform: rotate(7deg) scale(1.08);
        }
        [data-excited="true"] .dog-ear-far,
        [data-gesture="curious"] .dog-ear-far,
        [data-gesture="tilt"] .dog-ear-far {
          transform: rotate(5deg) scale(1.06);
        }

        /* 8. Happy Panting Tongue */
        .dog-tongue {
          transform-origin: 51px 28px;
          transition: transform 0.25s ease;
        }
        [data-gesture="happy-pant"] .dog-tongue {
          animation: dog-tongue-pant 0.32s ease-in-out infinite alternate;
        }
        @keyframes dog-tongue-pant {
          0% { transform: scale(1, 1); }
          100% { transform: scale(1.15, 1.45) translateY(0.8px); }
        }

        /* 9. Click Reaction: Joyful Spring Hop */
        [data-click-react="true"] .dog-body-group {
          animation: dog-click-hop 0.65s cubic-bezier(0.22, 1, 0.36, 1) !important;
        }
        @keyframes dog-click-hop {
          0% { transform: translateY(0); }
          35% { transform: translateY(-7px) scale(1.04, 0.96); }
          70% { transform: translateY(1.2px) scale(0.97, 1.03); }
          100% { transform: translateY(0); }
        }

        /* 10. Turning squash effect */
        [data-turning="true"] .dog-body-group {
          transform: scale(0.94, 1.03);
        }

        /* 11. Accessibility: prefers-reduced-motion support */
        @media (prefers-reduced-motion: reduce) {
          .dog-shadow,
          .dog-body-group,
          .dog-tail,
          .dog-torso,
          .dog-head-group,
          .dog-ear-near,
          .dog-ear-far,
          .dog-eye,
          .dog-tongue,
          .leg-joint-front-near,
          .leg-joint-front-far,
          .leg-joint-back-near,
          .leg-joint-back-far {
            animation: none !important;
            transition: none !important;
          }
          [data-state="walking"] .dog-body-group,
          [data-state="running"] .dog-body-group,
          [data-click-react="true"] .dog-body-group {
            transform: none !important;
          }
          [data-gesture="tilt"] .dog-head-group,
          [data-gesture="look-around"] .dog-head-group,
          [data-gesture="curious"] .dog-head-group {
            transform: none !important;
          }
        }
      `}</style>

      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_8px_16px_rgba(0,0,0,0.22)] dark:drop-shadow-[0_8px_20px_rgba(0,0,0,0.65)]"
      >
        {/* Soft Ground Contact Shadow */}
        <ellipse
          className="dog-shadow"
          cx="31"
          cy="57"
          rx="21"
          ry="4"
          fill="rgba(0,0,0,0.2)"
        />

        {/* ============================================================ */}
        {/* MAIN BODY GROUP: ENTIRE DOG IS UNIFIED IN THIS CONTAINER      */}
        {/* So legs, torso, head, and tail move together in harmony!     */}
        {/* ============================================================ */}
        <g className="dog-body-group">

          {/* 1. FAR LIMBS (Rendered behind the torso) */}

          {/* Far Rear Leg with deep rounded hip joint socket */}
          <g className="leg-joint-back-far">
            {/* Deep rounded joint bulb (overlapping the torso interior) */}
            <circle cx="22" cy="35" r="5" fill="#B45309" />
            {/* Leg shaft down to paw */}
            <path
              d="M 18 35 Q 17 44 18 52 Q 18.5 54.5 21.5 54.5 Q 24.5 54.5 25 52 L 26 36 Z"
              fill="#B45309"
            />
            {/* White Far Back Sock */}
            <path
              d="M 17.8 49.5 Q 21.5 48 25.2 49.5 Q 25 54.5 21.5 54.5 Q 18 54.5 17.8 49.5 Z"
              fill="#FEF3C7"
            />
          </g>

          {/* Far Front Leg with deep rounded shoulder joint socket */}
          <g className="leg-joint-front-far">
            {/* Deep rounded joint bulb */}
            <circle cx="41" cy="35" r="4.5" fill="#B45309" />
            {/* Leg shaft down to paw */}
            <path
              d="M 37.5 35 Q 38 44 38.5 52 Q 39 54.5 42 54.5 Q 45 54.5 45 52 L 44.5 36 Z"
              fill="#B45309"
            />
            {/* White Far Front Sock */}
            <path
              d="M 38.2 49.5 Q 41.5 48 44.8 49.5 Q 44.8 54.5 42 54.5 Q 38.8 54.5 38.2 49.5 Z"
              fill="#FEF3C7"
            />
          </g>

          {/* Far Ear (Behind Head) */}
          <g className="dog-ear-far">
            <path
              d="M 34 18 Q 30 7 35 4 Q 40 5 41 15 Z"
              fill="#D97706"
            />
            <path
              d="M 35 15 Q 33 9 36 7 Q 38 8 39 14 Z"
              fill="#F472B6"
              opacity="0.85"
            />
          </g>

          {/* 2. TAIL */}
          <g className="dog-tail">
            <path
              d="M 13 34 C 8 30 4 23 7 18 C 10 14 15 17 16 23 C 17 27 15 33 13 34 Z"
              fill="#D97706"
            />
            {/* White Tail Tip */}
            <path
              d="M 7 18 C 8 15 12 15 14 18 C 12 21 9 21 7 18 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* 3. TORSO (Solid Warm Golden Corgi Coat) */}
          <g className="dog-torso">
            {/* Main Torso Oval */}
            <ellipse
              cx="28"
              cy="35"
              rx="17"
              ry="11"
              fill="#F59E0B"
            />
            {/* Top Back Highlight */}
            <ellipse
              cx="26"
              cy="31"
              rx="13"
              ry="6"
              fill="#FBBF24"
            />
            {/* Cream Belly & Chest bib */}
            <path
              d="M 21 43 C 27 46 36 46 42 39 C 44 34 43 30 40 28 C 35 32 25 37 21 43 Z"
              fill="#FFFBEB"
            />
            {/* Chest Fur Edge Stroke */}
            <path
              d="M 27 42 Q 31 45 37 42"
              stroke="#FEF3C7"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
          </g>

          {/* 4. FOREGROUND LIMBS (Near Legs with seamless rounded joint bulbs) */}

          {/* Near Rear Leg / Fluffy Corgi Haunch */}
          <g className="leg-joint-back-near">
            {/* Haunch Joint Bulb: overlaps deeply with torso at y=36 */}
            <circle cx="19" cy="36" r="6" fill="#D97706" />
            {/* Soft haunch shadow accent connecting smoothly into the body */}
            <path
              d="M 14 36 C 14 32 23 31 24 35 C 24 41 23 45 22 51.5 Q 21.5 54.5 18.5 54.5 Q 15.5 54.5 15 51.5 Q 14 44 14 36 Z"
              fill="#D97706"
            />
            {/* White Near Back Paw Sock */}
            <path
              d="M 14.8 49 Q 18.5 47.5 22.2 49 Q 22 54.5 18.5 54.5 Q 15 54.5 14.8 49 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* Near Front Leg / Shoulder */}
          <g className="leg-joint-front-near">
            {/* Shoulder Joint Bulb: overlaps deeply with chest at y=36 */}
            <circle cx="38" cy="36" r="5" fill="#F59E0B" />
            {/* Shoulder to paw stroke */}
            <path
              d="M 34 36 C 34 32 42 32 42 36 C 42 41 41.5 45 41 51.5 Q 40.5 54.5 37.5 54.5 Q 34.5 54.5 34 51.5 Q 33.5 44 34 36 Z"
              fill="#F59E0B"
            />
            {/* White Near Front Paw Sock */}
            <path
              d="M 33.8 49 Q 37.5 47.5 41.2 49 Q 41 54.5 37.5 54.5 Q 34 54.5 33.8 49 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* 5. HEAD & EXPRESSION LAYER */}
          <g className="dog-head-group">
            {/* Red Collar with Golden Tag */}
            <path
              d="M 36 34 Q 42 37 46 32"
              stroke="#EF4444"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Gold Collar Tag */}
            <circle cx="41.5" cy="36.5" r="2.2" fill="#F59E0B" />
            <circle cx="41.5" cy="36.5" r="1.1" fill="#FEF08A" />

            {/* Head Base Round */}
            <circle cx="43" cy="23" r="12" fill="#F59E0B" />

            {/* White Forehead Blaze & Snout Mask */}
            <path
              d="M 41 12 C 40 18 36 21 36 26 C 36 32 46 32 50 28 C 47 24 44 18 41 12 Z"
              fill="#FFFFFF"
            />

            {/* Cheek Fur Fluff */}
            <ellipse cx="40" cy="26" rx="6" ry="5" fill="#FDE68A" />

            {/* Snout / Muzzle */}
            <ellipse cx="50" cy="25" rx="5.5" ry="4" fill="#FFFFFF" />

            {/* Black Button Nose */}
            <ellipse cx="54" cy="23.5" rx="2.5" ry="1.8" fill="#1F2937" />
            <circle cx="53.5" cy="23" r="0.7" fill="#FFFFFF" />

            {/* Cute Smiling Mouth with Pink Tongue Tip */}
            <path
              d="M 49 27 Q 52 29 54 26.5"
              stroke="#78350F"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Happy Little Tongue Tip */}
            <path
              className="dog-tongue"
              d="M 51 28 Q 52.5 30.5 53.5 28.5 Z"
              fill="#FB7185"
            />

            {/* Expressive Eye */}
            <g className="dog-eye">
              <ellipse cx="45.5" cy="19.5" rx="2.4" ry="2.8" fill="#1F2937" />
              <circle cx="44.8" cy="18.5" r="1" fill="#FFFFFF" />
              <circle cx="46.4" cy="20.5" r="0.45" fill="#FFFFFF" />
            </g>

            {/* Cute Eyebrow Dot */}
            <circle cx="45" cy="15.5" r="1.1" fill="#FEF3C7" />

            {/* Near Ear (Perky Corgi Ear) */}
            <g className="dog-ear-near">
              <path
                d="M 42 16 Q 43 4 48 3 Q 54 5 50 16 Z"
                fill="#F59E0B"
              />
              <path
                d="M 44 14 Q 45 7 48 6 Q 51 8 49 14 Z"
                fill="#F472B6"
                opacity="0.85"
              />
            </g>
          </g>

        </g>
      </svg>
    </div>
  );
}
