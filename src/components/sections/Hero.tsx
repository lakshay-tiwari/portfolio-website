import { ArrowDown, FileText, MapPin } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { socialLinks } from "@/data/social";
import { siteConfig } from "@/data/site";

export function Hero() {
  return (
    <section id="main" className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern-light dark:bg-grid-pattern opacity-60 dark:opacity-40" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/15 dark:bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/15 dark:bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary-500/5 to-accent-500/5 dark:from-primary-500/8 dark:to-accent-500/8 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl">
          <Reveal delay={100}>
            <div className="flex items-center gap-2 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-success-500" />
              </span>
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Available for new opportunities
              </span>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <p className="text-sm font-mono text-primary-600 dark:text-primary-400 mb-3">
              Hi, my name is
            </p>
          </Reveal>

          <Reveal delay={300}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-gray-900 dark:text-white mb-3">
              {siteConfig.name}
            </h1>
          </Reveal>

          <Reveal delay={400}>
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-gradient mb-5">
              {siteConfig.tagline}
            </h2>
          </Reveal>

          <Reveal delay={500}>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mb-6">
              {siteConfig.bio}
            </p>
          </Reveal>

          <Reveal delay={600}>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
              <MapPin className="w-4 h-4" />
              {siteConfig.location}
            </div>
          </Reveal>

          <Reveal delay={700}>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={siteConfig.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium transition-colors hover:-translate-y-0.5 duration-300"
              >
                <FileText className="w-4 h-4" />
                View Resume
              </a>

              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="group relative p-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>

      <a
        href="#experience"
        aria-label="Scroll to experience"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 dark:text-gray-500 hover:text-primary-500 transition-colors animate-bounce"
      >
        <ArrowDown className="w-6 h-6" />
      </a>
    </section>
  );
}
