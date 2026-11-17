"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  DogAnimationState,
  DogIdleGesture,
  DogMotionConfig,
} from "./dogMotionConfig";

export interface DogPersonalityHandle {
  onMotionStep: (motion: {
    currentX: number;
    currentY: number;
    vx: number;
    vy: number;
    speed: number;
    facing: number;
    state: DogAnimationState;
    isSettled: boolean;
  }) => void;
  triggerClickReaction: () => void;
  triggerSpeech: (text?: string) => void;
}

export interface SpeechState {
  visible: boolean;
  text: string;
}

const GREETING_QUOTES = ["Woof! 🐾", "Hey there! ✨", "Hello! 👋"];
const CHASE_QUOTES = ["Caught up! 💨", "Woof! 🐕", "Zoom! ⚡"];
const CLICK_QUOTES = ["Nice click! 🎾", "Boop! ✨", "Woof! 🐾"];
const IDLE_QUOTES = ["*sniff sniff* 👃", "Ready! 🦴", "Follow me! 🚀", "Woof! 🐶"];

const IDLE_GESTURES: DogIdleGesture[] = ["tilt", "look-around", "curious", "happy-pant"];

/**
 * useDogPersonality
 * 
 * Orchestrates personality micro-interactions and idle behaviors:
 * - Natural breathing during stationary rest
 * - Randomized eye blinking with occasional double-blinks
 * - Organic head tilting, sniffing, and looking around during idle periods
 * - Ear perking and dynamic aerodynamic reaction
 * - Post-chase sprint excitement upon reaching cursor
 * - Global click interaction (happy bounce & rapid wag) without intercepting clicks
 * - Non-intrusive, rare speech bubble dialogue
 * - First-interaction greeting
 * - Strict animation priority system (locomotion overrides idle gestures)
 */
