import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Home, Briefcase, Code2, Sparkles, Mail } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { siteConfig } from "@/data/site";

const navIcons: Record<string, React.ElementType> = {
  Main: Home,
  Experience: Briefcase,
  Projects: Code2,
  Skills: Sparkles,
  Contact: Mail,
};

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#main");
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);

  const [indicator, setIndicator] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    opacity: 0,
  });

  const navRef = useRef<HTMLElement>(null);
  const itemsRef = useRef<Map<string, HTMLElement>>(new Map());

  const location = useLocation();
  const navigate = useNavigate();

  const isHashLink = (href: string) => href.startsWith("#");

  const updateIndicatorTo = (href: string) => {
    const nav = navRef.current;
    const el = itemsRef.current.get(href);
    if (!nav || !el) {
      setIndicator((prev) => ({ ...prev, opacity: 0 }));
      return;
    }

    const navRect = nav.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();

    setIndicator({
      left: elRect.left - navRect.left,
      top: elRect.top - navRect.top,
      width: elRect.width,
      height: elRect.height,
      opacity: 1,
    });
  };

  // Track active section and scroll state
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Top of page -> #main
      if (window.scrollY < 120) {
        setActiveSection("#main");
        return;
      }

      // Bottom of page -> #contact
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 80) {
        setActiveSection("#contact");
        return;
      }

      const sectionIds = ["contact", "skills", "projects", "experience", "main"];
      const scrollPosition = window.scrollY + 220;

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && scrollPosition >= el.offsetTop) {
          setActiveSection(`#${id}`);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update sliding indicator whenever active section or hovered item changes
  useEffect(() => {
    const target = hoveredHref || activeSection;
    updateIndicatorTo(target);
  }, [activeSection, hoveredHref]);

  // Re-calculate indicator on window resize or initial render
  useEffect(() => {
    const handleResize = () => {
      updateIndicatorTo(hoveredHref || activeSection);
    };

    window.addEventListener("resize", handleResize);
    const timer = setTimeout(handleResize, 100);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [activeSection, hoveredHref]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHashLink(href)) return;

    e.preventDefault();
    setMobileOpen(false);
    setActiveSection(href);
    setHoveredHref(null);
    updateIndicatorTo(href);

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isActive = (href: string) => {
    if (href.startsWith("/")) return location.pathname === href;
    if (location.pathname !== "/") return false;
    return activeSection === href;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-[#0a0a0f]/80 border-b border-gray-200/80 dark:border-white/10 transition-all duration-300 ${
          scrolled ? "shadow-sm" : ""
        }`}
      >
        <div className="section-container flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-display font-bold tracking-tight text-gray-900 dark:text-white transition-transform group-hover:scale-105">
              {siteConfig.name.split(" ").map((w) => w[0]).join("")}
              <span className="text-primary-500">.</span>
            </span>
          </Link>

          {/* Smooth Sliding Pill Navigation */}
          <nav
            ref={navRef}
            aria-label="Main Navigation"
            onMouseLeave={() => {
              setHoveredHref(null);
              updateIndicatorTo(activeSection);
            }}
            className="hidden md:flex relative items-center gap-1"
          >
            {/* Smooth Sliding Pill Indicator */}
            <div
              className="absolute rounded-full pointer-events-none bg-gray-200/80 dark:bg-white/10 shadow-sm border border-gray-300/40 dark:border-white/10"
              style={{
                transform: `translate3d(${indicator.left}px, ${indicator.top}px, 0)`,
                width: `${indicator.width}px`,
                height: `${indicator.height}px`,
                opacity: indicator.opacity,
                transition:
                  "transform 260ms cubic-bezier(0.16, 1, 0.3, 1), width 260ms cubic-bezier(0.16, 1, 0.3, 1), opacity 200ms ease",
              }}
            />

            {navigationItems.map((item) => {
              const Icon = navIcons[item.label];
              const active = isActive(item.href);
              const isHovered = hoveredHref === item.href;
              const isCurrentTarget = isHovered || (!hoveredHref && active);
              const Component = isHashLink(item.href) ? "a" : Link;
              const linkProps = isHashLink(item.href)
                ? {
                    href: item.href,
                    onClick: (e: MouseEvent<HTMLAnchorElement>) => handleNavClick(e, item.href),
                  }
                : { to: item.href };

              return (
                <Component
                  key={item.label}
                  ref={(el) => {
                    if (el) itemsRef.current.set(item.href, el);
                    else itemsRef.current.delete(item.href);
                  }}
                  onMouseEnter={() => {
                    setHoveredHref(item.href);
                    updateIndicatorTo(item.href);
                  }}
                  {...(linkProps as any)}
                  className={`relative z-10 flex items-center gap-2 px-4 py-2.5 translate-y-px text-sm font-medium rounded-full transition-colors duration-200 cursor-pointer select-none ${
                    isCurrentTarget
                      ? "text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                        active
                          ? "text-primary-600 dark:text-primary-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    />
                  )}
                  <span>{item.label}</span>
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse shrink-0" />
                  )}
                </Component>
              );
            })}
          </nav>

          {/* Right: Theme Switcher & Mobile Menu Toggle */}
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-md pt-20 px-4 transition-all duration-300 flex flex-col items-center">
          <div className="absolute inset-0 -z-10" onClick={() => setMobileOpen(false)} />

          <div className="w-full max-w-sm rounded-3xl p-3 bg-white/90 dark:bg-[#0f0f15]/95 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_16px_40px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.7)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col gap-1.5 animate-scale-in">
            <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-white/80 dark:via-white/30 to-transparent mb-1" />

            {navigationItems.map((item, i) => {
              const Icon = navIcons[item.label];
              const active = isActive(item.href);
              const Component = isHashLink(item.href) ? "a" : Link;
              const linkProps = isHashLink(item.href)
                ? {
                    href: item.href,
                    onClick: (e: MouseEvent<HTMLAnchorElement>) => handleNavClick(e, item.href),
                  }
                : { to: item.href };

              return (
                <Component
                  key={item.label}
                  {...(linkProps as any)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-medium transition-all duration-200 ${
                    active
                      ? "text-gray-900 dark:text-white bg-white/90 dark:bg-white/10 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${i * 40}ms both`,
                  }}
                >
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div
                        className={`p-2 rounded-xl ${
                          active
                            ? "bg-primary-500/15 text-primary-600 dark:text-primary-400"
                            : "bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    )}
                    <span>{item.label}</span>
                  </div>

                  {active && (
                    <span className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(16,185,129,0.9)]" />
                  )}
                </Component>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
