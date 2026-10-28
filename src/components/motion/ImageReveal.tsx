"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ImageRevealProps = {
  children?: ReactNode;
  className?: string;
  src: string;
  alt: string;
  delay?: number;
  imageClassName?: string;
};

export function ImageReveal({
  children,
  className = "",
  src,
  alt,
  delay = 0,
  imageClassName = "object-cover",
}: ImageRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.05, rootMargin: "100px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden motion-reduce:!transition-none motion-reduce:!transform-none motion-reduce:!opacity-100 ${className}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1)" : "scale(0.98)",
        transition: `opacity 0.5s ease-out ${delay}ms, transform 0.5s ease-out ${delay}ms`,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="eager"
        decoding="async"
        className={`w-full h-full ${imageClassName}`}
      />
      {children}
    </div>
  );
}
