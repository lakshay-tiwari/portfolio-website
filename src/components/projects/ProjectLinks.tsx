import { ExternalLink, FileText } from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import type { Project } from "@/data/projects";

type ProjectLinksProps = {
  project: Project;
  size?: "sm" | "md";
};

export function ProjectLinks({ project, size = "md" }: ProjectLinksProps) {
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const btnSize = size === "sm" ? "p-2" : "p-2.5";

  const links = [
    {
      href: project.github,
      label: "GitHub",
      ariaLabel: `${project.title} on GitHub`,
      icon: GitHubIcon,
    },
    {
      href: project.notion,
      label: "Notion",
      ariaLabel: `${project.title} documentation`,
      icon: FileText,
    },
    ...(project.live
      ? [
          {
            href: project.live,
            label: "Live Demo",
            ariaLabel: `${project.title} live demo`,
            icon: ExternalLink,
          },
        ]
      : []),
  ];

  return (
    <div className="flex items-center gap-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.ariaLabel}
            title={link.label}
            className={`group relative ${btnSize} rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:border-primary-300 dark:hover:border-primary-500/40 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500`}
          >
            <Icon className={sizeClasses} />
            <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md text-xs font-medium text-white bg-gray-900/90 dark:bg-gray-800/95 border border-white/10 shadow-lg backdrop-blur-sm whitespace-nowrap opacity-0 translate-y-1.5 group-hover:opacity-100 group-hover:translate-y-0 group-focus-visible:opacity-100 group-focus-visible:translate-y-0 transition-all duration-200 z-30">
              {link.label}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-900/90 dark:bg-gray-800/95 border-r border-b border-white/10" />
            </span>
          </a>
        );
      })}
    </div>
  );
}
