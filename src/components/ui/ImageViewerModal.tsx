"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export type ImageViewerModalProps = {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  alt: string;
  title?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
};

export function ImageViewerModal({
  isOpen,
  onClose,
  src,
  alt,
  title,
  triggerRef,
}: ImageViewerModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Save current active element to restore focus on close
    previousActiveElementRef.current = document.activeElement as HTMLElement;

    // Prevent background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Focus close button on open
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      // Simple focus trap: keep Tab inside the modal
      if (e.key === "Tab") {
        e.preventDefault();
        closeBtnRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const currentTrigger = triggerRef?.current;

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);

      // Restore focus without jumping scroll position
      const targetToFocus = currentTrigger || previousActiveElementRef.current;
      if (targetToFocus && typeof targetToFocus.focus === "function") {
        targetToFocus.focus({ preventScroll: true });
      }
    };
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || alt || "Full-screen image viewer"}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-md cursor-zoom-out animate-fade-in transition-all motion-reduce:animate-none"
    >
      {/* Top action bar with accessible close button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-3">
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label="Close image viewer"
          className="p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white/90 hover:text-white border border-white/20 backdrop-blur-md shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black cursor-pointer"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Main Image Container: stops click propagation so clicking the image doesn't close modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-[94vw] max-h-[85vh] sm:max-w-[88vw] sm:max-h-[88vh] flex flex-col items-center cursor-default animate-scale-in motion-reduce:animate-none"
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-[82vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl select-none ring-1 ring-white/10"
        />

        {/* Optional caption badge */}
        {(title || alt) && (
          <div className="mt-3.5 px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-xs sm:text-sm font-medium text-gray-200 shadow-lg select-none">
            {title || alt}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
