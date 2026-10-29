"use client";

import { useState } from "react";
import {
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Briefcase,
  Send,
} from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { socialLinks } from "@/data/social";
import { siteConfig } from "@/data/site";

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = siteConfig.email;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Filter out email from the social channels grid since email is already the main heroic element
  const socialChannels = socialLinks.filter((s) => !["email", "gmail", "mail"].includes(s.name.toLowerCase()));

  return (
    <section id="contact" className="section-padding relative overflow-hidden section-gradient-warm">
      <div className="section-container relative z-10">
        {/* Section Header */}
        <Reveal>
          <div className="mb-10 md:mb-14 text-center">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-600 dark:text-primary-400 text-xs font-mono font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              <span>Available for opportunities</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
              Let&apos;s create something{" "}
              <span className="text-gradient">remarkable</span>.
            </h2>
            <p className="mt-3 md:mt-4 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed">
              Whether you have an engineering role, an ambitious project, or just want to chat AI & systems — my inbox is always open.
            </p>
          </div>
        </Reveal>

        {/* Premium Contact Showcase Card */}
        <Reveal delay={150}>
          <div className="relative rounded-3xl border border-gray-200/80 dark:border-white/10 p-5 sm:p-8 md:p-10 bg-white/60 dark:bg-white/[0.02] backdrop-blur-xl shadow-xl shadow-gray-900/5 dark:shadow-black/20 overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-500/10 dark:bg-primary-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent-500/10 dark:bg-accent-500/15 rounded-full blur-3xl pointer-events-none" />

            {/* Main Interactive Email Banner */}
            <div className="relative z-10 p-4 sm:p-6 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-md shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
                
                {/* Email details */}
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-primary-500/10 text-primary-600 dark:text-primary-400 shrink-0">
                    <Mail className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-mono font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400 block mb-0.5">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-base sm:text-lg md:text-xl font-display font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors truncate block"
                      title="Compose email to Lakshya"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                {/* Primary Actions: Copy & Send */}
                <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label={copied ? "Email copied to clipboard" : "Copy email address"}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border border-gray-200 dark:border-white/15 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-400 dark:hover:border-primary-500/40 bg-gray-50 dark:bg-white/5 hover:bg-primary-50/50 dark:hover:bg-primary-500/10 transition-all duration-200 active:scale-95 cursor-pointer shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-500" />
                        <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>

                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-primary-700 hover:bg-primary-800 dark:bg-primary-700 dark:hover:bg-primary-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                  >
                    <span>Say Hello</span>
                    <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Status Bento Highlights */}
            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6">
              <div className="p-4 rounded-2xl border border-gray-200/60 dark:border-white/5 bg-gray-50/60 dark:bg-white/[0.02] backdrop-blur-sm">
                <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                  <span>Focus Areas</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Full-Stack &amp; AI Systems
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Next.js, FastAPI, Agentic RAG
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-gray-200/60 dark:border-white/5 bg-gray-50/60 dark:bg-white/[0.02] backdrop-blur-sm">
                <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-primary-500" />
                  <span>Location</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {siteConfig.location}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  IST (UTC +5:30) • Open to Remote
                </p>
              </div>

              <div className="p-4 rounded-2xl border border-gray-200/60 dark:border-white/5 bg-gray-50/60 dark:bg-white/[0.02] backdrop-blur-sm">
                <div className="flex items-center gap-2.5 text-xs font-mono font-medium text-gray-500 dark:text-gray-400 mb-1">
                  <Briefcase className="w-3.5 h-3.5 text-primary-500" />
                  <span>Opportunities</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Full-Time &amp; Freelance
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  AI &amp; Software Engineering
                </p>
              </div>
            </div>

            {/* Social Channels Strip */}
            <div className="relative z-10 mt-6 sm:mt-8 pt-6 border-t border-gray-200/60 dark:border-white/10">
              <p className="text-xs font-mono font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400 mb-3 text-center sm:text-left">
                Connect Across Platforms
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 sm:gap-3">
                {socialChannels.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex items-center justify-between p-3 rounded-xl border border-gray-200/70 dark:border-white/10 bg-white/40 dark:bg-white/[0.02] ${social.hoverBorder || "hover:border-primary-400"} ${social.hoverBg || "hover:bg-primary-50/50 dark:hover:bg-primary-500/10"} text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-200 hover:-translate-y-0.5 active:scale-95 shadow-sm hover:shadow-md`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span className="text-xs sm:text-sm font-medium truncate">
                          {social.name}
                        </span>
                      </div>
                      <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-primary-500 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                    </a>
                  );
                })}
              </div>
            </div>

          </div>
        </Reveal>
      </div>
    </section>
  );
}
