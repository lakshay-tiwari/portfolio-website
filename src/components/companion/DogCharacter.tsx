import React from "react";
import type { DogAnimationState } from "./dogMotionConfig";

export interface DogCharacterProps {
  /** Current animation state derived from movement physics */
  state?: DogAnimationState;
  /** Whether the dog is currently in the middle of turning */
  isTurning?: boolean;
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
 * - Tail wagging with state-dependent velocity (gentle in idle, lively in walk, high-speed in run)
 * - Periodic natural eye blinking
 * - Squash & stretch body bounce during locomotion
 * - Smooth transition into a relaxed sitting pose when stationary
 * - Compatible with both light and dark backgrounds
 * 
 * Inner animation transforms are strictly isolated from the outer movement engine.
 */
export function DogCharacter({
  state = "idle",
  isTurning = false,
  size = 60,
  className = "",
}: DogCharacterProps) {
  return (
    <div
      className={`dog-character-root relative select-none pointer-events-none ${className}`}
      style={{ width: size, height: size }}
      data-state={state}
      data-turning={isTurning ? "true" : "false"}
      role="img"
      aria-label={`Dog companion character (${state})`}
    >
      <style>{`
        /* Base isolation: transform-box fill-box for precise SVG joint pivots */
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
          animation: dog-shadow-walk 0.38s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-shadow {
          animation: dog-shadow-run 0.22s ease-in-out infinite alternate;
        }
        [data-state="sitting"] .dog-shadow {
          transform: scale(1.15, 1.1) translateY(1px);
          opacity: 0.25;
        }

        @keyframes dog-shadow-idle {
          0%, 100% { transform: scale(1); opacity: 0.18; }
          50% { transform: scale(1.06); opacity: 0.22; }
        }
        @keyframes dog-shadow-walk {
          0% { transform: scale(0.95); opacity: 0.16; }
          100% { transform: scale(1.05); opacity: 0.22; }
        }
        @keyframes dog-shadow-run {
          0% { transform: scale(0.88); opacity: 0.14; }
          100% { transform: scale(1.12); opacity: 0.24; }
        }

        /* 2. Whole Body Squash, Stretch & Bounce */
        .dog-body-group {
          transform-origin: 30px 45px;
          transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        [data-state="idle"] .dog-body-group {
          animation: dog-body-idle 2.4s ease-in-out infinite;
        }
        [data-state="walking"] .dog-body-group {
          animation: dog-body-walk 0.38s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-body-group {
          animation: dog-body-run 0.22s ease-in-out infinite alternate;
        }
        [data-state="sitting"] .dog-body-group {
          transform: translateY(3.5px) scale(1.02, 0.94);
        }

        @keyframes dog-body-idle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-1.5px); }
        }
        @keyframes dog-body-walk {
          0% { transform: translateY(0) rotate(-0.8deg); }
          100% { transform: translateY(-2.2px) rotate(0.8deg); }
        }
        @keyframes dog-body-run {
          0% { transform: translateY(1px) scale(1.04, 0.96) rotate(-1.5deg); }
          100% { transform: translateY(-4px) scale(0.96, 1.04) rotate(1.5deg); }
        }

        /* 3. Tail Wagging Dynamics */
        .dog-tail {
          transform-origin: 12px 34px;
        }
        [data-state="idle"] .dog-tail {
          animation: dog-tail-idle 1.6s ease-in-out infinite alternate;
        }
        [data-state="walking"] .dog-tail {
          animation: dog-tail-walk 0.38s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-tail {
          animation: dog-tail-run 0.18s ease-in-out infinite alternate;
        }
        [data-state="sitting"] .dog-tail {
          animation: dog-tail-sit 1.2s ease-in-out infinite alternate;
        }

        @keyframes dog-tail-idle {
          0% { transform: rotate(-8deg); }
          100% { transform: rotate(14deg); }
        }
        @keyframes dog-tail-walk {
          0% { transform: rotate(-18deg); }
          100% { transform: rotate(24deg); }
        }
        @keyframes dog-tail-run {
          0% { transform: rotate(-32deg) scaleY(1.1); }
          100% { transform: rotate(34deg) scaleY(0.95); }
        }
        @keyframes dog-tail-sit {
          0% { transform: rotate(-4deg); }
          100% { transform: rotate(18deg); }
        }

        /* 4. Trot Leg Cycles (Antiphase Pairs) */
        .leg-joint-front-near, .leg-joint-front-far,
        .leg-joint-back-near, .leg-joint-back-far {
          transition: transform 0.25s ease-out;
        }
        .leg-joint-front-near { transform-origin: 39px 38px; }
        .leg-joint-front-far  { transform-origin: 43px 37px; }
        .leg-joint-back-near  { transform-origin: 18px 38px; }
        .leg-joint-back-far   { transform-origin: 22px 37px; }

        /* Walking trot cycle */
        [data-state="walking"] .leg-joint-front-near {
          animation: dog-leg-swing-a 0.38s ease-in-out infinite alternate;
        }
        [data-state="walking"] .leg-joint-back-far {
          animation: dog-leg-swing-a 0.38s ease-in-out infinite alternate;
        }
        [data-state="walking"] .leg-joint-front-far {
          animation: dog-leg-swing-b 0.38s ease-in-out infinite alternate;
        }
        [data-state="walking"] .leg-joint-back-near {
          animation: dog-leg-swing-b 0.38s ease-in-out infinite alternate;
        }

        /* Running gallop cycle */
        [data-state="running"] .leg-joint-front-near {
          animation: dog-leg-run-a 0.22s ease-in-out infinite alternate;
        }
        [data-state="running"] .leg-joint-back-far {
          animation: dog-leg-run-a 0.22s ease-in-out infinite alternate;
        }
        [data-state="running"] .leg-joint-front-far {
          animation: dog-leg-run-b 0.22s ease-in-out infinite alternate;
        }
        [data-state="running"] .leg-joint-back-near {
          animation: dog-leg-run-b 0.22s ease-in-out infinite alternate;
        }

        /* Sitting Pose: rear legs fold horizontal, front legs upright */
        [data-state="sitting"] .leg-joint-front-near {
          transform: translateY(-2px) rotate(2deg);
        }
        [data-state="sitting"] .leg-joint-front-far {
          transform: translateY(-2px) rotate(-1deg);
        }
        [data-state="sitting"] .leg-joint-back-near {
          transform: rotate(-65deg) translate(2px, -4px) scaleY(0.75);
        }
        [data-state="sitting"] .leg-joint-back-far {
          transform: rotate(-65deg) translate(2px, -4px) scaleY(0.75);
        }

        @keyframes dog-leg-swing-a {
          0% { transform: rotate(-22deg); }
          100% { transform: rotate(22deg); }
        }
        @keyframes dog-leg-swing-b {
          0% { transform: rotate(22deg); }
          100% { transform: rotate(-22deg); }
        }
        @keyframes dog-leg-run-a {
          0% { transform: rotate(-38deg) translateY(-1px); }
          100% { transform: rotate(36deg) translateY(1px); }
        }
        @keyframes dog-leg-run-b {
          0% { transform: rotate(36deg) translateY(1px); }
          100% { transform: rotate(-38deg) translateY(-1px); }
        }

        /* 5. Head Bobbing & Ear Bounce */
        .dog-head-group {
          transform-origin: 36px 30px;
          transition: transform 0.3s ease;
        }
        [data-state="idle"] .dog-head-group {
          animation: dog-head-idle 2.4s ease-in-out infinite;
        }
        [data-state="walking"] .dog-head-group {
          animation: dog-head-walk 0.38s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-head-group {
          animation: dog-head-run 0.22s ease-in-out infinite alternate;
        }
        [data-state="sitting"] .dog-head-group {
          transform: translateY(-1px) rotate(1.5deg);
        }

        @keyframes dog-head-idle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-0.8px) rotate(-1deg); }
        }
        @keyframes dog-head-walk {
          0% { transform: translateY(0.5px) rotate(-1.5deg); }
          100% { transform: translateY(-1.2px) rotate(1.5deg); }
        }
        @keyframes dog-head-run {
          0% { transform: translateY(1.2px) rotate(-2.5deg); }
          100% { transform: translateY(-2.2px) rotate(2.5deg); }
        }

        /* 6. Natural Eye Blinking */
        .dog-eye {
          transform-origin: center center;
          animation: dog-blink 3.8s ease-in-out infinite;
        }
        @keyframes dog-blink {
          0%, 94%, 98%, 100% { transform: scaleY(1); opacity: 1; }
          96% { transform: scaleY(0.08); opacity: 0.9; }
        }

        /* 7. Ears Dynamic Wiggle */
        .dog-ear-near {
          transform-origin: 38px 17px;
        }
        [data-state="walking"] .dog-ear-near {
          animation: dog-ear-bounce 0.38s ease-in-out infinite alternate;
        }
        [data-state="running"] .dog-ear-near {
          animation: dog-ear-bounce 0.22s ease-in-out infinite alternate;
        }
        @keyframes dog-ear-bounce {
          0% { transform: rotate(-3deg); }
          100% { transform: rotate(5deg); }
        }

        /* 8. Turning squash effect */
        [data-turning="true"] .dog-body-group {
          transform: scale(0.92, 1.04);
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
        {/* BACKGROUND LAYER (Far Legs & Far Ear)                        */}
        {/* ============================================================ */}

        {/* Far Rear Leg */}
        <g className="leg-joint-back-far">
          <path
            d="M 21 37 Q 19 46 18 53 Q 18 56 21 56 Q 24 56 24 53 L 25 38 Z"
            fill="#B45309"
          />
          {/* White Far Back Sock */}
          <ellipse cx="21" cy="54" rx="2.5" ry="2" fill="#FEF3C7" />
        </g>

        {/* Far Front Leg */}
        <g className="leg-joint-front-far">
          <path
            d="M 42 37 Q 41 46 41 53 Q 41 56 44 56 Q 47 56 47 53 L 47 38 Z"
            fill="#B45309"
          />
          {/* White Far Front Sock */}
          <ellipse cx="44" cy="54" rx="2.5" ry="2" fill="#FEF3C7" />
        </g>

        {/* Far Ear (Behind Head) */}
        <g className="dog-ear-far">
          <path
            d="M 34 18 Q 30 7 35 4 Q 40 5 41 15 Z"
            fill="#D97706"
          />
          {/* Inner Ear Pink Accent */}
          <path
            d="M 35 15 Q 33 9 36 7 Q 38 8 39 14 Z"
            fill="#F472B6"
            opacity="0.85"
          />
        </g>

        {/* ============================================================ */}
        {/* MAIN BODY & TAIL LAYER                                       */}
        {/* ============================================================ */}
        <g className="dog-body-group">
          {/* Fluffy Tail */}
          <g className="dog-tail">
            <path
              d="M 12 35 C 7 31 3 24 6 19 C 9 15 14 18 15 24 C 16 28 14 34 12 35 Z"
              fill="#D97706"
            />
            {/* White Tail Tip */}
            <path
              d="M 6 19 C 7 16 11 16 13 19 C 11 22 8 22 6 19 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* Corgi Torso (Warm Golden Coat) */}
          <ellipse
            cx="28"
            cy="36"
            rx="18"
            ry="11"
            fill="#F59E0B"
          />

          {/* Torso Top Highlight / Warm Fur */}
          <ellipse
            cx="26"
            cy="32"
            rx="14"
            ry="6"
            fill="#FBBF24"
          />

          {/* Fluffy Cream Chest & Belly */}
          <path
            d="M 22 44 C 28 47 37 47 43 40 C 45 35 44 31 41 29 C 36 33 26 38 22 44 Z"
            fill="#FFFBEB"
          />

          {/* Soft Fur Transition Edge */}
          <path
            d="M 28 43 Q 32 46 38 43"
            stroke="#FEF3C7"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* ============================================================ */}
          {/* FOREGROUND LEGS (Near Legs)                                  */}
          {/* ============================================================ */}

          {/* Near Rear Leg */}
          <g className="leg-joint-back-near">
            <path
              d="M 17 37 Q 15 46 14 53 Q 14 56.5 17.5 56.5 Q 21 56.5 21 53 L 22 38 Z"
              fill="#D97706"
            />
            {/* White Near Back Paw Sock */}
            <path
              d="M 14 52 Q 17.5 50 21 52 Q 21 56.5 17.5 56.5 Q 14 56.5 14 52 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* Near Front Leg */}
          <g className="leg-joint-front-near">
            <path
              d="M 38 37 Q 37 46 37 53 Q 37 56.5 40.5 56.5 Q 44 56.5 44 53 L 44 38 Z"
              fill="#F59E0B"
            />
            {/* White Near Front Paw Sock */}
            <path
              d="M 37 52 Q 40.5 50 44 52 Q 44 56.5 40.5 56.5 Q 37 56.5 37 52 Z"
              fill="#FFFFFF"
            />
          </g>

          {/* ============================================================ */}
          {/* HEAD & EXPRESSION LAYER                                      */}
          {/* ============================================================ */}
          <g className="dog-head-group">
            {/* Red Collar with Golden Tag */}
            <path
              d="M 36 34 Q 42 37 46 32"
              stroke="#EF4444"
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Gold Tag */}
            <circle cx="41.5" cy="36.5" r="2.2" fill="#F59E0B" />
            <circle cx="41.5" cy="36.5" r="1.1" fill="#FEF08A" />

            {/* Head Base Round */}
            <circle cx="43" cy="23" r="12" fill="#F59E0B" />

            {/* White Forehead Blaze / Snout Mask */}
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
            {/* Nose Gleam */}
            <circle cx="53.5" cy="23" r="0.7" fill="#FFFFFF" />

            {/* Cute Smiling Mouth with Pink Tongue Tip */}
            <path
              d="M 49 27 Q 52 29 54 26.5"
              stroke="#78350F"
              strokeWidth="1.2"
              strokeLinecap="round"
              fill="none"
            />
            {/* Happy Little Tongue (peeks out slightly) */}
            <path
              d="M 51 28 Q 52.5 30.5 53.5 28.5 Z"
              fill="#FB7185"
            />

            {/* Expressive Eye */}
            <g className="dog-eye">
              <ellipse cx="45.5" cy="19.5" rx="2.4" ry="2.8" fill="#1F2937" />
              {/* Primary Eye Light Gleam */}
              <circle cx="44.8" cy="18.5" r="1" fill="#FFFFFF" />
              {/* Secondary Tiny Eye Gleam */}
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
              {/* Inner Ear Pink Fluff */}
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
