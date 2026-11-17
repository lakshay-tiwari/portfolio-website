"use client";

export interface SpeechBubbleProps {
  /** Text content of the bubble */
  text: string;
  /** Current facing direction of the dog (+1 = right, -1 = left) */
  facing?: number;
  /** Whether the bubble is visibly active */
  visible: boolean;
}

/**
 * SpeechBubble
 * 
 * Floating, unobtrusive micro-dialogue bubble above the dog's head.
 * Inverts horizontal scale when the dog is flipped to ensure text is never mirrored backwards.
 */
export function SpeechBubble({ text, facing = 1, visible }: SpeechBubbleProps) {
  if (!text) return null;

  return (
    <div
      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none select-none z-10 transition-all duration-300 ease-out origin-bottom ${
        visible
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-75 translate-y-2 pointer-events-none"
      }`}
      style={{
        // Cancel parent container scaleX(-1) so text is always readable
        transform: `translateX(-50%) scaleX(${facing < 0 ? -1 : 1})`,
      }}
      aria-hidden="true"
    >
      <div className="relative px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide whitespace-nowrap bg-white/95 dark:bg-gray-900/95 text-gray-800 dark:text-gray-100 border border-amber-200/80 dark:border-amber-500/40 shadow-[0_4px_14px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-sm">
        {text}

        {/* Downward pointing speech triangle tail */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-x-4 border-x-transparent border-t-[5px] border-t-amber-200/80 dark:border-t-amber-500/40" />
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] w-0 h-0 border-x-[3.5px] border-x-transparent border-t-[4px] border-t-white dark:border-t-gray-900" />
      </div>
    </div>
  );
}
