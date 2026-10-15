"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { resolveTheme } from "@/config/theme";

export function ThemeSwitcher() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = resolveTheme(stored, prefersDark);
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={dark}
      onClick={toggle}
      suppressHydrationWarning
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="relative inline-flex items-center w-[52px] h-[28px] p-[3px] rounded-full bg-neutral-200/90 dark:bg-[#232328] border border-gray-300/80 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20 transition-colors duration-300 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0a0a0f] select-none shrink-0"
    >
      <span
        className={`relative flex items-center justify-center w-[22px] h-[22px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
          dark
            ? "translate-x-[24px] bg-[#18181c] border border-white/10 shadow-[0_1px_3px_rgba(0,0,0,0.4)]"
            : "translate-x-0 bg-white border border-black/5 shadow-[0_1px_3px_rgba(0,0,0,0.15)]"
        }`}
      >
        {/* Sun Icon (Light Mode) */}
        <Sun
          className={`absolute w-3.5 h-3.5 text-amber-500 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
            dark ? "opacity-0 -rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
          }`}
          strokeWidth={2}
        />

        {/* Moon Icon (Dark Mode) */}
        <Moon
          className={`absolute w-3.5 h-3.5 text-white/95 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none ${
            dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-50"
          }`}
          strokeWidth={2}
        />
      </span>
    </button>
  );
}
