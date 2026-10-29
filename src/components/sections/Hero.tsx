"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowDown, ArrowUpRight, BadgeCheck, MapPin, ZoomIn } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { socialLinks } from "@/data/social";
import { siteConfig } from "@/data/site";
import { ImageViewerModal } from "@/components/ui/ImageViewerModal";

function Typewriter({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const word = words[currentWordIndex % words.length];
    const typingSpeed = isDeleting ? 40 : 75;

    if (!isDeleting && currentText === word) {
      const timeout = setTimeout(() => setIsDeleting(true), 2200);
      return () => clearTimeout(timeout);
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setCurrentText(
        word.substring(
          0,
          isDeleting ? currentText.length - 1 : currentText.length + 1
        )
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words]);

  return (
    <span className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold font-display">
      <span>{currentText}</span>
      <span className="ml-0.5 w-[2px] h-5 sm:h-6 bg-primary-500 animate-pulse" />
    </span>
  );
}

export function Hero() {
  const roles =
    siteConfig.roles && siteConfig.roles.length > 0
      ? siteConfig.roles
      : [siteConfig.role];

  // Full-screen image viewer state & trigger refs for accessibility focus restoration
  const [viewerState, setViewerState] = useState<{
    isOpen: boolean;
    src: string;
    alt: string;
    title: string;
    triggerRef?: React.RefObject<HTMLElement | null>;
  }>({
    isOpen: false,
    src: "",
    alt: "",
    title: "",
  });

  const avatarTriggerRef = useRef<HTMLDivElement>(null);

  const openAvatarViewer = () => {
    setViewerState({
      isOpen: true,
      src: siteConfig.profileImage,
      alt: `${siteConfig.name} - Profile Photo`,
      title: `${siteConfig.name} — Profile Photo`,
      triggerRef: avatarTriggerRef,
    });
  };

  const closeViewer = () => {
    setViewerState((prev) => ({ ...prev, isOpen: false }));
  };

  return (
    <section id="main" className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-28 pb-16">
      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern opacity-60 dark:opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none" />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 dark:bg-accent-500/15 rounded-full blur-3xl animate-pulse-slow pointer-events-none"
        style={{ animationDelay: "2s" }}
      />

      <div className="section-container relative z-10">
        <Reveal>
          {/* Main Profile Container with subtle dashed border */}
          <div className="relative rounded-3xl border border-dashed border-gray-300/90 dark:border-white/15 p-3 sm:p-5 md:p-6 bg-white/40 dark:bg-white/[0.02] backdrop-blur-sm shadow-sm">
            
            {/* Banner Image Container */}
            <div className="relative w-full aspect-[16/9] sm:aspect-[2.2/1] rounded-2xl overflow-hidden border border-gray-200/60 dark:border-white/10 shadow-inner bg-gray-900 select-none">
              <img
                src={siteConfig.bannerImage}
                alt={`${siteConfig.name} profile cover banner`}
                className="w-full h-full object-cover object-[center_82%] select-none pointer-events-none"
                loading="eager"
              />
              {/* Subtle gradient overlay to enhance depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Avatar & Action Buttons Row (Overlapping the banner) */}
            <div className="relative z-20 flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-14 md:-mt-18 px-2 sm:px-4">
              
              {/* Overlapping Clickable Profile Avatar with thick accent border & gap */}
              <div
                ref={avatarTriggerRef}
                role="button"
                tabIndex={0}
                onClick={openAvatarViewer}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openAvatarViewer();
                  }
                }}
                aria-label={`View ${siteConfig.name}'s profile photo in full screen`}
                className="group relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full p-1 sm:p-1.5 bg-white dark:bg-[#0a0a0f] ring-4 ring-primary-500 dark:ring-primary-400 shadow-xl shrink-0 cursor-zoom-in focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-400 focus-visible:ring-offset-4 dark:focus-visible:ring-offset-[#0a0a0f] transition-transform duration-300 hover:scale-105"
              >
                <img
                  src={siteConfig.profileImage}
                  alt={siteConfig.name}
                  className="w-full h-full object-cover rounded-full select-none"
                  loading="eager"
                />

                {/* Hover overlay with zoom icon */}
                <div className="absolute inset-1 sm:inset-1.5 rounded-full bg-black/45 backdrop-blur-[2px] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200 pointer-events-none">
                  <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" />
                </div>
              </div>

              {/* Action Buttons: aligned right on desktop, beneath avatar on mobile */}
              <div className="flex items-center gap-2.5 sm:gap-3 pt-1 sm:pt-0 shrink-0">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary-700 hover:bg-primary-800 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-xs sm:text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 shadow-md shadow-primary-500/20 active:scale-95"
                >
                  <span>View Projects</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <a
                  href={siteConfig.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-gray-300 dark:border-white/15 text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-400 dark:hover:border-primary-500/40 hover:bg-primary-50/50 dark:hover:bg-primary-500/5 text-xs sm:text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
                >
                  <span>View Resume</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Profile Information */}
            <div className="px-2 sm:px-4 mt-5 sm:mt-6 space-y-3">
              {/* Name & Verified Badge */}
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
                  {siteConfig.name}
                </h1>
                <BadgeCheck className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 fill-sky-500/15 shrink-0" />
              </div>

              {/* Animated Role with Typewriter Cursor */}
              <div className="text-base sm:text-lg md:text-xl font-display">
                <Typewriter words={roles} />
              </div>

              {/* Tagline & Location */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5 font-medium text-gray-600 dark:text-gray-300">
                  <MapPin className="w-3.5 h-3.5 text-primary-500 shrink-0" />
                  {siteConfig.location}
                </span>
                <span className="text-gray-300 dark:text-gray-700">•</span>
                <span>{siteConfig.tagline}</span>
              </div>

              {/* Bio */}
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl pt-1">
                {siteConfig.bio}
              </p>

              {/* Social Links with Tooltips */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      title={social.name}
                      className={`group relative p-2.5 sm:p-3 rounded-xl border border-gray-200/80 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] ${social.hoverBorder || "hover:border-primary-300 dark:hover:border-primary-500/40"} ${social.hoverBg || "hover:bg-primary-50 dark:hover:bg-primary-500/5"} transition-all duration-300 hover:-translate-y-0.5 shadow-sm hover:shadow-md`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 group-hover:scale-110" />
                      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-xs font-medium text-white bg-gray-900/90 dark:bg-gray-800/95 border border-white/10 shadow-lg backdrop-blur-sm whitespace-nowrap opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 z-30">
                        {social.name}
                        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-900/90 dark:bg-gray-800/95 border-r border-b border-white/10" />
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </Reveal>
      </div>

      {/* Subtle scroll down indicator */}
      <a
        href="#activity"
        aria-label="Scroll to activity"
        className="mt-10 mx-auto text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors animate-bounce"
      >
        <ArrowDown className="w-5 h-5" />
      </a>

      {/* Full-Screen Image Lightbox Modal */}
      <ImageViewerModal
        isOpen={viewerState.isOpen}
        onClose={closeViewer}
        src={viewerState.src}
        alt={viewerState.alt}
        title={viewerState.title}
        triggerRef={viewerState.triggerRef}
      />
    </section>
  );
}
