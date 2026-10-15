"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export function GreetingIntro() {
  const [mounted, setMounted] = useState(false);
  // stage:
  // 0 = entrance (0-600ms) - smooth masked text reveal with upward movement
  // 1 = settle (600-1500ms) - full greeting visible, subtle highlight sheen across "Lakshya"
  // 2 = masked exit (1500-2500ms) - horizontal masking transition with slight directional drift
  // 3 = hero reveal (2500-3200ms) - overlay fades out smoothly revealing the hero
  // 4 = finished & unmounted (>3200ms)
  const [stage, setStage] = useState<0 | 1 | 2 | 3 | 4>(0);
  const [highlightActive, setHighlightActive] = useState(false);
  const [fadingNearEnd, setFadingNearEnd] = useState(false);

  // Keep references to active timeouts so they can be cleaned up on early dismiss
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const markGreeted = () => {
    try {
      sessionStorage.setItem("portfolio_greeted", "true");
    } catch {
      // Ignore storage errors in private/incognito modes
    }
  };

  const dismissQuickly = useCallback(() => {
    clearAllTimers();
    markGreeted();
    document.body.style.overflow = "";
    setStage(3);
    const t = setTimeout(() => {
      setStage(4);
    }, 250);
    timersRef.current.push(t);
  }, []);

  const startMaskedExit = useCallback(() => {
    // Stage 2: Start horizontal mask wipe
    setStage(2);
    markGreeted();

    // 2,200ms: Restrained fade near the end of the text wipe (700ms into the 1,000ms wipe)
    const tEndFade = setTimeout(() => {
      setFadingNearEnd(true);
    }, 700);

    // Stage 3: At 2,500ms (1,000ms after exit start), fade overlay to smoothly unveil hero
    const tReveal = setTimeout(() => {
      setStage(3);
      document.body.style.overflow = "";
    }, 1000);

    // Stage 4: At 3,200ms (700ms after hero reveal start), fully unmount
    const tFinish = setTimeout(() => {
      setStage(4);
    }, 1700);

    timersRef.current.push(tEndFade, tReveal, tFinish);
  }, []);

  useEffect(() => {
    // Check session storage so intro only runs on initial page entry
    const alreadyGreeted = (() => {
      try {
        return sessionStorage.getItem("portfolio_greeted") === "true";
      } catch {
        return false;
      }
    })();

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadyGreeted || prefersReducedMotion) {
      setStage(4);
      return;
    }

    setMounted(true);
    document.body.style.overflow = "hidden";

    // 1. 0–600 ms: Entrance reveal with smooth upward glide
    const tSettle = setTimeout(() => {
      setStage(1);
    }, 600);

    // 2. 750–1,450 ms: Settle highlight sheen passes gently over "Lakshya"
    const tHighlight = setTimeout(() => {
      setHighlightActive(true);
    }, 750);

    // 3. 1,500–2,500 ms: Start noticeable horizontal masking transition
    const tStartExit = setTimeout(() => {
      startMaskedExit();
    }, 1500);

    timersRef.current.push(tSettle, tHighlight, tStartExit);

    // Non-blocking interaction: clicking or pressing Escape/Enter/Space dismisses immediately
    const handleDismiss = () => {
      dismissQuickly();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        dismissQuickly();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("pointerdown", handleDismiss, { once: true });

    return () => {
      clearAllTimers();
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("pointerdown", handleDismiss);
      document.body.style.overflow = "";
    };
  }, [startMaskedExit, dismissQuickly]);

  if (!mounted || stage === 4) return null;

  const isEntering = stage === 0;
  const isMasking = stage >= 2;
  const isOverlayFading = stage >= 3;

  return (
    <div
      role="region"
      aria-label="Welcome greeting"
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#f8fafc] dark:bg-[#0a0a0f] select-none transition-opacity duration-700 ease-out ${
        isOverlayFading
          ? "opacity-0 pointer-events-none"
          : "opacity-100 cursor-pointer"
      }`}
    >
      {/* Subtle ambient lighting consistent with portfolio background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[25%] -left-[15%] w-[60vw] h-[60vw] max-w-[550px] max-h-[550px] rounded-full bg-primary-500/5 dark:bg-primary-500/10 blur-[100px]" />
        <div className="absolute -bottom-[25%] -right-[15%] w-[60vw] h-[60vw] max-w-[550px] max-h-[550px] rounded-full bg-accent-500/5 dark:bg-accent-500/10 blur-[100px]" />
      </div>

      {/* Masked text reveal container with gentle vertical boundary */}
      <div className="relative overflow-hidden px-6 py-4">
        {/* The greeting text wrapper with entrance slide & horizontal mask exit */}
        <div
          style={{
            clipPath: isMasking ? "inset(0 0 0 100%)" : "inset(0 0 0 0%)",
            transition: isMasking
              ? "clip-path 950ms cubic-bezier(0.65, 0, 0.35, 1), transform 950ms cubic-bezier(0.65, 0, 0.35, 1), opacity 350ms ease-out"
              : "opacity 600ms cubic-bezier(0.16, 1, 0.3, 1), transform 600ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
          className={`relative inline-flex items-baseline justify-center flex-wrap font-display font-bold tracking-tight text-3xl sm:text-5xl md:text-6xl lg:text-7xl motion-reduce:transition-none ${
            isEntering
              ? "opacity-0 translate-y-8"
              : isMasking
              ? `translate-x-3.5 sm:translate-x-4 ${
                  fadingNearEnd ? "opacity-0" : "opacity-95"
                }`
              : "opacity-100 translate-y-0 translate-x-0"
          }`}
        >
          {/* Main greeting prefix */}
          <span className="text-gray-900 dark:text-white">
            Hey, I’m&nbsp;
          </span>

          {/* Accent-emphasized name with settle highlight sheen */}
          <span className="relative inline-block overflow-hidden align-baseline rounded-sm px-1 -mx-1">
            <span className="relative z-10 text-primary-600 dark:text-primary-400">
              Lakshya
            </span>

            {/* Settle motion detail: delicate light sheen sweep across Lakshya */}
            <span
              aria-hidden="true"
              className={`absolute inset-0 z-20 pointer-events-none transition-transform duration-700 ease-in-out ${
                highlightActive ? "translate-x-[160%]" : "-translate-x-full"
              }`}
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.45) 45%, rgba(16,185,129,0.3) 70%, transparent 100%)",
              }}
            />

            {/* Settle accent underline expanding into place */}
            <span
              aria-hidden="true"
              className={`absolute bottom-0.5 left-1 right-1 h-[2px] bg-gradient-to-r from-primary-500 via-primary-400 to-accent-400 rounded-full transition-all duration-600 ease-out origin-left pointer-events-none ${
                highlightActive
                  ? "scale-x-100 opacity-90"
                  : "scale-x-0 opacity-0"
              }`}
            />
          </span>

          {/* Trailing accent dot */}
          <span className="text-primary-500 ml-0.5 sm:ml-1">.</span>
        </div>

        {/* Noticeable moving edge bar that sweeps across the greeting in exact lockstep */}
        <div
          style={{
            left: isMasking ? "100%" : "0%",
            transition: isMasking
              ? "left 950ms cubic-bezier(0.65, 0, 0.35, 1), opacity 350ms ease"
              : "none",
          }}
          className={`absolute -top-3 -bottom-3 w-[2.5px] bg-gradient-to-b from-transparent via-primary-500 dark:via-primary-400 to-transparent shadow-[0_0_16px_rgba(16,185,129,0.85)] pointer-events-none ${
            stage === 2 && !fadingNearEnd ? "opacity-100" : "opacity-0"
          }`}
        />
      </div>
    </div>
  );
}
