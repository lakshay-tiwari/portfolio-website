/**
 * Dog Companion Movement Engine Configuration
 * 
 * Tune these parameters to adjust the feel, speed, responsiveness,
 * and boundary behavior of the cursor-following dog companion.
 */

export type DogAnimationState = "idle" | "walking" | "running" | "sitting" | "turning";

export type DogIdleGesture = "none" | "tilt" | "look-around" | "curious" | "happy-pant";

export type DogReactionType = "none" | "click-react" | "chase-excited" | "greeting";

export interface DogPersonalityConfig {
  /** Master toggle for personality micro-interactions */
  enabled: boolean;
  /** Minimum interval between randomized idle behaviors (ms) */
  idleMinIntervalMs: number;
  /** Maximum interval between randomized idle behaviors (ms) */
  idleMaxIntervalMs: number;
  /** Duration of an active idle gesture before smoothly returning (ms) */
  idleGestureDurationMs: number;
  /** Speed threshold above which movement counts as a chase/sprint (px/s) */
  chaseSpeedThreshold: number;
  /** Minimum cumulative distance covered during chase to trigger arrival excitement (px) */
  chaseMinDistance: number;
  /** Duration of post-chase arrival excitement (ms) */
  chaseExcitedDurationMs: number;
  /** Duration of click reaction jump/hop (ms) */
  clickReactionDurationMs: number;
  /** Whether tiny paw-print trail is enabled */
  enablePawTrail: boolean;
  /** Maximum concurrent paw prints in object pool */
  maxPawPrints: number;
  /** Distance in pixels between consecutive paw print deposits */
  pawDepositDistance: number;
  /** Whether running dust puff particles are enabled */
  enableDustParticles: boolean;
  /** Whether occasional speech bubbles are enabled */
  enableSpeechBubble: boolean;
  /** Minimum cooldown time between speech bubbles (ms) */
  speechBubbleCooldownMs: number;
}

export interface DogMotionConfig {
  /** Dog character dimensions (in pixels) */
  size: {
    width: number;
    height: number;
  };

  /** Default resting position when mouse leaves the viewport or on initial load */
  initialPosition: {
    x: number;
    y: number;
  };

  /** Offset distance between the cursor and the dog */
  cursorOffset: {
    /** Horizontal distance to the right (or left when flipped near boundaries) of cursor */
    gapX: number;
    /** Vertical offset relative to cursor (slight vertical offset for natural pacing) */
    offsetY: number;
  };

  /** Boundary padding from viewport edges (in pixels) */
  boundaryPadding: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };

  /**
   * Extra horizontal threshold for side-switching near viewport right edge (hysteresis).
   * Prevents rapid back-and-forth flipping when cursor moves right on the edge.
   */
  boundaryHysteresis: number;

  /**
   * Physics spring parameters:
   * 
   * stiffness (k): How strongly the spring pulls towards the target.
   * Higher = snappier, quicker reaction.
   * Lower = lazier, looser lag.
   * 
   * damping (c): How strongly motion is resisted.
   * Higher = heavy, no overshoot, slower settle.
   * Lower = bouncy, more overshoot.
   * For critical damping without oscillation: c ≈ 2 * sqrt(k * mass).
   */
  physics: {
    /** Spring stiffness constant (k) */
    stiffness: number;
    /** Damping coefficient (c) */
    damping: number;
    /** Maximum velocity allowed in px/sec to prevent violent jumps */
    maxSpeed: number;
    /** Virtual mass of the companion */
    mass: number;
    /** Minimum threshold for distance and velocity below which motion sleeps */
    settleThreshold: number;
  };

  /**
   * Orientation & Tilt Dynamics
   */
  orientation: {
    /** Minimum horizontal velocity (px/sec) required to flip facing direction (deadband) */
    flipVelocityThreshold: number;
    /** Speed of smooth facing transition lerp (higher = faster turn) */
    flipLerpSpeed: number;
    /** Maximum tilt angle during turns (in degrees) */
    maxTiltDeg: number;
    /** Multiplier converting horizontal velocity to banking tilt */
    tiltFactor: number;
    /** Speed of tilt returning to upright 0deg when stationary */
    tiltSettleSpeed: number;
  };

  /**
   * Animation State Machine thresholds & timings
   */
  animation: {
    /** Speed above which character begins walking (px/sec) */
    walkSpeedThreshold: number;
    /** Speed above which character begins running (px/sec) */
    runSpeedThreshold: number;
    /** Speed below which running drops back to walking (hysteresis) */
    runExitThreshold: number;
    /** Speed below which walking drops back to idle (hysteresis) */
    walkExitThreshold: number;
    /** Time stationary before sitting (ms) */
    sitDelayMs: number;
    /** Absolute facing scale threshold below which dog is considered actively turning */
    turnFacingThreshold: number;
  };

  /**
   * Personality & Delightful Micro-Interactions (Phase 3)
   */
  personality: DogPersonalityConfig;
}

export const DEFAULT_DOG_CONFIG: DogMotionConfig = {
  size: {
    width: 60,
    height: 60,
  },

  initialPosition: {
    x: 28,
    y: 28,
  },

  cursorOffset: {
    gapX: 36,
    offsetY: 6,
  },

  boundaryPadding: {
    top: 20,
    right: 24,
    bottom: 24,
    left: 20,
  },

  boundaryHysteresis: 32,

  physics: {
    // k = 140 gives energetic, responsive following
    stiffness: 140,
    // c = 21 is slightly under critical damping (2 * sqrt(140) ≈ 23.66),
    // giving a subtle, natural, organic overshoot when coming to a halt
    damping: 21,
    // Maximum movement speed in pixels per second
    maxSpeed: 1600,
    mass: 1.0,
    // Sleep when position diff < 0.25px and speed < 0.5px/s
    settleThreshold: 0.25,
  },

  orientation: {
    // Only flip if velocity exceeds 25px/s to prevent nervous twitching
    flipVelocityThreshold: 25,
    // Smooth turn flip interpolation rate
    flipLerpSpeed: 14,
    // Up to 12 degrees banking tilt during fast turns
    maxTiltDeg: 12,
    tiltFactor: 0.016,
    tiltSettleSpeed: 12,
  },

  animation: {
    walkSpeedThreshold: 12,
    runSpeedThreshold: 380,
    runExitThreshold: 280,
    walkExitThreshold: 6,
    sitDelayMs: 2200,
    turnFacingThreshold: 0.65,
  },

  personality: {
    enabled: true,
    idleMinIntervalMs: 4500,
    idleMaxIntervalMs: 7500,
    idleGestureDurationMs: 2000,
    chaseSpeedThreshold: 500,
    chaseMinDistance: 300,
    chaseExcitedDurationMs: 1600,
    clickReactionDurationMs: 650,
    enablePawTrail: true,
    maxPawPrints: 8,
    pawDepositDistance: 32,
    enableDustParticles: true,
    enableSpeechBubble: true,
    speechBubbleCooldownMs: 26000,
  },
};