export function useDogPersonality(
  elementRef: React.RefObject<HTMLDivElement | null>,
  config: DogMotionConfig,
  onDepositPaw?: (x: number, y: number, angleDeg: number, isRunning: boolean) => void
) {
  const [speechState, setSpeechState] = useState<SpeechState>({
    visible: false,
    text: "",
  });

  const gestureRef = useRef<DogIdleGesture>("none");
  const isExcitedRef = useRef(false);
  const isClickReactingRef = useRef(false);
  const hasGreetedRef = useRef(false);

  // Position & distance tracking for paw prints and chase excitement
  const lastXRef = useRef(config.initialPosition.x);
  const lastYRef = useRef(config.initialPosition.y);
  const pawDistanceAccumulator = useRef(0);
  const chaseDistanceAccumulator = useRef(0);
  const wasSprintingRef = useRef(false);

  // Timers and gesture history
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const gestureResetTimerRef = useRef<NodeJS.Timeout | null>(null);
  const excitementTimerRef = useRef<NodeJS.Timeout | null>(null);
  const clickReactionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null);
  const blinkTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSpeechTimeRef = useRef(0);
  const gestureHistoryRef = useRef<DogIdleGesture[]>([]);

  // Update DOM attributes directly to prevent per-frame React re-renders
  const syncAttributes = useCallback(() => {
    if (!elementRef.current) return;
    const el = elementRef.current;
    el.dataset.gesture = gestureRef.current;
    el.dataset.excited = isExcitedRef.current ? "true" : "false";
    el.dataset.clickReact = isClickReactingRef.current ? "true" : "false";

    const innerChar = el.querySelector(".dog-character-root") as HTMLElement | null;
    if (innerChar) {
      innerChar.dataset.gesture = gestureRef.current;
      innerChar.dataset.excited = isExcitedRef.current ? "true" : "false";
      innerChar.dataset.clickReact = isClickReactingRef.current ? "true" : "false";
    }
  }, [elementRef]);

  /**
   * Displays an unobtrusive, short-lived speech bubble respecting cooldowns.
   */
  const triggerSpeech = useCallback(
    (customText?: string) => {
      if (!config.personality.enableSpeechBubble) return;

      const now = performance.now();
      if (
        !customText &&
        now - lastSpeechTimeRef.current < config.personality.speechBubbleCooldownMs
      ) {
        return;
      }

      lastSpeechTimeRef.current = now;
      const text =
        customText || IDLE_QUOTES[Math.floor(Math.random() * IDLE_QUOTES.length)];

      setSpeechState({ visible: true, text });

      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      speechTimerRef.current = setTimeout(() => {
        setSpeechState((prev) => ({ ...prev, visible: false }));
      }, 2300);
    },
    [config.personality.enableSpeechBubble, config.personality.speechBubbleCooldownMs]
  );

  /**
   * Clears any active idle gestures (Priority Rule: Locomotion > Idle)
   */
  const abortIdleGesture = useCallback(() => {
    if (gestureRef.current !== "none") {
      gestureRef.current = "none";
      if (gestureResetTimerRef.current) {
        clearTimeout(gestureResetTimerRef.current);
        gestureResetTimerRef.current = null;
      }
      syncAttributes();
    }
  }, [syncAttributes]);

  /**
   * Selects a controlled randomized idle gesture avoiding immediate repetition
   */
  const scheduleNextIdleGesture = useCallback(() => {
    if (!config.personality.enabled) return;
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);

    const { idleMinIntervalMs, idleMaxIntervalMs, idleGestureDurationMs } =
      config.personality;
    const interval =
      idleMinIntervalMs + Math.random() * (idleMaxIntervalMs - idleMinIntervalMs);

    idleTimerRef.current = setTimeout(() => {
      // Pick a gesture that wasn't used in the last 2 cycles
      const available = IDLE_GESTURES.filter(
        (g) => !gestureHistoryRef.current.slice(-2).includes(g)
      );
      const chosen = available[Math.floor(Math.random() * available.length)] || "tilt";

      gestureHistoryRef.current.push(chosen);
      if (gestureHistoryRef.current.length > 6) gestureHistoryRef.current.shift();

      gestureRef.current = chosen;
      syncAttributes();

      // Occasionally pair with a rare idle thought bubble (12% chance)
      if (Math.random() < 0.12) {
        triggerSpeech();
      }

      // Smoothly return from gesture
      gestureResetTimerRef.current = setTimeout(() => {
        gestureRef.current = "none";
        syncAttributes();
        scheduleNextIdleGesture();
      }, idleGestureDurationMs);
    }, interval);
  }, [config.personality, syncAttributes, triggerSpeech]);

  /**
   * Triggers a joyful click reaction (small jump & wag)
   */
  const triggerClickReaction = useCallback(() => {
    if (!config.personality.enabled) return;

    abortIdleGesture();
    isClickReactingRef.current = true;
    isExcitedRef.current = true;
    syncAttributes();

    if (clickReactionTimerRef.current) clearTimeout(clickReactionTimerRef.current);
    clickReactionTimerRef.current = setTimeout(() => {
      isClickReactingRef.current = false;
      isExcitedRef.current = false;
      syncAttributes();
    }, config.personality.clickReactionDurationMs);

    // 15% chance to show a cute playful speech bubble
    if (Math.random() < 0.15) {
      const quote = CLICK_QUOTES[Math.floor(Math.random() * CLICK_QUOTES.length)];
      triggerSpeech(quote);
    }
  }, [config.personality, abortIdleGesture, syncAttributes, triggerSpeech]);

  /**
   * Triggers arrival excitement when concluding a high-speed chase
   */
  const triggerChaseExcitement = useCallback(() => {
    isExcitedRef.current = true;
    syncAttributes();

    if (excitementTimerRef.current) clearTimeout(excitementTimerRef.current);
    excitementTimerRef.current = setTimeout(() => {
      isExcitedRef.current = false;
      syncAttributes();
    }, config.personality.chaseExcitedDurationMs);

    // 35% chance to show an energetic arrival speech bubble
    if (Math.random() < 0.35) {
      const quote = CHASE_QUOTES[Math.floor(Math.random() * CHASE_QUOTES.length)];
      triggerSpeech(quote);
    }
  }, [config.personality, syncAttributes, triggerSpeech]);

  /**
   * Called on every physics animation step from useDogMotion
   */
  const onMotionStep = useCallback(
    ({
      currentX,
      currentY,
      speed,
      state,
      isSettled,
    }: {
      currentX: number;
      currentY: number;
      vx: number;
      vy: number;
      speed: number;
      facing: number;
      state: DogAnimationState;
      isSettled: boolean;
    }) => {
      // 1. Initial greeting on first movement
      if (!hasGreetedRef.current && (currentX !== config.initialPosition.x || currentY !== config.initialPosition.y)) {
        hasGreetedRef.current = true;
        isExcitedRef.current = true;
        syncAttributes();
        setTimeout(() => {
          isExcitedRef.current = false;
          syncAttributes();
        }, 1200);

        const quote = GREETING_QUOTES[Math.floor(Math.random() * GREETING_QUOTES.length)];
        triggerSpeech(quote);
      }

      // Compute incremental movement delta
      const dx = currentX - lastXRef.current;
      const dy = currentY - lastYRef.current;
      const stepDist = Math.hypot(dx, dy);
      lastXRef.current = currentX;
      lastYRef.current = currentY;

      const isMoving = state === "walking" || state === "running";

      // 2. Priority Rule: Locomotion cancels active idle gestures
      if (isMoving && gestureRef.current !== "none") {
        abortIdleGesture();
      }

      // 3. Paw-print trail tracking
      if (config.personality.enablePawTrail && isMoving && stepDist > 0.05) {
        pawDistanceAccumulator.current += stepDist;
        if (pawDistanceAccumulator.current >= config.personality.pawDepositDistance) {
          pawDistanceAccumulator.current = 0;
          const travelAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
          // Deposit paw print near rear paw foot contact
          onDepositPaw?.(
            currentX + 28,
            currentY + 50,
            travelAngle,
            state === "running" && config.personality.enableDustParticles
          );
        }
      }

      // 4. Chase sprint & arrival excitement tracking
      if (speed >= config.personality.chaseSpeedThreshold) {
        wasSprintingRef.current = true;
        chaseDistanceAccumulator.current += stepDist;
      } else if (isSettled || speed < config.animation.walkExitThreshold) {
        if (
          wasSprintingRef.current &&
          chaseDistanceAccumulator.current >= config.personality.chaseMinDistance
        ) {
          triggerChaseExcitement();
        }
        wasSprintingRef.current = false;
        chaseDistanceAccumulator.current = 0;
      }
    },
    [
      config,
      onDepositPaw,
      abortIdleGesture,
      triggerChaseExcitement,
      triggerSpeech,
      syncAttributes,
    ]
  );

  // Setup click interaction, blinking loop, and idle scheduler
  useEffect(() => {
    if (typeof window === "undefined" || !config.personality.enabled) return;

    // 1. Global click interaction (pointerdown)
    const handlePointerDown = (e: PointerEvent | MouseEvent) => {
      // Avoid reacting if user is interacting with text inputs or form fields
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) {
        return;
      }
      triggerClickReaction();
    };

    // 2. Natural randomized blinking scheduler
    const scheduleNextBlink = () => {
      const interval = 3000 + Math.random() * 3200; // 3.0s - 6.2s
      blinkTimerRef.current = setTimeout(() => {
        if (!elementRef.current || document.hidden) {
          scheduleNextBlink();
          return;
        }

        const charEl = elementRef.current.querySelector(
          ".dog-character-root"
        ) as HTMLElement | null;
        if (charEl) {
          charEl.dataset.blinking = "true";
          const isDoubleBlink = Math.random() < 0.22;

          setTimeout(() => {
            charEl.dataset.blinking = "false";
            if (isDoubleBlink) {
              setTimeout(() => {
                charEl.dataset.blinking = "true";
                setTimeout(() => {
                  charEl.dataset.blinking = "false";
                  scheduleNextBlink();
                }, 130);
              }, 110);
            } else {
              scheduleNextBlink();
            }
          }, 140);
        } else {
          scheduleNextBlink();
        }
      }, interval);
    };

    // 3. Tab visibility pause / resume
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        if (gestureResetTimerRef.current) clearTimeout(gestureResetTimerRef.current);
        if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
        gestureRef.current = "none";
        syncAttributes();
      } else {
        scheduleNextBlink();
        scheduleNextIdleGesture();
      }
    };

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange, { passive: true });

    scheduleNextBlink();
    scheduleNextIdleGesture();

    return () => {
      window.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (gestureResetTimerRef.current) clearTimeout(gestureResetTimerRef.current);
      if (excitementTimerRef.current) clearTimeout(excitementTimerRef.current);
      if (clickReactionTimerRef.current) clearTimeout(clickReactionTimerRef.current);
      if (speechTimerRef.current) clearTimeout(speechTimerRef.current);
      if (blinkTimerRef.current) clearTimeout(blinkTimerRef.current);
    };
  }, [
    config.personality.enabled,
    elementRef,
    scheduleNextIdleGesture,
    triggerClickReaction,
    syncAttributes,
  ]);

  return {
    speechState,
    onMotionStep,
    triggerClickReaction,
    triggerSpeech,
  };
}
