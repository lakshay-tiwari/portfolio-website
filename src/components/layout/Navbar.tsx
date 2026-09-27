import { useEffect, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { navigationItems } from "@/data/navigation";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { siteConfig } from "@/data/site";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isHashLink = (href: string) => href.startsWith("#");

  const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!isHashLink(href)) return;

    e.preventDefault();
    setMobileOpen(false);

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
    return href === "#main" ? window.scrollY < 200 : false;
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-sm" : "bg-transparent"
        }`}
      >
        <nav className="section-container relative flex items-center justify-between h-16 md:h-20 after:absolute after:left-1/2 after:-bottom-px after:-translate-x-1/2 after:w-screen after:h-px after:bg-white/70 dark:after:bg-[#0a0a0f]/80 after:backdrop-blur-xl after:pointer-events-none after:transition-colors after:duration-500">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-xl font-display font-bold tracking-tight text-gray-900 dark:text-white">
              {siteConfig.name.split(" ").map((w) => w[0]).join("")}
              <span className="text-primary-500">.</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) =>
              isHashLink(item.href) ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    isActive(item.href)
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "text-primary-600 dark:text-primary-400"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden bg-[#f8fafc] dark:bg-[#0a0a0f] pt-16">
          <div className="section-container py-8 flex flex-col gap-2">
            {navigationItems.map((item, i) =>
              isHashLink(item.href) ? (
                <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${i * 50}ms both`,
                  }}
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.label}
                  to={item.href}
                  className="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-white/5 rounded-xl transition-colors"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${i * 50}ms both`,
                  }}
                >
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
}
