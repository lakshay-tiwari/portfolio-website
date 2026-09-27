import { Link } from "react-router-dom";
import { ArrowUp } from "lucide-react";
import { socialLinks } from "@/data/social";
import { siteConfig } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-gray-200/80 dark:border-white/10 py-12 bg-gradient-to-b from-transparent to-gray-50/50 dark:from-transparent dark:to-transparent">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link to="/" className="text-lg font-display font-bold text-gray-900 dark:text-white">
              {siteConfig.name.split(" ").map((w) => w[0]).join("")}
              <span className="text-primary-500">.</span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">{siteConfig.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  className="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>

          <a
            href="#main"
            className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Back to top
            <span className="p-1.5 rounded-lg border border-gray-200 dark:border-white/10">
              <ArrowUp className="w-4 h-4" />
            </span>
          </a>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 text-center text-sm text-gray-400 dark:text-gray-500">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Built with love
          </p>
        </div>
      </div>
    </footer>
  );
}
